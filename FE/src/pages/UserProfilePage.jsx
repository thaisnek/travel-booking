import React from 'react';
import Navbar from '../components/common/Navbar';
import UserProfile from '../components/User/UserProfile';
import Footer from '../components/common/Footer';

const UserProfilePage = () => {
  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="form-back-drop"></div>
      <UserProfile />
      <Footer />
    </div>
  );
};

export default UserProfilePage;
