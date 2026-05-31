import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const AboutIntro = () => (
  <section className="about-area-two py-100 rel z-1">
    <div className="container">
      <div className="row justify-content-between">
        <div className="col-xl-3">
          <span className="subtitle mb-35">Về chúng tôi</span>
        </div>
        <div className="col-xl-9">
          <div className="about-page-content">
            <div className="row">
              <div className="col-lg-8 pe-lg-5 me-lg-5">
                <div className="section-title mb-25">
                  <h2>Kinh nghiệm và công ty du lịch chuyên nghiệp ở Việt Nam</h2>
                </div>
              </div>
              <div className="col-md-4">
                <div className="experience-years rmb-20">
                  <span className="title bgc-secondary">Năm kinh nghiệm</span>
                  <span className="text">Chúng tôi có </span>
                  <span className="years">5+</span>
                </div>
              </div>
              <div className="col-md-8">
                <p>
                  Chúng tôi chuyên tạo ra những trải nghiệm thành phố khó quên cho du khách muốn
                  khám phá trái tim và tâm hồn của cảnh quan đô thị. Các tour du lịch có hướng dẫn
                  viên chuyên nghiệp của chúng tôi sẽ đưa du khách qua những con phố sôi động, các
                  địa danh lịch sử và những viên ngọc ẩn giấu của mỗi thành phố.
                </p>
                <ul className="list-style-two mt-35">
                  <li>Cơ quan Trải nghiệm</li>
                  <li>Đội ngũ Chuyên nghiệp</li>
                  <li>Du lịch Chi phí Thấp</li>
                  <li>Hỗ trợ Trực tuyến 24/7</li>
                </ul>
                <Link to="/all-tours" className="theme-btn style-three mt-30">
                  <span data-hover="Khám phá Tours">Khám phá Tours</span>
                  <FaArrowRight style={{ marginLeft: 8 }} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default AboutIntro;
