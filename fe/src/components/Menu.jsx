import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaHome, 
  FaUser, 
  FaHeart, 
  FaCompass, 
  FaCog, 
  FaSignOutAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import './Menu.css';

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { icon: <FaHome />, text: 'Trang chủ', path: '/home' },
    { icon: <FaCompass />, text: 'Khám phá', path: '/explore' },
    { icon: <FaHeart />, text: 'Yêu thích', path: '/favorites' },
    { icon: <FaUser />, text: 'Tài khoản', path: '/profile' },
    { icon: <FaCog />, text: 'Cài đặt', path: '/settings' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      setIsOpen(false);
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    }
  };

  return (
    <>
      <button 
        className="menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`menu-overlay ${isOpen ? 'active' : ''}`} 
           onClick={() => setIsOpen(false)} />

      <div className={`menu-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <div className="menu-logo">
            <h2>Logo</h2>
          </div>
        </div>

        <div className="menu-items">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="menu-item"
              onClick={() => {
                navigate(item.path);
                setIsOpen(false);
              }}
            >
              {item.icon}
              <span>{item.text}</span>
            </button>
          ))}
        </div>

        <div className="menu-footer">
          <button 
            className="menu-item logout"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Menu;