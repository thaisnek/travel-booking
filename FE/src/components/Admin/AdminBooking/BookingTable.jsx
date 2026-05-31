import React, { useCallback, useEffect, useState } from "react";
import { Table, Button, Form, Spinner } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { getAllBookings, updateBookingStatus, deleteBooking } from "../../../services/api";

const statusOptions = ["PENDING", "CONFIRMED", "CANCELLED"];
const PAGE_SIZE = 6;

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (value) =>
  (value || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

export default function BookingTable() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllBookings(page, PAGE_SIZE);
      const nextTotalPages = Math.max(data.totalPages || 0, 1);
      if (page >= nextTotalPages) {
        setPage(nextTotalPages - 1);
        return;
      }
      setBookings(data.content || []);
      setTotalPages(nextTotalPages);
    } catch (err) {
      alert("Lỗi khi tải danh sách booking!");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateBookingStatus(id, newStatus);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Cập nhật trạng thái thất bại!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa booking này?")) {
      try {
        await deleteBooking(id);
        fetchBookings();
      } catch (err) {
        alert("Xóa booking thất bại!");
      }
    }
  };

  return (
    <div className="admin-booking-card p-3 bg-white rounded shadow-sm mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Bookings</h5>
        <span className="text-muted small">{bookings.length} booking / trang</span>
      </div>
      {loading ? (
        <div className="text-center my-5"><Spinner animation="border" /></div>
      ) : (
        <div className="admin-booking-table-wrap">
          <Table striped bordered hover size="sm" className="admin-booking-table mb-0">
            <thead>
              <tr>
                <th className="booking-col-booking">Booking</th>
                <th>Khách hàng</th>
                <th className="booking-col-tour-info">Tour / vé</th>
                <th className="booking-col-money">Thanh toán</th>
                <th className="booking-col-status">Trạng thái</th>
                <th className="booking-col-action"></th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center">Không có dữ liệu</td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.bookingID}>
                    <td>
                      <strong>#{booking.bookingID}</strong>
                      <div className="booking-subtext">{formatDateTime(booking.bookingDate)}</div>
                      <div className="booking-subtext">User #{booking.userId}</div>
                    </td>
                    <td>
                      <div className="booking-primary">{booking.fullName || "-"}</div>
                      <div className="booking-subtext">{booking.email || "-"}</div>
                      <div className="booking-subtext">
                        {[booking.phoneNumber, booking.address].filter(Boolean).join(" - ") || "-"}
                      </div>
                    </td>
                    <td>
                      <div className="booking-primary">Tour #{booking.tourId}</div>
                      <div className="booking-subtext">NL {booking.numAdults} / TE {booking.numChildren}</div>
                    </td>
                    <td>
                      <div className="booking-price">{formatCurrency(booking.totalPrice)}</div>
                      <div className="booking-subtext text-capitalize">{booking.paymentMethod || "-"}</div>
                    </td>
                    <td>
                      <Form.Select
                        size="sm"
                        className="booking-status-select"
                        value={booking.bookingStatus}
                        onChange={e => handleStatusChange(booking.bookingID, e.target.value)}
                      >
                        {statusOptions.map(status => (
                          <option
                            key={status}
                            value={status}
                            disabled={status === "CONFIRMED" && booking.bookingStatus !== "CONFIRMED"}
                          >
                            {status}
                          </option>
                        ))}
                      </Form.Select>
                    </td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="booking-delete-btn"
                        onClick={() => handleDelete(booking.bookingID)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      )}
      <div className="d-flex justify-content-between align-items-center">
        <span>Trang {page + 1} / {totalPages}</span>
        <div>
          <Button size="sm" variant="outline-secondary" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button>
          <Button size="sm" variant="outline-secondary" className="ms-2" disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      </div>
    </div>
  );
}
