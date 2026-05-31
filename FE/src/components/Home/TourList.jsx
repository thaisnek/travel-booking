import React, { useState, useEffect } from 'react';
import TourCard from './TourCard';
import { getTours } from '../../services/api';

const TourList = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const tourData = await getTours(); 
        setTours(tourData); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tours:', error);
        setLoading(false);
      }
    };
    fetchTours();
  }, []); 

  if (loading) {
    return (
      <section className="destinations-area bgc-black pt-100 pb-70 rel z-1">
        <div className="tour-container">
          <div className="section-title text-white text-center counter-text-wrap mb-70">
            <h2>Khám phá kho báu Việt Nam cùng Travela</h2>
            <p>Loading tours...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="destinations-area bgc-black pt-100 pb-70 rel z-1">
      <div className="container-fluid">
        <div className="row justify-content-center">
            <div className="col-lg-12">
                <div className="section-title text-white text-center counter-text-wrap mb-70">
                    <h2>Khám phá kho báu Việt Nam cùng Travela</h2>
                    <p>Website <span className="count-text plus">24080</span> phổ
                        biến nhất mà bạn sẽ nhớ</p>
                </div>
            </div>
        </div>
        <div className="row justify-content-center">
          {tours.map((tour) => (
            <TourCard key={tour.tourID} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TourList;