import logging
import os
import re
import unicodedata

import pandas as pd
from flask import Flask, jsonify, request
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy import create_engine, text
from sqlalchemy.engine import URL


logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

app = Flask(__name__)

VIETNAMESE_STOPWORDS = {
    "va", "la", "cua", "cac", "da", "trong", "khi", "nay", "mot", "nhung",
    "duoc", "voi", "cho", "thi", "tai", "boi", "ve", "de", "neu", "se",
    "khong", "co", "day", "do", "thay", "ra", "phai", "ai", "gi", "nao",
    "lai", "hon", "nhu", "vay", "chi", "lam", "luc", "nguoi", "nam", "ngay",
}


def get_database_url():
    return URL.create(
        "mysql+mysqlconnector",
        username=os.getenv("DB_USERNAME", "root"),
        password=os.getenv("DB_PASSWORD", "123456"),
        host=os.getenv("DB_HOST", "127.0.0.1"),
        port=int(os.getenv("DB_PORT", "3306")),
        database=os.getenv("DB_NAME", "travel"),
        query={"charset": os.getenv("DB_CHARSET", "utf8mb4")},
    )


def create_connection():
    engine = create_engine(get_database_url(), pool_pre_ping=True)
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
    return engine


def fetch_tours(engine):
    query = """
        SELECT tourid, title, description, duration, price_adult, destination
        FROM tbl_tour
        WHERE availability = TRUE
    """
    return pd.read_sql(query, engine)


def normalize_text(text_value):
    text_value = str(text_value or "").lower().replace("đ", "d")
    text_value = unicodedata.normalize("NFD", text_value)
    return "".join(char for char in text_value if unicodedata.category(char) != "Mn")


def tokenize_text(text_value):
    text_value = normalize_text(text_value)
    tokens = re.findall(r"[\w]+", text_value, flags=re.UNICODE)
    return [token for token in tokens if token not in VIETNAMESE_STOPWORDS and len(token) > 1]


def combine_features(row, columns):
    return " ".join(str(row[column]) for column in columns if pd.notna(row[column]))


def build_similarity(tours_df, feature_columns):
    tours_df = tours_df.copy()
    tours_df["combined_features"] = tours_df.apply(lambda row: combine_features(row, feature_columns), axis=1)

    vectorizer = TfidfVectorizer(tokenizer=tokenize_text, token_pattern=None)
    tfidf_matrix = vectorizer.fit_transform(tours_df["combined_features"])
    return cosine_similarity(tfidf_matrix, tfidf_matrix), tours_df


def get_related_tour_ids(tours_df, tour_id, limit=3):
    if tour_id not in set(tours_df["tourid"].tolist()):
        return None

    feature_columns = ["title", "description", "duration", "price_adult", "destination"]
    cosine_sim, tours_df = build_similarity(tours_df, feature_columns)
    tour_index = tours_df.index[tours_df["tourid"] == tour_id][0]
    scores = sorted(enumerate(cosine_sim[tour_index]), key=lambda item: item[1], reverse=True)
    return [int(tours_df.iloc[index]["tourid"]) for index, score in scores if index != tour_index][:limit]


@app.get("/health")
def health():
    try:
        engine = create_connection()
        engine.dispose()
        return jsonify({"status": "ok"})
    except Exception as exc:
        logger.exception("Health check failed")
        return jsonify({"status": "error", "error": str(exc)}), 500


@app.get("/api/tour-recommendations")
def get_recommendations():
    tour_id = request.args.get("tour_id", type=int)
    if not tour_id:
        return jsonify({"error": "Invalid or missing tour_id parameter"}), 400

    engine = None
    try:
        engine = create_connection()
        tours_df = fetch_tours(engine)
        if tours_df.empty:
            return jsonify({"related_tours": []})

        related_tours = get_related_tour_ids(tours_df, tour_id)
        if related_tours is None:
            return jsonify({"error": f"Tour id {tour_id} not found"}), 404

        return jsonify({"related_tours": related_tours})
    except Exception as exc:
        logger.exception("Failed to get recommendations")
        return jsonify({"error": str(exc)}), 500
    finally:
        if engine is not None:
            engine.dispose()


@app.get("/api/search-tours")
def search_tours():
    keyword = request.args.get("keyword", "").strip()
    if not keyword:
        return jsonify({"error": "Missing search query"}), 400

    engine = None
    try:
        engine = create_connection()
        tours_df = fetch_tours(engine)
        if tours_df.empty:
            return jsonify({"related_tours": []})

        feature_columns = ["title", "description", "destination"]
        tours_df = tours_df.copy()
        tours_df["combined_features"] = tours_df.apply(lambda row: combine_features(row, feature_columns), axis=1)

        vectorizer = TfidfVectorizer(tokenizer=tokenize_text, token_pattern=None)
        tfidf_matrix = vectorizer.fit_transform(tours_df["combined_features"])
        keyword_vector = vectorizer.transform([keyword])

        scores = cosine_similarity(keyword_vector, tfidf_matrix)[0]
        ranked_scores = sorted(enumerate(scores), key=lambda item: item[1], reverse=True)
        related_tours = [
            int(tours_df.iloc[index]["tourid"])
            for index, score in ranked_scores
            if score > 0
        ][:9]

        return jsonify({"related_tours": related_tours})
    except Exception as exc:
        logger.exception("Failed to search tours")
        return jsonify({"error": str(exc)}), 500
    finally:
        if engine is not None:
            engine.dispose()


if __name__ == "__main__":
    debug_enabled = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    app.run(
        host=os.getenv("FLASK_HOST", "127.0.0.1"),
        port=int(os.getenv("FLASK_PORT", "5555")),
        debug=debug_enabled,
        use_reloader=debug_enabled,
    )
