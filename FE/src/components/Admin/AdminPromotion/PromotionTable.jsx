import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, Modal, Form } from "react-bootstrap";
import {
  getAllPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from "../../../services/api";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";

const initialPromotion = {
  code: "",
  description: "",
  discount: 0,
  startDate: "",
  endDate: "",
  quantity: 0,
};

export default function PromotionTable() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [promotion, setPromotion] = useState(initialPromotion);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchPromotions();
    // eslint-disable-next-line
  }, [page]);

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const data = await getAllPromotions(page, 9);
      const nextTotalPages = Math.max(data.totalPages || 0, 1);
      if (page >= nextTotalPages) {
        setPage(nextTotalPages - 1);
        return;
      }
      setPromotions(data.content || []);
      setTotalPages(nextTotalPages);
    } catch (err) {
      alert("Lỗi khi tải danh sách promotion!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa promotion này?")) {
      try {
        await deletePromotion(id);
        fetchPromotions();
      } catch (err) {
        alert("Xóa promotion thất bại!");
      }
    }
  };

  const handleShowModal = (promotionObj = initialPromotion, edit = false, id = null) => {
    setPromotion({
      ...promotionObj,
      startDate: promotionObj.startDate ? promotionObj.startDate : "",
      endDate: promotionObj.endDate ? promotionObj.endDate : "",
    });
    setIsEdit(edit);
    setEditId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPromotion(initialPromotion);
    setIsEdit(false);
    setEditId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromotion((prev) => ({
      ...prev,
      [name]: name === "discount" || name === "quantity" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit && editId) {
        await updatePromotion(editId, promotion);
      } else {
        await createPromotion(promotion);
      }
      handleCloseModal();
      fetchPromotions();
    } catch (err) {
      alert("Lưu promotion thất bại!");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-sm mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Promotions</h5>
        <Button variant="success" size="sm" onClick={() => handleShowModal()}>
          <FaPlus className="me-1" /> Thêm mới
        </Button>
      </div>
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover responsive size="sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Mã code</th>
              <th>Mô tả</th>
              <th>Giảm giá (%)</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Số lượng</th>
              <th>Sửa</th>
              <th>Xóa</th>
            </tr>
          </thead>
          <tbody>
            {promotions.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              promotions.map((promo) => (
                <tr key={promo.promotionID}>
                  <td>{promo.promotionID}</td>
                  <td>{promo.code}</td>
                  <td>{promo.description}</td>
                  <td>{promo.discount}</td>
                  <td>{promo.startDate}</td>
                  <td>{promo.endDate}</td>
                  <td>{promo.quantity}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleShowModal(promo, true, promo.promotionID)}
                    >
                      <FaEdit />
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(promo.promotionID)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      <div className="d-flex justify-content-between align-items-center">
        <span>Trang {page + 1} / {totalPages}</span>
        <div>
          <Button
            size="sm"
            variant="outline-secondary"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="outline-secondary"
            className="ms-2"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{isEdit ? "Sửa Promotion" : "Thêm Promotion"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-2">
              <Form.Label>Mã code</Form.Label>
              <Form.Control
                className="border border-primary"
                name="code"
                value={promotion.code}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                className="border border-primary"
                name="description"
                value={promotion.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Giảm giá (%)</Form.Label>
              <Form.Control
                className="border border-primary"
                name="discount"
                type="number"
                value={promotion.discount}
                onChange={handleChange}
                required
                min={0}
                max={100}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Ngày bắt đầu</Form.Label>
              <Form.Control
                className="border border-primary"
                name="startDate"
                type="date"
                value={promotion.startDate}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Ngày kết thúc</Form.Label>
              <Form.Control
                className="border border-primary"
                name="endDate"
                type="date"
                value={promotion.endDate}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Số lượng</Form.Label>
              <Form.Control
                className="border border-primary"
                name="quantity"
                type="number"
                value={promotion.quantity}
                onChange={handleChange}
                required
                min={0}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              {isEdit ? "Lưu" : "Thêm"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
