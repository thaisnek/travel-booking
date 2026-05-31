import React from "react";
import { Modal } from "react-bootstrap";


const BACKEND_URL = "http://localhost:8080";
const IMAGE_PATH = "/ltweb/images/tour/";

const TourDetailModal = ({ show, onHide, tour }) => (
  <Modal show={show} onHide={onHide} size="lg">
    <Modal.Header closeButton>
      <Modal.Title>Chi tiết Tour: {tour?.title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {tour ? (
        <div>
          <h6>Lịch trình:</h6>
            {tour.timelines && tour.timelines.length > 0 ? (
            <ul>
                {tour.timelines.map((item) => (
                <li key={item.timeLineID}>
                    <b>Ngày {item.day}:</b> {item.description}
                </li>
                ))}
            </ul>
            ) : (
            <div className="text-muted">Chưa có lịch trình</div>
            )}
          <hr />
          <h6>Ảnh tour:</h6>
            <div className="d-flex flex-wrap gap-2">
            {tour.images && tour.images.length > 0 ? (
                tour.images.map((img) => (
                <img
                    key={img.imageID}
                    src={BACKEND_URL + IMAGE_PATH + img.imageURL}
                    alt={img.description || "Tour image"}
                    style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 4 }}
                />
                ))
            ) : (
                <div className="text-muted">Chưa có ảnh</div>
            )}
            </div>
        </div>
      ) : (
        <div>Đang tải...</div>
      )}
    </Modal.Body>
  </Modal>
);

export default TourDetailModal;
