import React from "react";
import Navbar from "../components/common/Navbar2";
import AboutBanner from "../components/About/AboutBanner";
import AboutIntro from "../components/About/AboutIntro";
import AboutFeatures from "../components/About/AboutFeatures";
import AboutUs from "../components/About/AboutUs";
import AboutTeam from "../components/About/AboutTeam";
import AboutFeatureTwo from "../components/About/AboutFeatureTwo";
import ClientLogoArea from "../components/About/ClientLogoArea";
import Footer from "../components/common/Footer";

const AboutPage = () => (
  <div className="page-wrapper">
    <Navbar />
    <AboutBanner />
    <AboutIntro />
    <AboutFeatures />
    <AboutUs />
    <AboutTeam />
    <AboutFeatureTwo />
    <ClientLogoArea />
    <Footer />
  </div>
);

export default AboutPage;
