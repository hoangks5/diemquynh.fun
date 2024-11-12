import Navbar from '../components/Navbar';
import { 
  FaRobot, 
  FaShieldAlt, 
  FaBolt, 
  FaChartLine,
  FaCode,
  FaDatabase,
  FaCloud,
  FaMobile,
  FaCog,
  FaUserFriends,
  FaImage,
  FaHeadset
} from 'react-icons/fa';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: <FaRobot />,
      title: 'AI Tạo Nội Dung Thông Minh',
      description: 'Công nghệ AI tiên tiến tự động tạo bài đăng tuyển dụng đa dạng, tối ưu SEO và từ khóa theo ngành nghề'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Quản Lý Đa Tài Khoản An Toàn',
      description: 'Hệ thống bảo mật cao cấp, tự động luân chuyển IP, chống checkpoint và cảnh báo sớm rủi ro cho nhiều tài khoản'
    },
    {
      icon: <FaBolt />,
      title: 'Auto Đăng Bài Đa Nền Tảng',
      description: 'Tự động đăng bài theo lịch trình thông minh trên Facebook, LinkedIn, Groups với nội dung được tối ưu cho từng nền tảng'
    },
    {
      icon: <FaChartLine />,
      title: 'Phân Tích & Báo Cáo Chuyên Sâu',
      description: 'Dashboard thống kê chi tiết về tương tác, chuyển đổi và ROI theo thời gian thực với biểu đồ trực quan'
    }
  ];

  const advancedFeatures = [
    {
      icon: <FaCode />,
      title: 'Auto Tương Tác Thông Minh',
      description: 'Tự động like, comment, inbox với nội dung được cá nhân hóa theo từng đối tượng. Hỗ trợ spin content và tránh spam'
    },
    {
      icon: <FaDatabase />,
      title: 'CRM Ứng Viên Tích Hợp',
      description: 'Quản lý toàn diện thông tin ứng viên, lịch sử tương tác, gắn tag tự động và scoring theo tiêu chí tùy chỉnh'
    },
    {
      icon: <FaCloud />,
      title: 'Auto Seeding Chuyên Nghiệp',
      description: 'Hệ thống tài khoản ảo chất lượng cao với lịch sử hoạt động thực, tự động tương tác theo kịch bản và giờ vàng'
    },
    {
      icon: <FaMobile />,
      title: 'Bảo Mật Đa Lớp',
      description: 'Hệ thống proxy riêng, VPN premium, 2FA và cơ chế phân quyền chi tiết cho team work'
    },
    {
      icon: <FaCog />,
      title: 'Tùy Biến Kịch Bản',
      description: 'Xây dựng và lưu trữ các kịch bản marketing tự động với điều kiện và quy tắc linh hoạt theo nhu cầu'
    },
    {
      icon: <FaUserFriends />,
      title: 'Quản Lý Groups & Fanpage',
      description: 'Theo dõi và quản lý tập trung các nhóm tuyển dụng, phân loại theo hiệu quả và tự động tham gia nhóm mới'
    },
    {
      icon: <FaImage />,
      title: 'Thư Viện Media Đa Dạng',
      description: 'Kho ảnh, video mẫu chuyên nghiệp và công cụ chỉnh sửa nhanh với template theo ngành nghề'
    },
    {
      icon: <FaHeadset />,
      title: 'Hỗ Trợ 24/7',
      description: 'Đội ngũ chuyên gia hỗ trợ kỹ thuật và tư vấn chiến lược marketing 24/7 qua chat, call và remote'
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
              <div className="tech-item">Mutil Account</div>
              <div className="tech-item">Auto Post</div>
              <div className="tech-item">Auto Comment</div>
              <div className="tech-item">Auto Seeding</div>
              <div className="tech-item">AI Generate Content</div>
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