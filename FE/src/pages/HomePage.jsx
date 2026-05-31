import React from 'react';
import Navbar from '../components/common/Navbar';
import HeroSection from '../components/Home/HeroSection';
import TourList from '../components/Home/TourList';
import Footer from '../components/common/Footer';

const HomePage = () => {
  return (
    <div className="page-wrapper">
      <Navbar />
      <HeroSection />
      <div className="form-back-drop"></div>
      <TourList />
      <Footer />
    </div>
  );
};

export default HomePage;