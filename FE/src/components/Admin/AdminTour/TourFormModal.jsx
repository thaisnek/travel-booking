import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const emptyTimeline = { day: "", description: "" };

export default function TourFormModal({ show, onHide, onSubmit, initialData, isEdit }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    quantity: 1,
    priceAdult: 0,
    priceChild: 0,
    destination: "",
    domain: "",
    availability: true,
    startDate: "",
    endDate: "",
  });
  const [timelines, setTimelines] = useState([]);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
        duration: initialData.duration || "",
        quantity: initialData.quantity || 1,
        priceAdult: initialData.priceAdult || 0,
        priceChild: initialData.priceChild || 0,
        destination: initialData.destination || "",
        domain: initialData.domain || "",
        availability: initialData.availability ?? true,
        startDate: initialData.startDate || "",
        endDate: initialData.endDate || "",
      });
      setTimelines(initialData.timelines || []);
    } else {
      setForm({
        title: "",
        description: "",
        duration: "",
        quantity: 1,
        priceAdult: 0,
        priceChild: 0,
        destination: "",
        domain: "",
        availability: true,
        startDate: "",
        endDate: "",
      });
      setTimelines([]);
    }
    setStep(1);
  }, [initialData, show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTimelineChange = (idx, field, value) => {
    const newTimelines = [...timelines];
    newTimelines[idx][field] = value;
    setTimelines(newTimelines);
  };
  const addTimeline = () => setTimelines((prev) => [...prev, { ...emptyTimeline }]);
  const removeTimeline = (idx) => setTimelines((prev) => prev.filter((_, i) => i !== idx));

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleBack = (e) => {
    e.preventDefault();
    setStep(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, timelines });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" backdrop="static">
      <Form onSubmit={step === 1 ? handleNext : handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Cập nhật Tour" : "Thêm mới Tour"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {step === 1 && (
            <>
              <h5>Thông tin cơ bản của Tour</h5>
              <Row className="mb-2">
                <Col>
                  <Form.Group>
                    <Form.Label>Tên tour</Form.Label>
                    <Form.Control
                      className="border border-primary"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Thời gian</Form.Label>
                    <Form.Control
                      className="border border-primary"
                      name="duration"
                      value={form.duration}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-2">
                <Form.Label>Mô tả</Form.Label>
                <Form.Control
                  className="border border-primary"
                  as="textarea"
                  rows={2}
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Row className="mb-2">
                <Col>
                  <Form.Group>
                    <Form.Label>Số lượng</Form.Label>
                    <Form.Control
                      className="border border-primary"
                      type="number"
                      name="quantity"
                      value={form.quantity}
                      min={1}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Giá người lớn</Form.Label>
                    <Form.Control
                      className="border border-primary"
                      type="number"
                      name="priceAdult"
                      value={form.priceAdult}
                      min={1}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Giá trẻ em</Form.Label>
                    <Form.Control
                      className="border border-primary"
                      type="number"
                      name="priceChild"
                      value={form.priceChild}
                      min={0}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col>
                  <Form.Group>
                    <Form.Label>Điểm đến</Form.Label>
                    <Form.Control
                      className="border border-primary"
                      name="destination"
                      value={form.destination}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Khu vực</Form.Label>
                    <Form.Control
                      className="border border-primary"
                      name="domain"
                      value={form.domain}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col>
                  <Form.Group>
                    <Form.Label>Trạng thái</Form.Label>
                    <Form.Check
                      type="checkbox"
                      label="Còn chỗ"
                      name="availability"
                      checked={form.availability}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Ngày bắt đầu</Form.Label>
                    <Form.Control
                      className="border border-primary"
                      type="date"
                      name="startDate"
                      value={form.startDate}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Ngày kết thúc</Form.Label>
                    <Form.Control
                      className="border border-primary"
                      type="date"
                      name="endDate"
                      value={form.endDate}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}
          {step === 2 && (
            <>
              <h5>Lịch trình</h5>
              {timelines.map((tl, idx) => (
                <Row key={idx} className="mb-2">
                  <Col xs={3}>
                    <Form.Control
                      className="border border-primary"
                      type="number"
                      placeholder="Ngày"
                      value={tl.day}
                      onChange={e => handleTimelineChange(idx, "day", e.target.value)}
                      min={1}
                      required
                    />
                  </Col>
                  <Col xs={7}>
                    <Form.Control
                      className="border border-primary"
                      placeholder="Mô tả"
                      value={tl.description}
                      onChange={e => handleTimelineChange(idx, "description", e.target.value)}
                      required
                    />
                  </Col>
                  <Col xs={2}>
                    <Button variant="danger" size="sm" onClick={() => removeTimeline(idx)}>-</Button>
                  </Col>
                </Row>
              ))}
              <Button variant="secondary" size="sm" onClick={addTimeline}>+ Thêm ngày</Button>
              <hr />
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {step === 2 && (
            <Button variant="secondary" onClick={handleBack}>
              Quay lại
            </Button>
          )}
          <Button variant="secondary" onClick={onHide}>
            Hủy
          </Button>
          <Button variant="primary" type="submit">
            {step === 1 ? "Tiếp theo" : isEdit ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
