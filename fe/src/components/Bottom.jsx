import { FaHome, FaHeart, FaCompass, FaUser } from 'react-icons/fa';
import './Bottom.css';

const Bottom = () => {
  return (
    <div className="bottom-bar">
      <div className="bottom-bar-container">
        <button className="bottom-bar-item">
          <FaHome />
          <span>Trang chủ</span>
        </button>
        <button className="bottom-bar-item">
          <FaCompass />
          <span>Khám phá</span>
        </button>
        <button className="bottom-bar-item">
          <FaHeart />
          <span>Yêu thích</span>
        </button>
        <button className="bottom-bar-item">
          <FaUser />
          <span>Tài khoản</span>
        </button>
      </div>
    </div>
  );
};

export default Bottom;