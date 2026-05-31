import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

const TourIncludeExclude = () => {
  return (
    <div className="row pb-55">
      <div className="col-md-6">
        <div className="tour-include-exclude mt-30">
          <h5>Bao gồm</h5>
          <ul className="list-style-one check mt-25">
            <li>
              <FaCheck className="me-2" style={{ color: 'green' }}/> Dịch vụ đón và trả khách
            </li>
            <li>
              <FaCheck className="me-2" style={{ color: 'green' }}/> 1 bữa ăn mỗi ngày
            </li>
            <li>
              <FaCheck className="me-2" style={{ color: 'green' }}/> Bữa tối trên du thuyền & Sự kiện âm nhạc
            </li>
            <li>
              <FaCheck className="me-2" style={{ color: 'green' }}/> Tham quan 7 địa điểm tuyệt vời nhất trong thành phố
            </li>
            <li>
              <FaCheck className="me-2" style={{ color: 'green' }}/> Nước đóng chai trên xe buýt
            </li>
            <li>
              <FaCheck className="me-2" style={{ color: 'green' }}/> Phương tiện di chuyển Xe buýt du lịch hạng sang
            </li>
          </ul>
        </div>
      </div>
      <div className="col-md-6">
        <div className="tour-include-exclude mt-30">
          <h5>Không bao gồm</h5>
          <ul className="list-style-one mt-25">
            <li>
              <FaTimes className="me-2" style={{ color: 'red' }}/> Tiền boa
            </li>
            <li>
              <FaTimes className="me-2" style={{ color: 'red' }}/> Đón và trả khách tại khách sạn
            </li>
            <li>
              <FaTimes className="me-2" style={{ color: 'red' }}/> Bữa trưa, Đồ ăn & Đồ uống
            </li>
            <li>
              <FaTimes className="me-2" style={{ color: 'red' }}/> Nâng cấp tùy chọn lên một ly
            </li>
            <li>
              <FaTimes className="me-2" style={{ color: 'red' }}/> Dịch vụ bổ sung
            </li>
            <li>
              <FaTimes className="me-2" style={{ color: 'red' }}/> Bảo hiểm
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TourIncludeExclude;