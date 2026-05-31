import React, { useEffect, useState } from "react";
import { Row, Col, Card, Table, Spinner } from "react-bootstrap";
import { FaUsers, FaCalendarAlt, FaUser, FaMoneyBillWave } from "react-icons/fa";
import { getDashboardStats, getTopTours, getTopCustomers } from "../../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [topTours, setTopTours] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [statsData, toursData, customersData] = await Promise.all([
          getDashboardStats(),
          getTopTours(),
          getTopCustomers()
        ]);
        setStats({
          totalTours: statsData.totalActiveTours,
          totalBookings: statsData.totalBookings,
          totalUsers: statsData.totalUsers,
          totalRevenue: statsData.totalRevenue,
        });
        setTopTours(toursData);
        setTopCustomers(customersData);
      } catch (err) {
        alert("Lỗi khi tải dữ liệu dashboard!");
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="py-4">
      {loading || !stats ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          {/* Thống kê */}
          <Row className="mb-4 g-4">
            <Col md={3}>
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <FaCalendarAlt size={24} className="text-primary mb-1" />
                  <div className="fw-bold text-success" style={{ fontSize: 24 }}>
                    {stats.totalTours}
                  </div>
                  <div className="text-muted" style={{ fontSize: 14 }}>Tổng số tours đang hoạt động</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <FaUsers size={24} className="text-primary mb-1" />
                  <div className="fw-bold text-success" style={{ fontSize: 24 }}>
                    {stats.totalBookings}
                  </div>
                  <div className="text-muted" style={{ fontSize: 14 }}>Tổng số lượt booking</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <FaUser size={24} className="text-primary mb-1" />
                  <div className="fw-bold text-success" style={{ fontSize: 24 }}>
                    {stats.totalUsers}
                  </div>
                  <div className="text-muted" style={{ fontSize: 14 }}>Số người dùng đăng ký</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <FaMoneyBillWave size={24} className="text-danger mb-1" />
                  <div className="fw-bold" style={{ color: "red", fontSize: 24 }}>
                    {stats.totalRevenue.toLocaleString()} vnđ
                  </div>
                  <div className="text-muted" style={{ fontSize: 14 }}>Tổng doanh thu</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          {/* Bảng top tour và top khách hàng */}
          <Row className="g-4">
            <Col md={6}>
              <Card className="shadow-sm">
                <Card.Header className="fw-bold">
                  5 tour được đặt nhiều nhất 
                </Card.Header>
                <Card.Body className="p-0">
                  <Table hover responsive className="mb-0">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Số chỗ đã đặt</th>
                        <th>Số chỗ còn trống</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topTours.map(tour => (
                        <tr key={tour.id}>
                          <td>{tour.id}</td>
                          <td>{tour.name}</td>
                          <td>{tour.booked}</td>
                          <td>{tour.available}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="shadow-sm">
                <Card.Header className="fw-bold">
                  5 khách hàng mua cao nhất 
                </Card.Header>
                <Card.Body className="p-0">
                  <Table hover responsive className="mb-0">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Họ và tên</th>
                        <th>Số lần mua</th>
                        <th>Tổng tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topCustomers.map(c => (
                        <tr key={c.id}>
                          <td>{c.id}</td>
                          <td>{c.fullName}</td>
                          <td>{c.totalPurchases}</td>
                          <td>{c.totalAmount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
