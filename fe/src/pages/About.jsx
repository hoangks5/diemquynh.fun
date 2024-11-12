import Navbar from '../components/Navbar';
import { FaRocket, FaUsers, FaLightbulb, FaHandshake } from 'react-icons/fa';
import './About.css';

const About = () => {
  const teamMembers = [
    {
      name: 'Nguyễn Văn A',
      role: 'Giám đốc điều hành',
      image: 'https://via.placeholder.com/150',
    },
    {
      name: 'Trần Thị B',
      role: 'Giám đốc sản phẩm',
      image: 'https://via.placeholder.com/150',
    },
    {
      name: 'Lê Văn C',
      role: 'Trưởng phòng kỹ thuật',
      image: 'https://via.placeholder.com/150',
    },
    {
      name: 'Phạm Thị D',
      role: 'Trưởng phòng marketing',
      image: 'https://via.placeholder.com/150',
    },
  ];

  const values = [
    {
      icon: <FaRocket />,
      title: 'Đổi mới',
      description: 'Luôn tiên phong trong việc áp dụng công nghệ mới'
    },
    {
      icon: <FaUsers />,
      title: 'Đồng đội',
      description: 'Xây dựng môi trường làm việc gắn kết và hỗ trợ'
    },
    {
      icon: <FaLightbulb />,
      title: 'Sáng tạo',
      description: 'Khuyến khích tư duy đột phá và ý tưởng mới'
    },
    {
      icon: <FaHandshake />,
      title: 'Tin cậy',
      description: 'Xây dựng niềm tin với khách hàng và đối tác'
    }
  ];

  return (
    <div className="about-layout">
      <Navbar />
      
      <main className="about-main">
        <section className="hero-section">
          <h1>Về Chúng Tôi</h1>
          <p className="subtitle">
            Chúng tôi là đội ngũ đam mê công nghệ, luôn nỗ lực mang đến những giải pháp 
            tốt nhất cho khách hàng
          </p>
        </section>

        <section className="values-section">
          <h2>Giá Trị Cốt Lõi</h2>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="team-section">
          <h2>Đội Ngũ Của Chúng Tôi</h2>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="member-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mission-section">
          <div className="mission-content">
            <h2>Sứ Mệnh</h2>
            <p>
              Chúng tôi cam kết mang đến những giải pháp công nghệ tiên tiến, 
              góp phần thúc đẩy sự phát triển của doanh nghiệp trong kỷ nguyên số.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About; 