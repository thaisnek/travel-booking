import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Navbar2 from '../components/common/Navbar2';
import Footer from '../components/common/Footer';
import Banner from '../components/Booking/Banner';
import SearchList from '../components/SearchPage/SearchList';

const SearchPage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const keyword = query.get('keyword') || '';
  const [tours, setTours] = useState(location.state?.tours || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (location.state?.tours) {
      setTours(location.state.tours);
      setError('');
      return;
    }

    if (!keyword.trim()) {
      setTours([]);
      return;
    }

    const fetchTours = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('http://localhost:8080/ltweb/api/tours/search-tours', {
          params: { keyword },
        });
        setTours(response.data || []);
      } catch (err) {
        setTours([]);
        setError(err.response?.data?.message || 'Không thể tìm kiếm tour. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [keyword, location.state]);

  return (
    <div className="page-wrapper">
      <Navbar2 />
      <Banner
        title="Tours"
        backgroundImage="/assets/images/banner/banner.jpg"
      />
      <div className="form-back-drop"></div>
      {loading ? (
        <div className="container py-100 text-center">Đang tìm kiếm...</div>
      ) : error ? (
        <div className="container py-100">
          <h4 className="alert alert-danger">{error}</h4>
        </div>
      ) : (
        <SearchList tours={tours} />
      )}
      <Footer />
    </div>
  );
};

export default SearchPage;
