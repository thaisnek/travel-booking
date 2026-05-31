import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TourPage from '../pages/TourPage';
import HomePage from '../pages/HomePage';
import TourDetailPage from '../pages/TourDetailPage';
import BookingPage from '../pages/BookingPage';
import SuccessPage from '../pages/SuccessPage';
import CancelPage from '../pages/CancelPage';
import SearchPage from '../pages/SearchPape';
import ContactPage from '../pages/ContactPage';
import AdminTour from '../pages/AdminTour';
import AdminBooking from '../pages/AdminBooking';
import AdminReview from '../pages/AdminReview';
import AdminPromotion from '../pages/AdminPromotion';
import MyTourPage from '../pages/MyTourPage';
import UserProfilePage from '../pages/UserProfilePage';
import AdminUser from '../pages/AdminUser';
import AdminProfilePage from '../pages/AdminProfilePage';
import RegisterPage from '../pages/RegisterPage';
import LoginPage from '../pages/LoginPage';
import AboutPage from '../pages/AboutPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import AdminContact from '../pages/AdminContact';
import ErrorPage from '../pages/ErrorPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="*" element={<div>404 - Not Found</div>} />
      <Route path="/all-tours" element={<TourPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/tour-details/:tourId" element={<TourDetailPage />} />
      <Route path="/booking/:tourId" element={<BookingPage />} />
      <Route path="/payment/success" element={<SuccessPage />} />
      <Route path="/payment/cancel" element={<CancelPage />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/history" element={<MyTourPage />} />
      <Route path="/my-profile" element={<UserProfilePage />} />
      <Route path="/admin/tour" element={<AdminTour />} />
      <Route path="/admin/booking" element={<AdminBooking />} />
      <Route path="/admin/review" element={<AdminReview />} />
      <Route path="/admin/promotion" element={<AdminPromotion />} />
      <Route path="/admin/user" element={<AdminUser />} />
      <Route path="/admin/admin-profile" element={<AdminProfilePage />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      <Route path="/admin/contact" element={<AdminContact />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
};

export default AppRoutes;
