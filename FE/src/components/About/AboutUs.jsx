import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const AboutUs = () => (
  <section className="about-us-area py-100 rel z-1">
    <div className="container">
      <div className="row align-items-center">
        <div className="col-lg-6">
          <img src="/assets/images/about/about-page.jpg" alt="About Us" className="img-fluid rounded" />
        </div>
        <div className="col-lg-6">
          <div className="about-content pl-60">
            <h2>Chúng tôi là ai?</h2>
            <p>
              Chúng tôi là công ty du lịch hàng đầu, mang đến trải nghiệm tuyệt vời và dịch vụ chuyên nghiệp cho khách hàng trong và ngoài nước.
            </p>
            <ul className="list-style-two mt-35">
              <li><FaCheckCircle color="#20bfa9" /> Hơn 5 năm kinh nghiệm</li>
              <li><FaCheckCircle color="#20bfa9" /> Đội ngũ hướng dẫn viên chuyên nghiệp</li>
              <li><FaCheckCircle color="#20bfa9" /> Giá cả cạnh tranh</li>
              <li><FaCheckCircle color="#20bfa9" /> Hỗ trợ 24/7</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default AboutUs;
