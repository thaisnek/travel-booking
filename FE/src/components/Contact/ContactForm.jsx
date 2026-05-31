import { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getCurrentUserId, isAuthenticated } from '../../utils/auth';

const API_URL = 'http://localhost:8080/ltweb/api';

function ContactForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = getCurrentUserId();
    if (!isAuthenticated() || !userId) {
      alert('Bạn cần đăng nhập để gửi liên hệ!');
      navigate('/login', { state: { from: '/contact' } });
      return;
    }

    const token = localStorage.getItem('token');
    const body = { ...formData, userId };
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/contacts/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        alert("Gửi liên hệ thành công!");
        setFormData({ fullName: '', phoneNumber: '', email: '', message: '' });
      } else {
        const message = await res.text();
        alert(message || "Gửi thất bại!");
      }
    } catch {
      alert("Có lỗi xảy ra!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="contact-form-area py-70 rel z-1">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-7">
            <div className="comment-form bgc-lighter z-1 rel mb-30 rmb-55">
              <form
                id="contactForm"
                className="contactForm"
                name="contactForm"
                onSubmit={handleSubmit}
              >
                <div className="section-title">
                  <h2>Liên hệ</h2>
                </div>
                <p>
                  Địa chỉ email của bạn sẽ không được công bố. Các trường bắt buộc được đánh dấu{' '}
                  <span style={{ color: 'red' }}>*</span>
                </p>
                <div className="row mt-35">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="fullName">
                        Họ và tên <span style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Họ và tên"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="phoneNumber">
                        Số điện thoại <span style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Số điện thoại"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="email">
                        Địa chỉ Email <span style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Nhập email"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="message">
                        Nội dung <span style={{ color: 'red' }}>*</span>
                      </label>
                      <textarea
                        name="message"
                        id="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="form-control"
                        rows="5"
                        placeholder="Nội dung"
                        required
                      ></textarea>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group mb-0">
                      <button type="submit" className="theme-btn style-two" disabled={submitting}>
                        <span data-hover="Send Comments">{submitting ? 'Đang gửi...' : 'Gửi'}</span>
                        <FaArrowRight />
                      </button>
                      <div id="msgSubmit" className="hidden"></div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="contact-images-part">
              <div className="row">
                <div className="col-12">
                  <img src="/assets/images/contact/contact1.jpg" alt="Contact" />
                </div>
                <div className="col-6">
                  <img src="/assets/images/contact/contact2.jpg" alt="Contact" />
                </div>
                <div className="col-6">
                  <img src="/assets/images/contact/contact3.jpg" alt="Contact" />
                </div>
              </div>
              <div className="circle-logo">
                <img src="/assets/images/contact/icon.png" alt="Logo" />
                <span className="title h2">Travela</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactForm;
