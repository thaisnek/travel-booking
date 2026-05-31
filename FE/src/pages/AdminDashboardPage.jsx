import React from "react";
import { Container } from "react-bootstrap";
import Sidebar from "../components/Admin/common/Sidebar";
import Header from "../components/Admin/common/Header";
import Dashboard from "../components/Admin/AdminDashboard/Dashboard";

function AdminDashboardPage() {
  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#f4f6f9" }}>
    <Sidebar />
     <div className="flex-grow-1">
     <Header />
      <Container fluid>
        <Dashboard />
      </Container>
     </div>
    </div>
  );
}

export default AdminDashboardPage;
