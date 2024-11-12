import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaHome, 
  FaUser, 
  FaUsers, 
  FaRobot, 
  FaComments, 
  FaSeedling,
  FaBrain,
  FaBars,
  FaTimes,
  FaSignOutAlt
} from 'react-icons/fa';
import './Menu.css';

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { icon: <FaHome />, text: 'Trang chủ', path: '/home' },
    { icon: <FaUser />, text: 'Tài khoản', path: '/profile' },
    { icon: <FaUsers />, text: 'Group', path: '/groups' },
    { icon: <FaRobot />, text: 'Auto Post', path: '/auto-post' },
    { icon: <FaComments />, text: 'Auto Comment', path: '/auto-comment' },
    { icon: <FaSeedling />, text: 'Seeding', path: '/seeding' },
    { icon: <FaBrain />, text: 'AI Content', path: '/ai-content' },
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