import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar2 from "../components/common/Navbar2";
import TourHeader from "../components/TourDetail/TourHeader";
import TourGallery from "../components/TourDetail/TourGallery";
import TourDetail from "../components/TourDetail/TourDetail";
import { getTourDetail } from "../../src/services/api";

const TourDetailPage = () => {
  const [tourData, setTourData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { tourId } = useParams();

  useEffect(() => {
    const fetchTourDetail = async () => {
      if (!tourId) {
        setError("Không có tourId được cung cấp.");
        setLoading(false);
        return;
      }

      try {
        const data = await getTourDetail(tourId);
        console.log("Tour Data:", data); // Debug dữ liệu
        setTourData(data);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải dữ liệu tour: " + (err.message || "Lỗi không xác định"));
        setLoading(false);
      }
    };

    fetchTourDetail();
  }, [tourId]);

  if (loading) {
    return (
      <div className="page-wrapper">
        <Navbar2 />
        <div className="container">
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <Navbar2 />
        <div className="container">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Navbar2 />
      <TourGallery images={tourData.images} />
      <TourHeader tour={tourData} />
      <TourDetail tour={tourData} />
    </div>
  );
};

export default TourDetailPage;