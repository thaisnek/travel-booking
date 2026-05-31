import React from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import Navbar2 from "../components/common/Navbar2";

const ErrorPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const message = searchParams.get("message") || location.state || "Đã xảy ra lỗi. Vui lòng thử lại.";

  return (
    <div className="page-wrapper">
      <Navbar2 />
      <main className="container" style={{ padding: "80px 0", minHeight: "60vh" }}>
        <div className="text-center">
          <h2>Không thể xử lý yêu cầu</h2>
          <p style={{ marginTop: 12 }}>{message}</p>
          <Link to="/history" className="theme-btn style-two" style={{ marginTop: 24 }}>
            Quay lại tour đã đặt
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ErrorPage;
