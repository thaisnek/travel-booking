import React from "react";
import { FaSmileBeam, FaMapMarkedAlt, FaPlane } from "react-icons/fa";

const AboutFeatureTwo = () => (
  <section className="features-area-two py-70 rel z-1">
    <div className="container">
      <div className="row">
        <div className="col-lg-4 col-sm-6">
          <div className="feature-item-two text-center">
            <div className="icon mb-2">
              <FaSmileBeam size={38} color="#20bfa9" />
            </div>
            <h5>Khách hàng hài lòng</h5>
            <p>Đặt sự hài lòng của khách hàng lên hàng đầu.</p>
          </div>
        </div>
        <div className="col-lg-4 col-sm-6">
          <div className="feature-item-two text-center">
            <div className="icon mb-2">
              <FaMapMarkedAlt size={38} color="#20bfa9" />
            </div>
            <h5>Điểm đến đa dạng</h5>
            <p>Khám phá nhiều địa điểm du lịch nổi tiếng.</p>
          </div>
        </div>
        <div className="col-lg-4 col-sm-6">
          <div className="feature-item-two text-center">
            <div className="icon mb-2">
              <FaPlane size={38} color="#20bfa9" />
            </div>
            <h5>Di chuyển thuận tiện</h5>
            <p>Hợp tác với các hãng vận chuyển uy tín.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default AboutFeatureTwo;
