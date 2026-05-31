import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { DEFAULT_TOUR_IMAGE, getTourImageSrc } from '../../utils/tourImages';

const TourRecommendations = ({ tourId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`http://localhost:8080/ltweb/api/tours/${tourId}/recommendations`);
        const tours = (response.data || []).map((tour) => ({
          tourId: tour.tourID,
          title: tour.title,
          destination: tour.destination,
          duration: tour.duration,
          imageUrl: getTourImageSrc(tour.images),
        }));
        setRecommendations(tours);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Không thể tải danh sách tour gợi ý');
      } finally {
        setLoading(false);
      }
    };

    if (tourId) {
      fetchRecommendations();
    }
  }, [tourId]);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="widget widget-tour">
      <h6>Tours tương tự</h6>
      {recommendations.length ? (
        recommendations.map((tour) => (
          <div key={tour.tourId} className="destination-item tour-grid style-three bgc-lighter">
            <div className="image">
              <img
                src={tour.imageUrl}
                alt={tour.title || 'Tour gợi ý'}
                style={{ maxHeight: '137px', width: '100%', objectFit: 'cover' }}
                onError={(event) => {
                  event.currentTarget.src = DEFAULT_TOUR_IMAGE;
                }}
              />
            </div>
            <div className="content">
              <div className="destination-header">
                <span className="location">
                  <FaMapMarkerAlt className="icon" /> {tour.destination || 'N/A'}
                </span>
                <span>{tour.duration || 'N/A'}</span>
              </div>
              <h6>
                <Link to={`/tour-details/${tour.tourId}`}>{tour.title || 'Tour gợi ý'}</Link>
              </h6>
            </div>
          </div>
        ))
      ) : (
        <p>Không có tour gợi ý nào.</p>
      )}
    </div>
  );
};

export default TourRecommendations;
