import React from 'react';
import Navbar from '../components/common/Navbar';
import MyTour from '../components/User/MyTour';
import Footer from '../components/common/Footer';

const MyTourPage = () => {
  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="form-back-drop"></div>
      <MyTour />
      <Footer />
    </div>
  );
};

export default MyTourPage;
