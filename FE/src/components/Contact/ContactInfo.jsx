import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

function ContactInfo() {
  return (
    <section className="contact-info-area pt-100 rel z-1">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-4">
            <div className="contact-info-content mb-30 rmb-55">
              <div className="section-title mb-30">
                <h2>Hãy nói chuyện với các hướng dẫn viên du lịch chuyên nghiệp của chúng tôi</h2>
              </div>
              <p>
                Đội ngũ hỗ trợ tận tâm của chúng tôi luôn sẵn sàng hỗ trợ bạn giải đáp mọi thắc mắc hoặc vấn đề, cung cấp các giải pháp nhanh chóng và được cá nhân hóa để đáp ứng nhu cầu của bạn.
              </p>
              <div className="features-team-box mt-40">
                <h6>85+ Thành viên nhóm chuyên gia</h6>
                <div className="feature-authors">
                  {[...Array(7)].map((_, index) => (
                    <img
                      key={index}
                      src={`/assets/images/features/feature-author${index + 1}.jpg`}
                      alt="Author"
                    />
                  ))}
                  <span>+</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="row">
              <div className="col-md-6">
                <div className="contact-info-item">
                  <div className="icon">
                    <FaEnvelope />
                  </div>
                  <div className="content">
                    <h5>Cần trợ giúp và hỗ trợ</h5>
                    <div className="text">
                      <FaEnvelope className="inline" />{' '}
                      <a href="mailto:thai@gmail.com">thai@gmail.com</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="contact-info-item">
                  <div className="icon">
                    <FaPhone />
                  </div>
                  <div className="content">
                    <h5>Cần bất kỳ việc khẩn cấp nào</h5>
                    <div className="text">
                      <FaPhone className="inline" />{' '}
                      <a href="tel:+0001234588">+000 (123) 45 88</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="contact-info-item">
                  <div className="icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="content">
                    <h5>Hải Phòng</h5>
                    <div className="text">
                      <FaMapMarkerAlt className="inline" /> Lập Lễ
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="contact-info-item">
                  <div className="icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="content">
                    <h5>Hà Nội</h5>
                    <div className="text">
                      <FaMapMarkerAlt className="inline" /> Hà Đông
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactInfo;