import Navbar from '../components/Navbar';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaTelegram, FaFacebookF, FaGithub } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-layout">
      <Navbar />
      
      <main className="contact-main">
        <div className="contact-container">
          <div className="contact-info">
            <h2>Kết Nối Với Chúng Tôi</h2>
            <div className="info-items">
              <div className="info-item">
                <FaEnvelope className="icon-pulse"/>
                <div>
                  <h3>Email</h3>
                  <p>hoangnd.ute@gmail.com</p>
                </div>
              </div>
              
              <div className="info-item">
                <FaTelegram className="icon-pulse"/>
                <div>
                  <h3>Telegram</h3>
                  <a href="https://t.me/hoangks_5" target="_blank" rel="noopener noreferrer" className="social-link">
                    <span className="link-text">@hoangks_5</span>
                    <span className="link-arrow">→</span>
                  </a>
                </div>
              </div>

              <div className="info-item">
                <FaFacebookF className="icon-pulse"/>
                <div>
                  <h3>Facebook</h3>
                  <a href="https://facebook.com/hoangkss5" target="_blank" rel="noopener noreferrer" className="social-link">
                    <span className="link-text">facebook.com/hoangkss5</span>
                    <span className="link-arrow">→</span>
                  </a>
                </div>
              </div>

              <div className="info-item">
                <FaGithub className="icon-pulse"/>
                <div>
                  <h3>Github</h3>
                  <a href="https://github.com/hoangks5" target="_blank" rel="noopener noreferrer" className="social-link">
                    <span className="link-text">github.com/hoangks5</span>
                    <span className="link-arrow">→</span>
                  </a>
                </div>
              </div>

              <div className="info-item">
                <FaPhone className="icon-pulse"/>
                <div>
                  <h3>Điện Thoại</h3>
                  <p>+84 358 259 167</p>
                </div>
              </div>

              <div className="info-item">
                <FaMapMarkerAlt className="icon-pulse"/>
                <div>
                  <h3>Địa Chỉ</h3>
                  <p>Cầu Giấy, Hà Nội, Việt Nam</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact; 