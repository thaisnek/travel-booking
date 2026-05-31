import React from "react";
import { Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import RegisterForm from "../components/Auth/RegisterForm";
import Navbar2 from "../components/common/Navbar2";

function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = async (form, setError, setSuccess) => {
    const res = await registerUser(form);
    if (res.ok) {
      setSuccess(res.message || "Đăng ký thành công! Đang chuyển sang trang đăng nhập...");
      setError("");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setError(res.message || "Lỗi đăng ký!");
      setSuccess("");
    }
  };

  return (
    <div className="page-wrapper auth-page">
      <Navbar2 />
      <main className="auth-section">
        <Container className="auth-container">
          <div className="auth-card">
            <div className="auth-visual">
              <img src="/assets/images/login/signup-image.jpg" alt="Đăng ký tài khoản du lịch" />
            </div>
            <div className="auth-content">
              <div className="auth-heading">
                <span className="auth-eyebrow">Travel Booking</span>
                <h3>Đăng ký</h3>
                <p>Tạo tài khoản để lưu thông tin và quản lý các chuyến đi dễ hơn.</p>
              </div>
              <RegisterForm onRegister={handleRegister} />
              <p className="auth-switch">
                Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
              </p>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}

export default RegisterPage;
