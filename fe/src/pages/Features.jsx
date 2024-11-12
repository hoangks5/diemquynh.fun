import Navbar from '../components/Navbar';
import { 
  FaRobot, 
  FaShieldAlt, 
  FaBolt, 
  FaChartLine,
  FaCode,
  FaDatabase,
  FaCloud,
  FaMobile
} from 'react-icons/fa';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: <FaRobot />,
      title: 'AI Thông Minh',
      description: 'Tích hợp các thuật toán AI tiên tiến giúp tự động hóa và tối ưu quy trình làm việc'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Bảo Mật Tối Ưu',
      description: 'Hệ thống bảo mật đa lớp với mã hóa end-to-end và xác thực hai yếu tố'
    },
    {
      icon: <FaBolt />,
      title: 'Hiệu Suất Cao',
      description: 'Tối ưu hóa hiệu suất với thời gian phản hồi nhanh và xử lý đa luồng'
    },
    {
      icon: <FaChartLine />,
      title: 'Phân Tích Dữ Liệu',
      description: 'Công cụ phân tích dữ liệu chuyên sâu với báo cáo chi tiết và trực quan'
    }
  ];

  const advancedFeatures = [
    {
      icon: <FaCode />,
      title: 'API Tích Hợp',
      description: 'API RESTful linh hoạt cho phép tích hợp dễ dàng với các hệ thống khác'
    },
    {
      icon: <FaDatabase />,
      title: 'Quản Lý Dữ Liệu',
      description: 'Hệ thống quản lý dữ liệu thông minh với backup tự động và phục hồi nhanh chóng'
    },
    {
      icon: <FaCloud />,
      title: 'Cloud Native',
      description: 'Kiến trúc cloud native đảm bảo khả năng mở rộng và độ tin cậy cao'
    },
    {
      icon: <FaMobile />,
      title: 'Đa Nền Tảng',
      description: 'Hỗ trợ đầy đủ trên các thiết bị và nền tảng khác nhau'
    }
  ];

  return (
    <div className="features-layout">
      <Navbar />
      
      <main className="features-main">
        <section className="features-hero">
          <h1>Tính Năng Nổi Bật</h1>
          <p className="hero-subtitle">
            Khám phá các tính năng mạnh mẽ giúp doanh nghiệp của bạn phát triển
          </p>
        </section>

        <section className="features-grid-section">
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="feature-showcase">
          <div className="showcase-content">
            <h2>Nền Tảng Công Nghệ Hiện Đại</h2>
            <p>
              Sử dụng công nghệ tiên tiến nhất để xây dựng giải pháp tối ưu cho doanh nghiệp của bạn
            </p>
            <div className="tech-stack">
              <div className="tech-item">React</div>
              <div className="tech-item">Node.js</div>
              <div className="tech-item">MongoDB</div>
              <div className="tech-item">Docker</div>
            </div>
          </div>
        </section>

        <section className="advanced-features-section">
          <h2>Tính Năng Nâng Cao</h2>
          <div className="advanced-features-grid">
            {advancedFeatures.map((feature, index) => (
              <div key={index} className="advanced-feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Features; 