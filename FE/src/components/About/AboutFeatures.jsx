import React from "react";
import { FaGlobeAsia, FaUsers, FaMoneyBillWave, FaHeadset } from "react-icons/fa";

const AboutFeatures = () => (
  <section className="features-area pt-70 pb-40 rel z-1">
    <div className="container">
      <div className="row">
        <div className="col-lg-3 col-sm-6">
          <div className="feature-item style-two text-center">
            <div className="icon mb-2">
              <FaGlobeAsia size={40} color="#20bfa9" />
            </div>
            <h5>Tour đa dạng</h5>
            <p>Khám phá nhiều điểm đến hấp dẫn trên khắp Việt Nam.</p>
          </div>
        </div>
        <div className="col-lg-3 col-sm-6">
          <div className="feature-item style-two text-center">
            <div className="icon mb-2">
              <FaUsers size={40} color="#20bfa9" />
            </div>
            <h5>Đội ngũ chuyên nghiệp</h5>
            <p>Hướng dẫn viên tận tâm, giàu kinh nghiệm.</p>
          </div>
        </div>
        <div className="col-lg-3 col-sm-6">
          <div className="feature-item style-two text-center">
            <div className="icon mb-2">
              <FaMoneyBillWave size={40} color="#20bfa9" />
            </div>
            <h5>Giá cả hợp lý</h5>
            <p>Chính sách giá linh hoạt, phù hợp mọi nhu cầu.</p>
          </div>
        </div>
        <div className="col-lg-3 col-sm-6">
          <div className="feature-item style-two text-center">
            <div className="icon mb-2">
              <FaHeadset size={40} color="#20bfa9" />
            </div>
            <h5>Hỗ trợ 24/7</h5>
            <p>Luôn sẵn sàng giải đáp mọi thắc mắc của khách hàng.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default AboutFeatures;
