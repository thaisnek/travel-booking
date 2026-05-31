import React from "react";

const TourGallery = ({ images }) => {
  const BACKEND_URL = "http://localhost:8080";
  const IMAGE_PATH = "/ltweb/images/tour/";

  const defaultImages = [
    "/assets/images/gallery-tours/ho-hoan-kiem_1732896697.jpg",
    "/assets/images/gallery-tours/chua-bai-dinh_1732896696.jpg",
    "/assets/images/gallery-tours/tfd_240103060657_209766_LANG_CA_BE_CHAU_DOC_1732936283.jpg",
    "/assets/images/gallery-tours/CAY_THOT_NOT_-_DONG_LUA__2__1732936282.jpg",
    "/assets/images/gallery-tours/screenshot_1732898476_1732898695.png",
  ];

  // Hàm build URL ảnh từ backend
  const getImageUrl = (image) => {
    if (image && image.imageURL) {
      if (image.imageURL.startsWith('http')) {
        return image.imageURL;
      }
      return BACKEND_URL + IMAGE_PATH + image.imageURL;
    }
    return defaultImages[0]; // Ảnh mặc định nếu không có imageURL
  };

  // Lấy danh sách URL ảnh từ dữ liệu backend
  const galleryImages = images && images.length > 0 
    ? images.map(img => getImageUrl(img))
    : defaultImages;

  // Đảm bảo đủ 5 ảnh
  const paddedImages = [...galleryImages];
  while (paddedImages.length < 5) {
    paddedImages.push(defaultImages[paddedImages.length % defaultImages.length]);
  }

  return (
    <div className="tour-gallery">
      <div className="container-fluid">
        <div className="row gap-10 justify-content-center rel">
          <div className="col-lg-4 col-md-6">
            <div className="gallery-item">
              <img src={paddedImages[0]} alt="Destination" />
            </div>
            <div className="gallery-item">
              <img src={paddedImages[1]} alt="Destination" />
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="gallery-item gallery-between">
              <img src={paddedImages[2]} alt="Destination" />
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="gallery-item">
              <img src={paddedImages[3]} alt="Destination" />
            </div>
            <div className="gallery-item">
              <img src={paddedImages[4]} alt="Destination" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourGallery;