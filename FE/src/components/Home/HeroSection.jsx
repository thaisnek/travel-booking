import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt, FaCalendarAlt, FaSearch } from 'react-icons/fa';

const HeroSection = () => {
  const [searchData, setSearchData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!searchData.destination && !searchData.startDate && !searchData.endDate) {
      alert('Vui lòng nhập ít nhất một tiêu chí tìm kiếm (điểm đến, ngày khởi hành, hoặc ngày kết thúc).');
      return;
    }

    if (searchData.startDate && !/^\d{4}-\d{2}-\d{2}$/.test(searchData.startDate)) {
      alert('Ngày khởi hành không đúng định dạng (YYYY-MM-DD). Vui lòng kiểm tra lại.');
      return;
    }
    if (searchData.endDate && !/^\d{4}-\d{2}-\d{2}$/.test(searchData.endDate)) {
      alert('Ngày kết thúc không đúng định dạng (YYYY-MM-DD). Vui lòng kiểm tra lại.');
      return;
    }
    if (searchData.startDate && searchData.endDate && searchData.endDate < searchData.startDate) {
      alert('Ngày kết thúc phải sau ngày khởi hành.');
      return;
    }

    try {
      console.log('Tham số gửi đi:', searchData);
      const response = await axios.get('http://localhost:8080/ltweb/api/tours/search', {
        params: {
          destination: searchData.destination || null,
          startDate: searchData.startDate || null,
          endDate: searchData.endDate || null,
        },
      });

      const { success, message, data } = response.data;
      if (success) {
        console.log('Kết quả tìm kiếm:', data);
        navigate('/search', { state: { tours: data || [] } });
      } else {
        console.warn('Tìm kiếm thất bại:', message);
        alert(`Tìm kiếm thất bại: ${message}`);
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu tìm kiếm:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      let errorMessage = 'Đã xảy ra lỗi khi tìm kiếm tour. Vui lòng thử lại sau.';
      if (error.response) {
        errorMessage = `Lỗi từ server: ${error.response.data?.message || error.response.statusText}`;
      } else if (error.request) {
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc đảm bảo backend đang chạy.';
      }
      alert(errorMessage);
    }
  };

  return (
    <section className="hero-area bgc-black pt-200 rpt-120 rel z-2">
      <div className="container-fluid">
        <h1 className="hero-title">Tours Du Lịch</h1>
        <div
          className="main-hero-image bgs-cover"
          style={{ backgroundImage: 'url(/assets/images/hero/hero.jpg)' }}
        ></div>
      </div>
      <form onSubmit={handleSubmit} id="search_form">
        <div className="container container-1400">
          <div className="search-filter-inner">
            <div className="filter-item clearfix">
              <div className="icon">
                <FaMapMarkerAlt />
              </div>
              <span className="title">Điểm đến</span>
              <select
                name="destination"
                id="destination"
                value={searchData.destination}
                onChange={handleChange}
              >
                <option value="">Chọn điểm đến</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
                <option value="Côn Đảo">Côn Đảo</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                <option value="Hạ Long">Hạ Long</option>
                <option value="Ninh Bình">Ninh Bình</option>
                <option value="Phú Quốc">Phú Quốc</option>
                <option value="Đà Lạt">Đà Lạt</option>
                <option value="Quảng Trị">Quảng Trị</option>
                <option value="Nha Trang">Nha Trang</option>
                <option value="Cần Thơ">Cần Thơ</option>
                <option value="Vũng Tàu">Vũng Tàu</option>
                <option value="Quảng Ninh">Quảng Ninh</option>
                <option value="Sa Pa">Sa Pa</option>
                <option value="Bình Định">Bình Định</option>
              </select>
            </div>
            <div className="filter-item clearfix">
              <div className="icon">
                <FaCalendarAlt />
              </div>
              <span className="title">Ngày khởi hành</span>
              <input
                type="date"
                id="start_date"
                name="startDate"
                value={searchData.startDate}
                onChange={handleChange}
                className="datetimepicker datetimepicker-custom"
                placeholder="Chọn ngày đi"
              />
            </div>
            <div className="filter-item clearfix">
              <div className="icon">
                <FaCalendarAlt />
              </div>
              <span className="title">Ngày kết thúc</span>
              <input
                type="date"
                id="end_date"
                name="endDate"
                value={searchData.endDate}
                onChange={handleChange}
                className="datetimepicker datetimepicker-custom"
                placeholder="Chọn ngày về"
              />
            </div>
            <div className="search-button">
              <button className="theme-btn" type="submit">
                <span data-hover="Tìm kiếm">Tìm kiếm</span>
                <FaSearch />
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default HeroSection;