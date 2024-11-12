import { useState } from 'react';
import Navbar from '../components/Navbar';
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa'; // Thêm icons
import './Pricing.css';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Basic',
      icon: <FaRegStar size={40} />,
      color: '#4CAF50',
      monthlyPrice: 199000,
      yearlyPrice: 1990000,
      features: [
        'Tính năng cơ bản',
        'Hỗ trợ qua email',
        'Giới hạn 10GB lưu trữ',
        'Tối đa 2 người dùng'
      ]
    },
    {
      name: 'Pro',
      icon: <FaStarHalfAlt size={40} />,
      color: '#2196F3',
      popular: true,
      monthlyPrice: 399000,
      yearlyPrice: 3990000,
      features: [
        'Tất cả tính năng Basic',
        'Hỗ trợ ưu tiên',
        'Giới hạn 50GB lưu trữ',
        'Tối đa 5 người dùng',
        'API Access'
      ]
    },
    {
      name: 'Premium',
      icon: <FaStar size={40} />,
      color: '#9C27B0',
      monthlyPrice: 990000,
      yearlyPrice: 9900000,
      features: [
        'Tất cả tính năng Pro',
        'Hỗ trợ 24/7',
        'Không giới hạn lưu trữ',
        'Không giới hạn người dùng',
        'API Access',
        'Tùy chỉnh theo yêu cầu'
      ]
    }
  ];

  return (
    <div className="pricing-layout">
      <Navbar />
      
      <main className="pricing-main">
        <div className="pricing-toggle">
          <button 
            className={`toggle-btn ${!isAnnual ? 'active' : ''}`}
            onClick={() => setIsAnnual(false)}
          >
            Theo tháng
          </button>
          <button 
            className={`toggle-btn ${isAnnual ? 'active' : ''}`}
            onClick={() => setIsAnnual(true)}
          >
            Theo năm
          </button>
        </div>

        <div className="pricing-cards">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`pricing-card ${plan.popular ? 'popular' : ''}`}
              style={{'--card-color': plan.color}}
            >
              {plan.popular && <div className="popular-badge">Phổ biến nhất</div>}
              <div className="card-icon">{plan.icon}</div>
              <h2>{plan.name}</h2>
              <div className="price">
                <span className="amount">
                  {new Intl.NumberFormat('vi-VN').format(
                    isAnnual ? plan.yearlyPrice : plan.monthlyPrice
                  )}
                </span>
                <span className="currency">VNĐ</span>
                <span className="period">/{isAnnual ? 'năm' : 'tháng'}</span>
              </div>
              <ul className="features">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <button className="subscribe-btn">Đăng ký ngay</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Pricing;