import React from "react";
import { Container } from "react-bootstrap";
import Sidebar from "../components/Admin/common/Sidebar";
import Header from "../components/Admin/common/Header";
import BookingTable from "../components/Admin/AdminBooking/BookingTable";

function AdminBooking() {
  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#f4f6f9" }}>
    <Sidebar />
     <div className="flex-grow-1">
     <Header />
      <Container fluid>
        <BookingTable />
      </Container>
     </div>
    </div>
  );
}

export default AdminBooking;
