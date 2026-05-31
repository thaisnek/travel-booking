import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

export default function Header() {
  const [showLogout, setShowLogout] = useState(false);
  const avatarRef = useRef(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setShowLogout(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    setShowLogout(false);
    navigate("/");
  };

  return (
    <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-light">
      <h4 className="mb-0">
      </h4>
      <div
        className="d-flex align-items-center"
        ref={avatarRef}
        style={{ position: "relative" }}
      >
        <img
          src="https://kynguyenlamdep.com/wp-content/uploads/2022/08/anh-cute-meo-con-nguy-hiem.jpg"
          alt="avatar"
          style={{
            width: 45,
            height: 45,
            objectFit: "cover",
            borderRadius: "50%",
            cursor: "pointer",
            border: "2px solid #007bff"
          }}
          onClick={() => setShowLogout((prev) => !prev)}
        />
        <span
          className="ms-2 fw-bold"
          style={{ cursor: "pointer", color: "#007bff" }}
          onClick={() => setShowLogout((prev) => !prev)}
        >
        </span>
        {showLogout && (
          <div
            style={{
              position: "absolute",
              top: "110%",
              right: 0,
              zIndex: 1000,
              minWidth: 120
            }}
          >
            <button
              className="btn btn-outline-danger w-100"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
