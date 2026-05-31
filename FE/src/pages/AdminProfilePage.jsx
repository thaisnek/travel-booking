import React from "react";
import { Container } from "react-bootstrap";
import Sidebar from "../components/Admin/common/Sidebar";
import Header from "../components/Admin/common/Header";
import AdminProfile from "../components/Admin/AdminProfile/AdminProfile";

function AdminProfilePage() {
  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#f4f6f9" }}>
      <Sidebar />
      <div className="flex-grow-1">
        <Header />
          <Container fluid>
            <AdminProfile />
          </Container>
      </div>
    </div>
  );
}

export default AdminProfilePage;
