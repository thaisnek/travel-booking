import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Alert, Row, Col, Card } from "react-bootstrap";

const API_URL = "http://localhost:8080/ltweb/api";

const readResponseMessage = async (response) => {
  const text = await response.text();
  if (!text) return "";

  try {
    const data = JSON.parse(text);
    return data.message || data.error || text;
  } catch {
    return text;
  }
};

function AdminContactReply() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(false);
  const [replying, setReplying] = useState(false);

  const fetchContacts = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/contacts/all-contacts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const message = await readResponseMessage(res);
        throw new Error(message || "Không thể tải danh sách liên hệ");
      }
      const data = await res.json();
      setContacts(data.content || []);
    } catch (err) {
      setNotification(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleViewDetail = (contact) => {
    setSelectedContact(contact);
  };

  const handleReplyClick = () => {
    setReplyMessage("");
    setShowReplyModal(true);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const body = {
      chatID: selectedContact.chatID,
      replyMessage,
    };
    setReplying(true);
    try {
      const res = await fetch(`${API_URL}/admin/contacts/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const message = await readResponseMessage(res);
      if (!res.ok) {
        throw new Error(message || "Phản hồi thất bại!");
      }
      setNotification(message || "Phản hồi thành công!");
      setShowReplyModal(false);
      setSelectedContact(null);
      setReplyMessage("");
      fetchContacts();
    } catch (err) {
      setNotification(err.message);
    } finally {
      setReplying(false);
      setTimeout(() => setNotification(""), 3000);
    }
  };

  return (
    <div className="py-4">
      <h3 className="mb-4">Quản lý phản hồi liên hệ</h3>
      {notification && <Alert variant="info">{notification}</Alert>}
      <Row>
        <Col md={5}>
          <Card className="admin-contact-list-card">
            <Card.Header className="bg-success text-white py-2">
              Danh sách liên hệ chưa phản hồi
            </Card.Header>
            <Card.Body className="admin-contact-list-body">
              {loading && <div className="text-center text-muted py-3">Đang tải dữ liệu...</div>}
              {!loading && contacts.length === 0 && (
                <div className="text-center text-muted py-3">Không có liên hệ nào.</div>
              )}
              {!loading && contacts.map((contact, idx) => (
                <div
                  className={`admin-contact-item ${selectedContact?.chatID === contact.chatID ? "active" : ""}`}
                  key={contact.chatID}
                >
                  <div className="admin-contact-index">#{idx + 1}</div>
                  <div className="admin-contact-main">
                    <div className="admin-contact-name">{contact.fullName}</div>
                    <div className="admin-contact-meta">{contact.email}</div>
                    <div className="admin-contact-meta">{contact.phoneNumber || "Chưa có số điện thoại"}</div>
                  </div>
                  <Button
                    variant="info"
                    size="sm"
                    className="admin-contact-detail-btn"
                    onClick={() => handleViewDetail(contact)}
                  >
                    Xem
                  </Button>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col md={7}>
          {selectedContact ? (
            <Card>
              <Card.Header className="bg-info text-white py-2">
                Chi tiết liên hệ
              </Card.Header>
              <Card.Body>
                <h5>{selectedContact.fullName}</h5>
                <div>
                  <b>Email:</b> {selectedContact.email}
                  <br />
                  <b>Điện thoại:</b> {selectedContact.phoneNumber}
                </div>
                <div className="mt-3">
                  <b>Nội dung liên hệ:</b>
                  <div className="border rounded p-2 bg-light mt-2">
                    {selectedContact.message}
                  </div>
                </div>
                <div className="mt-4 text-end">
                  <Button variant="primary" onClick={handleReplyClick}>
                    Phản hồi
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ) : (
            <div className="text-muted">Chọn liên hệ để xem chi tiết.</div>
          )}
        </Col>
      </Row>

      {/* Modal phản hồi */}
      <Modal show={showReplyModal} onHide={() => setShowReplyModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Phản hồi liên hệ</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleReplySubmit}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>
                Gửi phản hồi cho: <b>{selectedContact?.fullName}</b> ({selectedContact?.email})
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                required
                placeholder="Nhập nội dung phản hồi..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowReplyModal(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="success" disabled={replying || !replyMessage.trim()}>
              {replying ? "Đang gửi..." : "Gửi phản hồi"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default AdminContactReply;
