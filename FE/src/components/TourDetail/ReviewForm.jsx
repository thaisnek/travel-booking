import React, { useState, useEffect } from 'react';
import { FaStar, FaArrowRight } from 'react-icons/fa';
import { canReview, createReview } from '../../services/api';

const ReviewForm = ({ tour, currentUser }) => {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [canReviewStatus, setCanReviewStatus] = useState(false);

  useEffect(() => {
    const checkCanReview = async () => {
      try {
        const result = await canReview(currentUser.userID, tour.tourID);
        setCanReviewStatus(result);
      } catch (error) {
        console.error('Error checking review eligibility:', error);
        setCanReviewStatus(false);
      }
    };
    if (currentUser && tour) {
      checkCanReview();
    }
  }, [currentUser, tour]);

  const handleRating = (value) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    if (!message || rating === 0) {
      alert('Vui lòng chọn đánh giá và nhập nội dung!');
      return;
    }

    const reviewData = {
      tourId: tour.tourID,
      userId: currentUser.userID,
      rating,
      comment: message,
      timestamp: new Date(),
    };

    try {
      await createReview(reviewData);
      setSubmitted(true);
      setRating(0);
      setMessage('');
    } catch (error) {
      alert('Lỗi: ' + error.message);
    }
  };

  return (
    <div className="comment-form bgc-lighter z-1 rel mt-30">
      {canReviewStatus ? (
        submitted ? (
          <p className="text-success">Cảm ơn bạn đã gửi đánh giá!</p>
        ) : (
          <>
            <div className="comment-review-wrap">
              <div className="comment-ratting-item">
                <span class Identifier="title">Đánh giá</span>
                <div className="ratting" id="rating-stars">
                  {[1, 2, 3, 4, 5].map(value => (
                    <FaStar
                      key={value}
                      className={value <= rating ? 'text-warning' : 'text-muted'}
                      style={{ cursor: 'pointer', fontSize: '1.5rem' }}
                      onClick={() => handleRating(value)}
                    />
                  ))}
                </div>
              </div>
            </div>
            <hr className="mt-30 mb-40" />
            <h5>Để lại phản hồi</h5>
            <div className="row gap-20 mt-20">
              <div className="col-md-12">
                <div className="form-group">
                  <label htmlFor="message">Nội dung</label>
                  <textarea
                    name="message"
                    id="message"
                    className="form-control"
                    rows="5"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group mb-0">
                  <button
                    type="button"
                    className="theme-btn bgc-secondary style-two"
                    onClick={handleSubmit}
                  >
                    <span>Gửi đánh giá</span>
                    <FaArrowRight className="ms-2" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )
      ) : (
        <p className="text-muted">
          Bạn cần hoàn thành tour này để có thể gửi đánh giá.
        </p>
      )}
    </div>
  );
};

export default ReviewForm;