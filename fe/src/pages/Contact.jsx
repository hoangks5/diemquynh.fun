import Navbar from '../components/Navbar';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý logic gửi form ở đây
  };

  return (
    <div className="contact-layout">
      <Navbar />
      
      <main className="contact-main">
        <div className="contact-container">
          <div className="contact-info">
            <h2>Liên Hệ Với Chúng Tôi</h2>
            <div className="info-items">
              <div className="info-item">
                <FaEnvelope />
                <div>
                  <h3>Email</h3>
                  <p>support@example.com</p>
                </div>
              </div>
              <div className="info-item">
                <FaPhone />
                <div>
                  <h3>Điện Thoại</h3>
                  <p>+84 123 456 789</p>
                </div>
              </div>
              <div className="info-item">
                <FaMapMarkerAlt />
                <div>
                  <h3>Địa Chỉ</h3>
                  <p>123 Đường ABC, Quận XYZ, TP.HCM</p>
                </div>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input type="text" placeholder="Họ và tên" required />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Email" required />
            </div>
            <div className="form-group">
              <input type="tel" placeholder="Số điện thoại" />
            </div>
            <div className="form-group">
              <textarea placeholder="Nội dung tin nhắn" rows="5" required></textarea>
            </div>
            <button type="submit" className="submit-btn">Gửi Tin Nhắn</button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Contact; 