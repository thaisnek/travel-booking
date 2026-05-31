import React, { useState, useEffect } from 'react';
import { getAvailableTours } from '../../services/api'; // Import các hàm API
import { FaStar, FaMapMarkerAlt, FaArrowRight, FaChevronLeft, FaChevronRight, FaRegClock, FaRegUser} from 'react-icons/fa';
import Slider from 'rc-slider'; // Import Slider để lọc giá
import 'rc-slider/assets/index.css'; // Import CSS cho Slider
import { getTourImageSrc } from '../../utils/tourImages';


// Định nghĩa các hằng số về đường dẫn ảnh
const AllTour = () => {
  const [tours, setTours] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [size] = useState(9);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minPrice: null,
    maxPrice: null,
    domain: null,
    star: null,
    time: null,
    sorting: null,
  });
  const [priceRange, setPriceRange] = useState([0, 10000000]);

  // Gọi API khi filter hoặc page thay đổi
  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        // Gộp params lọc + phân trang
        const params = {
          page,
          size,
          ...(filters.minPrice !== null && { minPrice: filters.minPrice }),
          ...(filters.maxPrice !== null && { maxPrice: filters.maxPrice }),
          ...(filters.domain && { domain: filters.domain }),
          ...(filters.star !== null && { star: filters.star }),
          ...(filters.duration && { duration: filters.duration }),
          ...(filters.sorting && { sort: filters.sorting }),
        };
        const response = await getAvailableTours(params);
        const mappedTours = response.content.map((tour) => ({
          id: tour.tourID,
          images: tour.images,
          location: tour.destination,
          title: tour.title,
          duration: tour.duration,
          capacity: tour.quantity,
          price: tour.priceAdult?.toLocaleString(),
          rating: tour.averageRating,
        }));
        setTours(mappedTours);
        setTotalPages(response.totalPages);
      } catch (error) {
        setTours([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, [filters, page, size]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  // Xử lý filter
  const handlePriceChange = (value) => {
    setPriceRange(value);
    setFilters(prev => ({
      ...prev,
      minPrice: value[0],
      maxPrice: value[1],
    }));
  };

  const handleDomainChange = (e) => {
    const domain = e.target.value;
    const mappedDomain = {
      b: 'Miền Bắc',
      t: 'Miền Trung',
      n: 'Miền Nam',
    }[domain] || null;
    setFilters(prev => ({
      ...prev,
      domain: mappedDomain,
    }));
  };

  const handleStarChange = (e) => {
    const star = parseInt(e.target.value);
    setFilters(prev => ({
      ...prev,
      star: star,
    }));
  };

  const handleDurationChange = (e) => {
    const duration = e.target.value;
    setFilters(prev => ({
      ...prev,
      duration: duration,
    }));
  };

  const handleSortingChange = (e) => {
    const sorting = e.target.value !== 'default' ? e.target.value : null;
    setFilters(prev => ({
      ...prev,
      sorting: sorting,
    }));
    setPage(0); // Reset về trang đầu khi đổi sort
  };

  const handleClearFilters = () => {
    setFilters({
      minPrice: null,
      maxPrice: null,
      domain: null,
      star: null,
      time: null,
      sorting: null,
    });
    setPriceRange([0, 10000000]);
    setPage(0);
  };

  if (loading) {
    return (
      <section className="tour-grid-page py-100 rel z-1">
        <div className="container">
          <p>Loading available tours...</p>
        </div>
      </section>
    );
  }

  const starLevels = [
    [1, 1, 1, 1, 1], // 5 vàng
    [1, 1, 1, 1, 0], // 4 vàng, 1 đen
    [1, 1, 1, 0, 0], // 3 vàng, 2 đen
    [1, 1, 0, 0, 0], // 2 vàng, 3 đen
    [1, 0, 0, 0, 0], // 1 vàng, 4 đen
  ];

  return (
    <section className="tour-grid-page py-100 rel z-1">
      <div className="container">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3 col-md-6 col-sm-10 rmb-75">
            <div className="shop-sidebar">
              <div className="div_filter_clear">
                <button className="clear_filter" onClick={handleClearFilters}>
                  <a href="/all-tours">Clear</a>
                </button>
              </div>

              {/* Price Filter */}
              <div className="widget widget-filter">
                <h6 className="widget-title">Lọc theo giá</h6>
                <div className="price-filter-wrap">
                  <Slider
                    range
                    min={0}
                    max={10000000}
                    value={priceRange}
                    onChange={handlePriceChange}
                    step={100000}
                  />
                  <div className="price">
                    <span>Giá </span>
                    <input
                      type="text"
                      id="price"
                      value={`${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()} VND`}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Domain Filter */}
              <div className="widget widget-activity">
                <h6 className="widget-title">Điểm đến</h6>
                <ul className="radio-filter">
                  <li>
                    <input
                      type="radio"
                      name="domain"
                      id="id_mien_bac"
                      value="b"
                      onChange={handleDomainChange}
                      checked={filters.domain === 'Miền Bắc'}
                    />
                    <label htmlFor="id_mien_bac">Miền Bắc </label>
                  </li>
                  <li>
                    <input
                      type="radio"
                      name="domain"
                      id="id_mien_trung"
                      value="t"
                      onChange={handleDomainChange}
                      checked={filters.domain === 'Miền Trung'}
                    />
                    <label htmlFor="id_mien_trung">Miền Trung </label>
                  </li>
                  <li>
                    <input
                      type="radio"
                      name="domain"
                      id="id_mien_nam"
                      value="n"
                      onChange={handleDomainChange}
                      checked={filters.domain === 'Miền Nam'}
                    />
                    <label htmlFor="id_mien_nam">Miền Nam </label>
                  </li>
                </ul>
              </div>

              {/* Review Filter */}
              <div className="widget widget-reviews">
                <h6 className="widget-title">Đánh giá</h6>
                <ul className="radio-filter">
                  {starLevels.map((level, index) => (
                    <li key={index}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="filter_star"
                        id={`${5 - index}star`}
                        value={5 - index}
                        onChange={handleStarChange}
                        checked={filters.star === 5 - index}
                      />
                      <label htmlFor={`${5 - index}star`}>
                        <span className="ratting">
                          {level.map((v, i) => (
                            <FaStar key={i} className={v ? "star filled" : "star empty"} />
                          ))}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Duration Filter */}
              <div className="widget widget-duration">
                <h6 className="widget-title">Thời gian</h6>
                <ul className="radio-filter">
                  <li>
                    <input
                      type="radio"
                      name="duration"
                      id="3ngay2dem"
                      value="3N2Đ"
                      onChange={handleDurationChange}
                      checked={filters.duration === '3N2Đ'}
                    />
                    <label htmlFor="3ngay2dem">3 ngày 2 đêm</label>
                  </li>
                  <li>
                    <input
                      type="radio"
                      name="duration"
                      id="4ngay3dem"
                      value="4N3Đ"
                      onChange={handleDurationChange}
                      checked={filters.duration === '4N3Đ'}
                    />
                    <label htmlFor="4ngay3dem">4 ngày 3 đêm</label>
                  </li>
                  <li>
                    <input
                      type="radio"
                      name="duration"
                      id="5ngay4dem"
                      value="5N4Đ"
                      onChange={handleDurationChange}
                      checked={filters.duration === '5N4Đ'}
                    />
                    <label htmlFor="5ngay4dem">5 ngày 4 đêm</label>
                  </li>
                </ul>
              </div>

              {/* CTA */}
              <div className="widget widget-cta mt-30">
                <div className="content text-white">
                  <span className="h6">Khám Phá Việt Nam</span>
                  <h3>Địa điểm du lịch tốt nhất</h3>
                  <a href="tour-detail.html" className="theme-btn style-two bgc-secondary">
                    <span data-hover="Khám phá ngay">Khám phá ngay</span>
                    <i className="fal fa-arrow-right"></i>
                  </a>
                </div>
                <div className="image">
                  <img src="/assets/images/widgets/cta-widget.png" alt="CTA" />
                </div>
                <div className="cta-shape">
                  <img src="/assets/images/widgets/cta-shape2.png" alt="Shape" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            <div className="shop-shorter rel z-3 mb-20" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="sort-text mb-15 me-4 me-xl-auto" style={{ marginBottom: '0' }}>
                Tours tìm thấy: {tours.length}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="sort-text mb-15 me-4" style={{ marginBottom: '0', whiteSpace: 'nowrap' }}>
                  Sắp xếp theo
                </div>
                <select
                  id="sorting_tours"
                  style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc', whiteSpace: 'nowrap' }}
                  onChange={handleSortingChange}
                  value={filters.sorting || 'default'}
                >
                  <option value="default">Sắp xếp theo</option>
                  <option value="tourID,desc">Mới nhất</option>
                  <option value="tourID,asc">Cũ nhất</option>
                  <option value="priceAdult,desc">Cao đến thấp</option>
                  <option value="priceAdult,asc">Thấp đến cao</option>
                </select>
              </div>
            </div>

            {/* Tour Grid */}
            <div className="tour-grid-wrap">
              <div className="row" id="tours-container">
                {tours.map((mappedTours) => (
                  <div key={mappedTours.id} className="col-xl-4 col-md-6" style={{ marginBottom: "30px" }}>
                    <div className="destination-item tour-grid style-three bgc-lighter block_tours equal-block-fix">
                      <div className="image">
                        <span className="badge bgc-pink">Featured</span>
                        <img src={getTourImageSrc(mappedTours.images)} alt={mappedTours.title || "Tour List"} />
                      </div>
                      <div className="content equal-content-fix">
                        <div className="destination-header">
                          <span className="location">
                            <FaMapMarkerAlt style={{marginBottom: 5 }}/> {mappedTours.location}
                          </span>
                          <div className="ratting filled" style={{ marginTop: 5 }}>
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={i < mappedTours.rating ? "star filled" : "star empty"}
                                style={{ color: i < mappedTours.rating ? "#ffb300" : "#ddd" }}
                              />
                            ))}
                          </div>
                        </div>
                        <h6>
                          <a href={`/tour-details/${mappedTours.id}`}>{mappedTours.title}</a>
                        </h6>
                        <ul className="blog-meta">
                          <li>
                            <FaRegClock style={{marginBottom: 5 }} /> {mappedTours.duration}
                          </li>
                          <li>
                            <FaRegUser style={{marginBottom: 5 }} /> {mappedTours.capacity}
                          </li>
                        </ul>
                        <div className="destination-footer">
                          <span className="price">
                            <span>{mappedTours.price}</span> VND / người
                          </span>
                          <a
                            href={`/tour-details/${mappedTours.id}`}
                            className="theme-btn style-two style-three"
                          >
                            <FaArrowRight/>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <ul className="pagination justify-content-center pt-15 flex-wrap pagination-tours">
              <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                >
                  <FaChevronLeft />
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, idx) => (
                <li className={`page-item ${page === idx ? "active" : ""}`} key={idx}>
                  <button className="page-link" onClick={() => handlePageChange(idx)}>
                    {idx + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${page === totalPages - 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages - 1}
                >
                  <FaChevronRight />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllTour;
