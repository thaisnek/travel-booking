import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar2 from '../components/common/Navbar2';
import Banner from '../components/Booking/Banner';
import BookingForm from '../components/Booking/BookingForm';
import Footer from '../components/common/Footer';
import { getCurrentUserId, isAuthenticated } from '../utils/auth';


const BookingPage = () => {
  const { tourId } = useParams(); 
  const navigate = useNavigate();
  const location = useLocation();
  const userId = getCurrentUserId();

  useEffect(() => {
    if (!isAuthenticated() || !userId) {
      alert("Bạn cần đăng nhập để đặt tour!");
      navigate("/login", {
        replace: true,
        state: { from: location.pathname },
      });
    }
  }, [location.pathname, navigate, userId]);

  if (!isAuthenticated() || !userId) {
    return null;
  }

  return (
    <div className="page-wrapper">
      <Navbar2 />
      <Banner
        title="Tours"
        backgroundImage="/assets/images/banner/banner.jpg"
      />
      <BookingForm tourId={parseInt(tourId, 10)} userId={userId}/>
      <Footer />
    </div>
  );
};

export default BookingPage;

