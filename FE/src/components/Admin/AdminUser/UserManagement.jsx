import React, { useEffect, useState } from "react";
import { Container, Button, Row, Col, Card, Spinner, Pagination } from "react-bootstrap";
import { deleteUser } from '../../../services/api'; // <-- import here

const BACKEND_URL = "http://localhost:8080";
const token = localStorage.getItem("token");

const fetchUsers = async (page, size) => {
  const response = await fetch(`${BACKEND_URL}/ltweb/api/admin/users/all-users?page=${page}&size=${size}`,{
    headers: {
        Authorization: `Bearer ${token}`,
      }
  });
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
};

const UserManagement = () => {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const data = await fetchUsers(page, pageSize);
        setUserList(data.content);
        setTotalPages(data.totalPages);
      } catch (err) {
        alert('Error loading users');
      }
      setLoading(false);
    };
    loadUsers();
  }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm("bạn chắc chắn muốn xóa người dùng này chứ?")) return;
    setLoading(true);
    try {
      await deleteUser(id);
      const data = await fetchUsers(page, pageSize);
      setUserList(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      alert(err.message || "Xóa thất bại!");
    }
    setLoading(false);
  };

  const paginationItems = [];
  for (let i = 0; i < totalPages; i++) {
    paginationItems.push(
      <Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>
        {i + 1}
      </Pagination.Item>
    );
  }

  return (
    <Container fluid>
      <h4 className="mt-4 mb-4">Quản lý người dùng</h4>
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <Row>
            {userList.map(user => (
              <Col key={user.userId} md={6} className="mb-3">
                <Card>
                  <Card.Body className="d-flex align-items-center">
                    <div>
                      <Card.Title>{user.fullName}</Card.Title>
                      <div>Username: {user.username}</div>
                      <div>Email: {user.email}</div>
                      <div>Address: {user.address}</div>
                      <div>Phone: {user.phone}</div>
                      <div className="mt-2">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(user.userId)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    <img
                      src={BACKEND_URL + user.avatarUrl}
                      alt="avatar"
                      style={{
                        width: 150,
                        height: 150,
                        borderRadius: "50%",
                        objectFit: "cover"
                      }}
                      className="ms-auto"
                    />
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              <Pagination.Prev
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              />
              {paginationItems}
              <Pagination.Next
                disabled={page + 1 === totalPages}
                onClick={() => setPage(page + 1)}
              />
            </Pagination>
          </div>
        </>
      )}
    </Container>
  );
};

export default UserManagement;
