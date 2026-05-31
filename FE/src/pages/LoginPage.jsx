import React from "react";
import { Container } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "../services/api";
import LoginForm from "../components/Auth/LoginForm";
import Navbar2 from "../components/common/Navbar2";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (form, setError) => {
    const res = await login(form);
    if (res.token) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("userId", res.userId);
      localStorage.setItem("role", res.role);
      if (res.role === "ADMIN") {
      navigate("/admin/dashboard");
    } else {
      navigate(location.state?.from || "/");
    }
    } else {
      setError("Sai tài khoản hoặc mật khẩu!");
    }
  };

  return (
    <div className="page-wrapper auth-page">
      <Navbar2 />
      <main className="auth-section">
        <Container className="auth-container">
          <div className="auth-card">
            <div className="auth-visual">
              <img src="/assets/images/login/signin-image.jpg" alt="Đăng nhập tài khoản du lịch" />
            </div>
            <div className="auth-content">
              <div className="auth-heading">
                <span className="auth-eyebrow">Travel Booking</span>
                <h3>Đăng nhập</h3>
                <p>Chào mừng bạn quay lại, đăng nhập để tiếp tục đặt tour.</p>
              </div>
              <LoginForm onLogin={handleLogin} />
              <p className="auth-switch">
                Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
              </p>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}

export default LoginPage;
