import React, { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaArrowRight,
  FaClock,
  FaStar
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { canReview, cancelBooking, initiatePayment } from "../../services/api";
import { getCurrentUserId, isAuthenticated } from "../../utils/auth";
import { getTourImageSrc } from "../../utils/tourImages";

const API_URL = "http://localhost:8080/ltweb/api";

const formatCurrency = (value) =>
  (value || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

const formatDate = (value) => {
  if (!value) return "Chưa cập nhật";
  const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (dateOnly) {
    return `${dateOnly[3]}/${dateOnly[2]}/${dateOnly[1]}`;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("vi-VN");
};

const formatDateTime = (value) => {
  if (!value) return "Chưa cập nhật";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const MyTour = () => {
  const navigate = useNavigate();
  const userId = getCurrentUserId();
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [processingPaymentId, setProcessingPaymentId] = useState(null);
  const [processingCancelId, setProcessingCancelId] = useState(null);
  const [reviewEligibility, setReviewEligibility] = useState({});

  useEffect(() => {
    if (!isAuthenticated() || !userId) {
      alert("Bạn cần đăng nhập để xem tour đã đặt!");
      navigate("/login", { replace: true, state: { from: "/history" } });
      return;
    }

    const token = localStorage.getItem("token");
    setLoading(true);
    axios
      .get(`${API_URL}/history/user/${userId}`, {
        params: { page: currentPage - 1, size: 9 },
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      .then((response) => {
        setHistories(response.data.content || []);
        setTotalPages(Math.max(response.data.totalPages || 0, 1));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      });
  }, [currentPage, userId, navigate]);

  // Hàm kiểm tra điều kiện hiển thị
  const shouldShowHistory = (history) => {
    if (!history?.tourResponse) return false;
    const bookingStatus = history.bookingResponse?.bookingStatus;

    if (history.actionType === "REVIEW") return true;
    if (history.actionType === "BOOK" && (bookingStatus === "PENDING" || bookingStatus === "CONFIRMED")) return true;
    if (history.actionType === "PAY" && bookingStatus === "CONFIRMED") return true;
    if (history.actionType === "CANCEL" && bookingStatus === "CANCELLED") return true;
    return false;
  };

  const getHistoryPriority = (history) => {
    switch (history.actionType) {
      case "CANCEL":
        return 4;
      case "PAY":
        return 3;
      case "BOOK":
        return 2;
      case "REVIEW":
        return 1;
      default:
        return 0;
    }
  };

  // Lọc danh sách theo điều kiện
  const filteredHistories = Object.values(
    histories.filter(shouldShowHistory).reduce((acc, history) => {
      const bookingId = history.bookingResponse?.bookingID;
      const key = bookingId ? `booking-${bookingId}` : `history-${history.historyID}`;
      const current = acc[key];

      if (
        !current ||
        getHistoryPriority(history) > getHistoryPriority(current) ||
        (getHistoryPriority(history) === getHistoryPriority(current) &&
          new Date(history.timestamp || 0) > new Date(current.timestamp || 0))
      ) {
        acc[key] = history;
      }

      return acc;
    }, {})
  ).sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

  useEffect(() => {
    let isMounted = true;

    const fetchReviewEligibility = async () => {
      if (!userId || histories.length === 0) {
        setReviewEligibility({});
        return;
      }

      const reviewedTourIds = new Set(
        histories
          .filter((history) => history.actionType === "REVIEW")
          .map((history) => history.tourResponse?.tourID)
          .filter(Boolean)
      );

      const candidateTourIds = [
        ...new Set(
          histories
            .filter((history) =>
              history.tourResponse?.tourID &&
              history.bookingResponse?.bookingStatus === "CONFIRMED" &&
              !reviewedTourIds.has(history.tourResponse.tourID)
            )
            .map((history) => history.tourResponse.tourID)
        ),
      ];

      if (candidateTourIds.length === 0) {
        setReviewEligibility({});
        return;
      }

      const entries = await Promise.all(
        candidateTourIds.map(async (tourId) => {
          try {
            return [tourId, await canReview(userId, tourId)];
          } catch {
            return [tourId, false];
          }
        })
      );

      if (isMounted) {
        setReviewEligibility(Object.fromEntries(entries));
      }
    };

    fetchReviewEligibility();

    return () => {
      isMounted = false;
    };
  }, [histories, userId]);

  const renderBookingBadge = (history) => {
    if (history.actionType === "REVIEW") {
      return <span className="badge bgc-purple">Đã đánh giá</span>;
    }

    const bookingStatus = history.bookingResponse?.bookingStatus;
    if (bookingStatus === "CANCELLED") {
      return <span className="badge" style={{ backgroundColor: "red" }}>Đã hủy</span>;
    }
    if (history.actionType === "PAY") {
      return <span className="badge bgc-green">Đã thanh toán</span>;
    }
    if (bookingStatus === "CONFIRMED") {
      return <span className="badge bgc-green">Đã xác nhận</span>;
    }
    if (bookingStatus === "PENDING") {
      return <span className="badge bgc-primary">Đã đặt tour</span>;
    }

    return null;
  };

  const handleContinuePayment = async (booking) => {
    if (!booking?.bookingID) return;

    setProcessingPaymentId(booking.bookingID);
    setError(null);
    try {
      const approvalUrl = await initiatePayment(booking.bookingID);
      window.location.href = approvalUrl;
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || "Không thể tiếp tục thanh toán. Vui lòng thử lại.");
      setProcessingPaymentId(null);
    }
  };

  const handleCancelBooking = async (booking) => {
    if (!booking?.bookingID) return;
    if (!window.confirm("Bạn có chắc chắn muốn hủy booking này?")) return;

    setProcessingCancelId(booking.bookingID);
    setError(null);
    try {
      const cancelledBooking = await cancelBooking(booking.bookingID);
      setHistories((prev) =>
        prev.map((history) =>
          history.bookingResponse?.bookingID === booking.bookingID
            ? {
                ...history,
                actionType: "CANCEL",
                bookingResponse: {
                  ...history.bookingResponse,
                  ...cancelledBooking,
                },
              }
            : history
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || "Không thể hủy booking. Vui lòng thử lại.");
    } finally {
      setProcessingCancelId(null);
    }
  };

  // Phân trang trực tiếp trong component
  const handleReviewTour = (tourId) => {
    if (!tourId) return;
    navigate(`/tour-details/${tourId}`);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return (
      <div className="pagination" style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 30 }}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          style={{ padding: "6px 12px", borderRadius: 4, border: "1px solid #ddd", background: "#fff" }}
        >
          &laquo;
        </button>
        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={currentPage === num ? "active" : ""}
            style={{
              padding: "6px 12px",
              borderRadius: 4,
              border: "1px solid #ddd",
              background: currentPage === num ? "#007bff" : "#fff",
              color: currentPage === num ? "#fff" : "#333",
              fontWeight: currentPage === num ? "bold" : "normal"
            }}
          >
            {num}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          style={{ padding: "6px 12px", borderRadius: 4, border: "1px solid #ddd", background: "#fff" }}
        >
          &raquo;
        </button>
      </div>
    );
  };

  if (loading) return <div className="text-center py-4">Đang tải dữ liệu...</div>;
  if (error) return <div className="text-center text-danger">Lỗi: {error}</div>;

  return (
    <section className="tour-list-page py-100 rel z-1">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            {filteredHistories.length === 0 ? (
              <div className="text-center">Không có lịch sử tour nào</div>
            ) : (
              filteredHistories.map((history) => {
                const tour = history.tourResponse;
                const booking = history.bookingResponse;
                const canContinuePayment = booking?.bookingStatus === "PENDING";
                const canCancelBooking = booking?.bookingStatus === "PENDING";
                const canReviewTour = Boolean(reviewEligibility[tour?.tourID]);

                return (
                  <div className="destination-item style-three bgc-lighter my-tour-card" key={history.historyID}>
                    <div className="image">
                      {renderBookingBadge(history)}
                      <img
                        src={getTourImageSrc(tour?.images)}
                        alt={tour?.title || "Tour"}
                      />
                    </div>
                    <div className="content">
                      <div className="destination-header">
                        <span className="location">
                          <FaMapMarkerAlt /> {tour?.destination || "Chưa cập nhật"}
                        </span>
                      </div>
                      <h5>
                        <a href={`/tour-details/${tour?.tourID}`}>
                          {tour?.title || "Tour chưa cập nhật"}
                        </a>
                      </h5>
                      <div className="truncate-3-lines">
                        {tour?.description || "Chưa có mô tả"}
                      </div>
                      <ul className="blog-meta">
                        <li><FaClock /> {tour?.duration || "Chưa cập nhật"}</li>
                      </ul>
                      {booking && (
                        <div className="my-tour-details">
                          <div className="my-tour-detail-item">
                            <span>Mã booking</span>
                            <strong>#{booking.bookingID || "-"}</strong>
                          </div>
                          <div className="my-tour-detail-item">
                            <span>Ngày đặt</span>
                            <strong>{formatDateTime(booking.bookingDate)}</strong>
                          </div>
                          <div className="my-tour-detail-item">
                            <span>Mã tour</span>
                            <strong>#{tour?.tourID || booking.tourId || "-"}</strong>
                          </div>
                          <div className="my-tour-detail-item">
                            <span>Khởi hành</span>
                            <strong>{formatDate(tour?.startDate)}</strong>
                          </div>
                          <div className="my-tour-detail-item">
                            <span>Kết thúc</span>
                            <strong>{formatDate(tour?.endDate)}</strong>
                          </div>
                          <div className="my-tour-detail-item">
                            <span>Hành khách</span>
                            <strong>NL {booking.numAdults || 0} / TE {booking.numChildren || 0}</strong>
                          </div>
                          <div className="my-tour-detail-item">
                            <span>Thanh toán</span>
                            <strong>{booking.paymentMethod || "-"}</strong>
                          </div>
                          <div className="my-tour-detail-item my-tour-detail-wide">
                            <span>Liên hệ</span>
                            <strong>{booking.fullName || "-"}</strong>
                            <small>{[booking.email, booking.phoneNumber].filter(Boolean).join(" - ") || "-"}</small>
                          </div>
                        </div>
                      )}
                      <div className="destination-footer">
                        <span className="price">
                          <span>{formatCurrency(booking?.totalPrice || tour?.priceAdult || 0)}</span>
                        </span>
                        {(canContinuePayment || canCancelBooking || canReviewTour) && (
                          <div className="my-tour-actions">
                            {canContinuePayment && (
                              <button
                                type="button"
                                className="theme-btn style-two style-three my-tour-payment-btn"
                                onClick={() => handleContinuePayment(booking)}
                                disabled={processingPaymentId === booking.bookingID || processingCancelId === booking.bookingID}
                              >
                                <span data-hover="Thanh toán tiếp">
                                  {processingPaymentId === booking.bookingID ? "Đang xử lý..." : "Thanh toán tiếp"}
                                </span>
                                <FaArrowRight />
                              </button>
                            )}
                            {canCancelBooking && (
                              <button
                                type="button"
                                className="my-tour-cancel-btn"
                                onClick={() => handleCancelBooking(booking)}
                                disabled={processingPaymentId === booking.bookingID || processingCancelId === booking.bookingID}
                              >
                                {processingCancelId === booking.bookingID ? "Đang hủy..." : "Hủy booking"}
                              </button>
                            )}
                            {canReviewTour && (
                              <button
                                type="button"
                                className="my-tour-review-btn"
                                onClick={() => handleReviewTour(tour?.tourID)}
                              >
                                <FaStar />
                                Review
                              </button>
                            )}
                          </div>
                        )}
                        {history.actionType === "REVIEW" && (
                          <a
                            href={`/tour-details/${tour?.tourID}`}
                            className="theme-btn style-two style-three"
                          >
                            {tour?.rating
                              ? <span data-hover="Đã đánh giá">Đã đánh giá</span>
                              : <span data-hover="Đánh giá">Đánh giá</span>}
                            <FaArrowRight />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            {/* Phân trang */}
            {renderPagination()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyTour;
