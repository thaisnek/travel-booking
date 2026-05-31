import React, { useEffect, useState } from "react";
import { Table, Button, Spinner } from "react-bootstrap";
import { getAllReviews, deleteReview } from "../../../services/api";
import { FaTrash } from "react-icons/fa";

export default function ReviewTable() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line
  }, [page]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await getAllReviews(page, 9);
      setReviews(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      alert("Lỗi khi tải danh sách review!");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa review này?")) {
      try {
        await deleteReview(id);
        fetchReviews();
      } catch (err) {
        alert("Xóa review thất bại!");
      }
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-sm mt-4">
      <h5 className="mb-3">Reviews</h5>
      {loading ? (
        <div className="text-center my-5"><Spinner animation="border" /></div>
      ) : (
        <Table striped bordered hover responsive size="sm">
          <thead>
            <tr>
              <th>reviewId</th>
              <th>tourId</th>
              <th>userId</th>
              <th>rating</th>
              <th>comment</th>
              <th>timestamp</th>
              <th>Xóa</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">Không có dữ liệu</td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review.reviewId}>
                  <td>{review.reviewId}</td>
                  <td>{review.tourId}</td>
                  <td>{review.userId}</td>
                  <td>{review.rating}</td>
                  <td>{review.comment}</td>
                  <td>{review.timestamp ? new Date(review.timestamp).toLocaleString() : ""}</td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(review.reviewId)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
      <div className="d-flex justify-content-between align-items-center">
        <span>Trang {page + 1} / {totalPages}</span>
        <div>
          <Button size="sm" variant="outline-secondary" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button>
          <Button size="sm" variant="outline-secondary" className="ms-2" disabled={page + 1 === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      </div>
    </div>
  );
}
