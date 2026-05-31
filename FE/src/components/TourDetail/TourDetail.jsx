import React, { useState, useEffect } from 'react';
import TourSuggestionForm from './TourSuggestionForm';
import TourIncludeExclude from './TourIncludeExclude';
import TourTimelineAccordion from './TourTimelineAccordion';
import TourReviews from './TourReviews';
import ReviewForm from './ReviewForm';
import TourRecommendations from './TourRecommendations';
import { jwtDecode } from "jwt-decode";


const TourDetail = ({ tour }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      setCurrentUser({
        userID: decoded.userId, 
        username: decoded.sub   
      });
    } catch (e) {
      setCurrentUser(null);
    }
  } else {
    setCurrentUser(null);
  }
}, []);

  if (!tour) return null;

  return (
    <section className="tour-details-page pb-100">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="tour-details-content">
              <h3>{tour.title}</h3>
              <p>{tour.description}</p>
              <h3>Lịch trình</h3>
              <TourTimelineAccordion timelines={tour.timelines} />
              <TourIncludeExclude />
              <h3>Đánh Giá</h3>
              <TourReviews tourId={tour.tourID} />
              {currentUser && (
                <ReviewForm
                  tour={tour}
                  currentUser={currentUser}
                />
              )}
            </div>
          </div>
          <div className="col-lg-4 col-md-8 col-sm-10 rmt-75">
            <div className="blog-sidebar tour-sidebar">
              <TourSuggestionForm tour={tour} />
              <TourRecommendations tourId={tour.tourID} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourDetail;