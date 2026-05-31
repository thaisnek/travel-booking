import React from "react";
import { Nav } from "react-bootstrap";
import { BsSpeedometer2, BsPeople, BsPerson, BsCardChecklist, BsBook, BsStar, BsTag, BsEnvelope } from "react-icons/bs";

export default function Sidebar() {
  return (
    <div className="bg-dark text-white vh-100 d-flex flex-column p-3" style={{ width: 250 }}>
      <div className="mb-4">
        <img
          src="https://kynguyenlamdep.com/wp-content/uploads/2022/08/anh-cute-meo-con-nguy-hiem.jpg"
          alt="avatar"
          style={{
            width: 60,         
            height: 60,
            objectFit: "cover", 
            borderRadius: "50%"
          }}
        />
        <div>Xin chào, <b>Admin</b></div>
      </div>
      <Nav className="flex-column">
        <Nav.Link href="/admin/dashboard" className="text-white"><BsSpeedometer2 className="me-2" />Dashboard</Nav.Link>
        <Nav.Link href="/admin/admin-profile" className="text-white"><BsPerson className="me-2" />Quản lý Admin</Nav.Link>
        <Nav.Link href="/admin/user" className="text-white"><BsPeople className="me-2" />Quản lý người dùng</Nav.Link>
        <Nav.Link href="/admin/tour" className="text-white"><BsCardChecklist className="me-2" />Quản lý Tours</Nav.Link>
        <Nav.Link href="/admin/booking" className="text-white"><BsBook className="me-2" />Quản lý Booking</Nav.Link>
        <Nav.Link href="/admin/review" className="text-white"><BsStar className="me-2" />Quản lý Review</Nav.Link>
        <Nav.Link href="/admin/promotion" className="text-white"><BsTag className="me-2" />Quản lý Promotion</Nav.Link>
        <Nav.Link href="/admin/contact" className="text-white"><BsEnvelope className="me-2" />Liên hệ</Nav.Link>
      </Nav>
      <div className="mt-auto pt-4 border-top border-secondary">
        <small className="text-secondary">Admin Panel</small>
      </div>
    </div>
  );
}
