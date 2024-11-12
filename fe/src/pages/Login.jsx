import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaFacebookF, FaRegEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import './Login.css';
import Navbar from '../components/Navbar';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginUser(formData);
      console.log('Login response:', response);
      
      if (response.access_token) {
        localStorage.setItem('token', response.access_token);
        navigate('/home');
      } else {
        setError('Đăng nhập không thành công');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Email hoặc mật khẩu không chính xác');
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (data) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const responseData = await response.json();
    return responseData;
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <div className="login-background">
          <div className="login-shape"></div>
          <div className="login-shape"></div>
        </div>
        
        <div className="login-box">
          <div className="login-header">
            <h2>Chào mừng trở lại!</h2>
            <p>Vui lòng đăng nhập để tiếp tục</p>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-icon-wrapper">
                <FaRegEnvelope className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email của bạn"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-icon-wrapper">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mật khẩu"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Ghi nhớ đăng nhập
              </label>
              <a href="/forgot-password" className="forgot-password">
                Quên mật khẩu?
              </a>
            </div>

            <button 
              type="submit" 
              className={`login-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          <div className="divider">
            <span>hoặc</span>
          </div>

          <div className="social-login">
            <button className="social-button google">
              <FaGoogle />
              <span>Google</span>
            </button>
            <button className="social-button facebook">
              <FaFacebookF />
              <span>Facebook</span>
            </button>
          </div>

          <div className="signup-link">
            <p>Chưa có tài khoản? <a href="/register">Đăng ký ngay</a></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;