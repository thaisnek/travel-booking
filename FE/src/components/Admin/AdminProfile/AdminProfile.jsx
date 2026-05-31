import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import { getAdminById } from "../../../services/api";

const adminId = 1;

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminId) {
      setLoading(false);
      return;
    }
    getAdminById(adminId)
      .then(data => {
        setAdmin(data);
        setLoading(false);
      })
      .catch(err => {
        alert("Không lấy được thông tin admin!");
        setLoading(false);
      });
    // eslint-disable-next-line
  }, []);

  if (loading) return <div className="text-center py-4">Đang tải dữ liệu...</div>;
  if (!admin) return <div className="text-center text-danger">Không có dữ liệu admin!</div>;

  return (
    <Container fluid className="py-4">
      <h3 className="mb-4 text-center">Thông tin Admin</h3>
      <Card className="shadow p-4 mx-auto" style={{ maxWidth: 1000 }}>
        <Row className="align-items-center">
          <Col md={4} className="text-center mb-3 mb-md-0">
            <img
              src={"https://kynguyenlamdep.com/wp-content/uploads/2022/08/anh-cute-meo-con-nguy-hiem.jpg"}
              alt="Admin Avatar"
              style={{
                width: 180,
                height: 180,
                borderRadius: "12px",
                objectFit: "cover",
                border: "3px solid #20bfa9",
                boxShadow: "0 4px 16px rgba(32,191,169,0.08)"
              }}
            />
          </Col>
          <Col md={8}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <b>Họ và tên:</b> {admin.fullName || <span className="text-muted">Chưa cập nhật</span>}
              </ListGroup.Item>
              <ListGroup.Item>
                <b>Email:</b> {admin.email || <span className="text-muted">Chưa cập nhật</span>}
              </ListGroup.Item>
              <ListGroup.Item>
                <b>Địa chỉ:</b> {admin.address || <span className="text-muted">Chưa cập nhật</span>}
              </ListGroup.Item>
              <ListGroup.Item>
                <b>Số điện thoại:</b> {admin.phone || <span className="text-muted">Chưa cập nhật</span>}
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default AdminProfile;
