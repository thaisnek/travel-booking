import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaUser, FaArrowRight } from 'react-icons/fa';
import axios from 'axios';

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
    setIsDropdownOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const searchKeyword = e.target.keyword.value;
    if (!searchKeyword.trim()) {
      alert('Vui lòng nhập từ khóa tìm kiếm.');
      return;
    }
    try {
      const response = await axios.get('http://localhost:8080/ltweb/api/tours/search-tours', {
        params: { keyword: searchKeyword },
      });
      navigate('/search', { state: { tours: response.data || [] } });
      setKeyword('');
      setIsSearchOpen(false);
    } catch (err) {
      console.error('Lỗi khi gửi yêu cầu tìm kiếm:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      let errorMessage = 'Đã xảy ra lỗi khi tìm kiếm tour. Vui lòng thử lại sau.';
      if (err.response) {
        errorMessage = `Lỗi từ server: ${err.response.data?.message || err.response.statusText}`;
      } else if (err.request) {
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc đảm bảo backend đang chạy.';
      }
      alert(errorMessage);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const location = useLocation();

  return (
    <header className={`main-header header-one white-menu ${isFixed ? 'fixed-header' : ''}`}>
      <div className="header-upper py-30 rpy-0" style={{ backgroundColor: '#1c231f' }}>
        <div className="container-fluid clearfix">
          <div className="header-inner rel d-flex align-items-center">
            <div className="mobile-logo">
              <Link to="/">
                <img src="/assets/images/logos/logo.png" alt="Logo" title="Logo" />
              </Link>
            </div>
            <div className="nav-outer mx-lg-auto ps-xxl-5 clearfix">
              <nav className="main-menu navbar-expand-lg">
                <div className="navbar-collapse collapse clearfix">
                  <ul className="navigation clearfix">
                    <li className={location.pathname === "/" ? "active" : ""}>
                      <Link to="/">Trang chủ</Link>
                    </li>
                    <li className={location.pathname === "/about" ? "active" : ""}>
                      <Link to="/about">Giới thiệu</Link>
                    </li>
                    <li className={location.pathname === "/all-tours" ? "active" : ""}>
                      <Link to="/all-tours">Tours</Link>
                    </li>
                    <li className={location.pathname === "/contact" ? "active" : ""}>
                      <Link to="/contact">Liên hệ</Link>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>

            <div className="nav-search">
              <button onClick={toggleSearch} aria-label="Toggle search">
                <FaSearch />
              </button>
              <form
                onSubmit={handleSearch}
                className={isSearchOpen ? '' : 'hide'}
                method="GET"
              >
                <input
                  type="search"
                  name="keyword"
                  placeholder="Tìm kiếm tour..."
                  className="searchbox"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  required
                />
                <button type="submit" className="searchbutton" aria-label="Search">
                  <FaSearch />
                </button>
              </form>
            </div>

            <div className="menu-btns py-10">
              <Link to="/all-tours" className="theme-btn style-two bgc-secondary">
                <span data-hover="Đặt Ngay">Book Now</span>
                <FaArrowRight />
              </Link>
              <div className="menu-sidebar">
                <li className="drop-down" style={{ position: 'relative', display: 'inline-block' }}>
                  <button
                    className="dropdown-toggle bg-transparent"
                    id="userDropdown"
                    style={{ color: 'white', border: 'none', background: 'none', cursor: 'pointer' }}
                    onClick={toggleDropdown}
                    aria-expanded={isDropdownOpen}
                  >
                    <FaUser style={{ fontSize: '36px', color: 'white' }} />
                  </button>
                  {isDropdownOpen && (
                    <ul
                      className="dropdown-menu"
                      id="dropdownMenu"
                      style={{
                        display: 'block',
                        position: 'absolute',
                        top: '100%',
                        right: '0',
                        backgroundColor: 'white',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        minWidth: '150px',
                        zIndex: '1000',
                        margin: '0',
                        padding: '10px 0',
                        listStyle: 'none',
                      }}
                    >
                      <li style={{ padding: '8px 20px' }}>
                        <Link to="/my-profile" style={{ textDecoration: 'none', color: 'black', display: 'block' }}>
                          Thông tin cá nhân
                        </Link>
                      </li>
                      <li style={{ padding: '8px 20px' }}>
                        <Link to="/history" style={{ textDecoration: 'none', color: 'black', display: 'block' }}>
                          Tour đã đặt
                        </Link>
                      </li>
                      {!isLoggedIn && (
                        <>
                          <li style={{ padding: '8px 20px' }}>
                            <Link to="/register" style={{ textDecoration: 'none', color: 'black', display: 'block' }}>
                              Đăng ký
                            </Link>
                          </li>
                          <li style={{ padding: '8px 20px' }}>
                            <Link to="/login" style={{ textDecoration: 'none', color: 'black', display: 'block' }}>
                              Đăng nhập
                            </Link>
                          </li>
                        </>
                      )}
                      {isLoggedIn && (
                        <li style={{ padding: '8px 20px', cursor: 'pointer' }} onClick={handleLogout}>
                          <span style={{ color: 'black', display: 'block' }}>
                            Đăng xuất
                          </span>
                        </li>
                      )}
                    </ul>
                  )}
                </li>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
