import React from 'react';
import Navbar2 from '../components/common/Navbar2';
import AllTour from '../components/TourList/AllTour';

const TourPage = () => {
  return (
    <div className="page-wrapper">
      <Navbar2 />
      <AllTour />
    </div>
  );
};

export default TourPage;