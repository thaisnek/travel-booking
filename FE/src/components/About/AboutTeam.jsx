import React from "react";
import { FaUserTie } from "react-icons/fa";

const teamMembers = [
  {
    name: "Nguyễn Văn A",
    role: "Hướng dẫn viên",
    img: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Trần Thị B",
    role: "Điều hành tour",
    img: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "Lê Văn C",
    role: "Tư vấn viên",
    img: "https://randomuser.me/api/portraits/men/65.jpg"
  },
  {
    name: "Phạm Thị D",
    role: "Chăm sóc khách hàng",
    img: "https://randomuser.me/api/portraits/women/68.jpg"
  }
];


const AboutTeam = () => (
  <section className="team-area pt-100 pb-70 rel z-1">
    <div className="container">
      <div className="section-title text-center mb-60">
        <h2>Đội ngũ của chúng tôi</h2>
      </div>
      <div className="row">
        {teamMembers.map((member, idx) => (
          <div className="col-lg-3 col-sm-6" key={idx}>
            <div className="team-member text-center">
              <img src={member.img} alt={member.name} className="img-fluid rounded mb-2" />
              <h5>{member.name}</h5>
              <p>
                <FaUserTie style={{ marginRight: 6 }} />
                {member.role}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutTeam;
