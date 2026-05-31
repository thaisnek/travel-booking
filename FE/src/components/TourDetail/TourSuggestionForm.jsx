import React from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';

const TourSuggestionForm = ({ tour }) => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Điều hướng đến trang booking
    if (!isAuthenticated()) {
      alert("Bạn cần đăng nhập để đặt tour!");
      navigate("/login", { state: { from: `/booking/${tour.tourID}` } });
      return;
    }

    navigate(`/booking/${tour.tourID}`);
  };

  return (
    <div className="widget widget-booking">
      <h5 className="widget-title">Tour Booking</h5>
      <form onSubmit={handleSubmit}>
        <div className="date mb-25">
          <b>Ngày bắt đầu</b>
          <input
            type="text"
            value={tour.startDate ? new Date(tour.startDate).toLocaleDateString("vi-VN") : "N/A"}
            name="startdate"
            disabled
            className="form-control"
          />
        </div>
        <hr />
        <div className="date mb-25">
          <b>Ngày kết thúc</b>
          <input
            type="text"
            value={tour.endDate ? new Date(tour.endDate).toLocaleDateString("vi-VN") : "N/A"}
            name="enddate"
            disabled
            className="form-control"
          />
        </div>
        <hr />
        <div className="time py-5">
          <b>Thời gian:</b>
          <p>{tour.duration || "N/A"}</p>
          <input type="hidden" name="time" />
        </div>
        <hr className="mb-25" />
        <h6>Vé:</h6>
        <ul className="tickets clearfix">
          <li>
            Người lớn <span className="price">{tour.priceAdult ? tour.priceAdult.toLocaleString("vi-VN") : "N/A"} VND</span>
          </li>
          <li>
            Trẻ em <span className="price">{tour.priceChild ? tour.priceChild.toLocaleString("vi-VN") : "N/A"} VND</span>
          </li>
        </ul>
        <button
          type="submit"
          className="theme-btn style-two w-100 mt-15 mb-5"
        >
          Đặt ngay <i className="fal fa-arrow-right"></i>
        </button>
        <div className="text-center">
          <a href="/contact">Bạn cần trợ giúp không?</a>
        </div>
      </form>
    </div>
  );
};

export default TourSuggestionForm;
