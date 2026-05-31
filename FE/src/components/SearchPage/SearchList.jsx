import React from 'react';
import {FaStar, FaRegStar, FaClock, FaUser, FaArrowRight, FaMapMarkerAlt } from 'react-icons/fa';
import { getTourImageSrc } from '../../utils/tourImages';


const SearchList = ({ tours }) => {
  return (
    <section className="tour-grid-page py-100 rel z-2">
      <div className="container">
        <div className="row">
          {tours.length === 0 ? (
            <h4 className="alert alert-danger">
              Không có tour nào liên quan đến tìm kiếm của bạn. Thử tìm kiếm với từ khóa khác nhé!
            </h4>
          ) : (
            tours.map((tour) => (
              <div className="col-xl-4 col-md-6" style={{ marginBottom: '30px' }} key={tour.tourID}>
                <div
                  className="destination-item tour-grid style-three bgc-lighter equal-block-fix"
                  data-aos="fade-up"
                  data-aos-duration="1500"
                  data-aos-offset="50"
                >
                  <div className="image" style={{ position: 'relative' }}>
                    <img
                      src={getTourImageSrc(tour.images)}
                      alt={tour.images && tour.images.length > 0 ? tour.images[0].description || 'Tour' : 'Tour'}
                    />
                  </div>
                  <div className="content equal-content-fix">
                    <div className="destination-header">
                      <span className="location">
                        <FaMapMarkerAlt style={{ marginRight: '5px' }} />
                        {tour.destination}
                      </span>
                      <div className="ratting">
                        {[...Array(5)].map((_, i) => (
                          i < (tour.averageRating) ? (
                            <FaStar key={i} />
                          ) : (
                            <FaRegStar key={i} />
                          )
                        ))}
                      </div>
                    </div>
                    <h5>
                      <a href={`/tour-details/${tour.tourID}`}>{tour.title}</a>
                    </h5>
                    <ul className="blog-meta">
                      <li>
                        <FaClock style={{ marginRight: '5px' }} />
                        {tour.duration}
                      </li>
                      <li>
                        <FaUser style={{ marginLeft: '10px', marginRight: '5px' }} />
                        {tour.quantity}
                      </li>
                    </ul>
                    <div className="destination-footer">
                      <span className="price">
                        <span>{tour.priceAdult.toLocaleString('vi-VN')}</span> VND / người
                      </span>
                      <a
                        href={`/tour-details/${tour.tourID}`}
                        className="theme-btn style-two style-three"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                      >
                        <span data-hover="Đặt ngay">Đặt ngay</span>
                        <FaArrowRight />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default SearchList;
