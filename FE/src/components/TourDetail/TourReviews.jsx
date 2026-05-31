import React, { useEffect, useMemo, useState } from 'react';
import { FaRegStar, FaStar } from 'react-icons/fa';
import { getReviewsByTourId } from '../../services/api';
import './TourReviews.css';

const formatReviewDate = (value) => {
  if (!value) return 'Chưa cập nhật';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
};

const RatingStars = ({ rating }) => (
  <div className="tour-review-stars" aria-label={`${rating}/5 sao`}>
    {[1, 2, 3, 4, 5].map((value) => (
      value <= rating ? <FaStar key={value} /> : <FaRegStar key={value} />
    ))}
  </div>
);

const TourReviews = ({ tourId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getReviewsByTourId(tourId);
        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (tourId) {
      fetchReviews();
    }
  }, [tourId]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return total / reviews.length;
  }, [reviews]);

  if (loading) {
    return <div className="tour-review-state">Đang tải đánh giá...</div>;
  }

  if (error) {
    return <div className="tour-review-state tour-review-error">Không thể tải đánh giá: {error}</div>;
  }

  if (reviews.length === 0) {
    return (
      <div className="tour-review-empty">
        <div className="tour-review-empty-icon">
          <FaRegStar />
        </div>
        <div>
          <h6>Chưa có đánh giá</h6>
          <p>Hãy là người đầu tiên chia sẻ trải nghiệm sau khi hoàn thành tour.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tour-review-section" id="partials_reviews">
      <div className="tour-review-summary">
        <div>
          <span className="tour-review-label">Điểm trung bình</span>
          <div className="tour-review-score">
            {averageRating.toFixed(1)}
            <span>/5</span>
          </div>
        </div>
        <div className="tour-review-summary-stars">
          <RatingStars rating={Math.round(averageRating)} />
          <span>{reviews.length} đánh giá</span>
        </div>
      </div>

      <div className="tour-review-list">
        {reviews.map((review) => (
          <article key={review.reviewId} className="tour-review-card">
            <div className="tour-review-avatar">{getInitials(review.fullName)}</div>
            <div className="tour-review-content">
              <div className="tour-review-head">
                <div>
                  <h6>{review.fullName || 'Khách hàng'}</h6>
                  <span>{formatReviewDate(review.timestamp)}</span>
                </div>
                <RatingStars rating={review.rating || 0} />
              </div>
              <p>{review.comment}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default TourReviews;
