// src/components/Banner.js
import React from 'react';

const Banner = ({ backgroundImage }) => {
  return (
    <section
      className="page-banner-area pt-50 pb-35 rel z-1 bgs-cover"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
    </section>
  );
};

export default Banner;