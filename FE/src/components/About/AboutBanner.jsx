import React from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const AboutBanner = () => (
  <section
    className="page-banner-area pt-50 pb-35 rel z-1 bgs-cover"
    style={{ backgroundImage: "url(/assets/images/banner/banner.jpg)" }}
  >
    <div className="container">
      <div className="banner-inner text-white">
        <h2 className="page-title mb-10">Giới thiệu</h2>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb justify-content-center mb-20">
            <li className="breadcrumb-item">
              <Link to="/">
                <FaHome style={{ marginRight: 5 }} />
                Trang chủ
              </Link>
            </li>
            <li className="breadcrumb-item active">Giới thiệu</li>
          </ol>
        </nav>
      </div>
    </div>
  </section>
);

export default AboutBanner;
