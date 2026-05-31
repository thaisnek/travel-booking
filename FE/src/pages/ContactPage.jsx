import React from 'react';
import Navbar2 from '../components/common/Navbar2';
import Banner from '../components/Booking/Banner';
import Footer from '../components/common/Footer';
import ContactInfo from '../components/Contact/ContactInfo';
import ContactForm from '../components/Contact/ContactForm';

const ContactPage = () => {
  return (
    <div className="page-wrapper">
      <Navbar2 />
      <Banner
        title="Tours"
        backgroundImage="/assets/images/banner/banner.jpg"
      />
      <ContactInfo />
      <ContactForm/>
      <Footer />
    </div>
  );
};

export default ContactPage;

