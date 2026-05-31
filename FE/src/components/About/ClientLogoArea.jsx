import React from "react";

const clientLogos = [
  "/assets/images/client-logos/client-logo1.png",
  "/assets/images/client-logos/client-logo2.png",
  "/assets/images/client-logos/client-logo3.png",
  "/assets/images/client-logos/client-logo4.png",
];

const ClientLogoArea = () => (
  <section className="client-logo-area pt-50 pb-50 rel z-1">
    <div className="container">
      <div className="row justify-content-center">
        {clientLogos.map((logo, idx) => (
          <div className="col-auto" key={idx}>
            <img src={logo} alt={`Client ${idx + 1}`} style={{ height: 60 }} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ClientLogoArea;
