import Navbar from '../components/Navbar';
import { FaRocket, FaUsers, FaLightbulb, FaHandshake } from 'react-icons/fa';
import './About.css';

const About = () => {
  const teamMembers = [
    {
      name: 'Nguyễn Văn A',
      role: 'Giám đốc điều hành',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      name: 'Trần Thị B',
      role: 'Giám đốc sản phẩm',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      name: 'Lê Văn C',
      role: 'Trưởng phòng kỹ thuật',
      image: 'https://randomuser.me/api/portraits/men/55.jpg',
    },
    {
      name: 'Phạm Thị D',
      role: 'Trưởng phòng marketing',
      image: 'https://randomuser.me/api/portraits/women/67.jpg',
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

  const feedbacks = [
    {
      content: "Giải pháp của công ty đã giúp chúng tôi tăng hiệu suất làm việc lên 200%. Thật sự ấn tượng với chất lượng sản phẩm và dịch vụ hỗ trợ.",
      author: "Nguyễn Thị Minh",
      company: "CEO, Tech Solutions",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg"
    },
    {
      content: "Đội ngũ kỹ thuật chuyên nghiệp và tận tâm. Họ không chỉ cung cấp giải pháp mà còn đồng hành cùng chúng tôi trong suốt quá trình triển khai.",
      author: "Trần Văn Hùng",
      company: "CTO, Innovation Corp",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg"
    },
    {
      content: "Sản phẩm có giao diện người dùng tuyệt vời, dễ sử dụng và đáp ứng đầy đủ nhu cầu của doanh nghiệp chúng tôi.",
      author: "Lê Thị Hoa",
      company: "Giám đốc Marketing, Digital World",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg"
    },
    {
      content: "Tôi đặc biệt ấn tượng với khả năng tùy biến sản phẩm theo yêu cầu riêng. Đội ngũ phát triển rất linh hoạt và sáng tạo.",
      author: "Phạm Minh Đức",
      company: "Founder, StartUp Hub",
      avatar: "https://randomuser.me/api/portraits/men/4.jpg"
    },
    {
      content: "Hệ thống hoạt động ổn định và bảo mật cao. Chúng tôi hoàn toàn yên tâm khi sử dụng dịch vụ của công ty.",
      author: "Hoàng Thị Lan",
      company: "CISO, Security First",
      avatar: "https://randomuser.me/api/portraits/women/5.jpg"
    },
    {
      content: "Dịch vụ khách hàng xuất sắc, phản hồi nhanh chóng và luôn sẵn sàng hỗ trợ 24/7.",
      author: "Vũ Anh Tuấn",
      company: "COO, Global Services",
      avatar: "https://randomuser.me/api/portraits/men/6.jpg"
    },
    {
      content: "Giải pháp của công ty đã giúp chúng tôi tiết kiệm đáng kể chi phí vận hành và tối ưu hóa quy trình làm việc.",
      author: "Đặng Thu Thảo",
      company: "CFO, Finance Plus",
      avatar: "https://randomuser.me/api/portraits/women/7.jpg"
    },
    {
      content: "Sản phẩm có khả năng mở rộng tuyệt vời, dễ dàng phát triển theo quy mô doanh nghiệp.",
      author: "Ngô Văn Nam",
      company: "CTO, Scale Up",
      avatar: "https://randomuser.me/api/portraits/men/8.jpg"
    },
    {
      content: "Đội ngũ phát triển luôn cập nhật những công nghệ mới nhất, tạo ra sản phẩm hiện đại và cạnh tranh.",
      author: "Trịnh Công Sơn",
      company: "Tech Lead, Future Tech",
      avatar: "https://randomuser.me/api/portraits/men/9.jpg"
    },
    {
      content: "Chúng tôi đã thử nhiều giải pháp khác nhau, nhưng sản phẩm của công ty là lựa chọn tốt nhất về cả chất lượng và giá cả.",
      author: "Mai Thanh Hà",
      company: "Giám đốc điều hành, Best Choice",
      avatar: "https://randomuser.me/api/portraits/women/10.jpg"
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

        <section className="feedback-section">
          <h2>Khách Hàng Nói Gì Về Chúng Tôi</h2>
          <div className="feedback-grid">
            {feedbacks.map((feedback, index) => (
              <div key={index} className="feedback-card">
                <div className="feedback-avatar">
                  <img src={feedback.avatar} alt={feedback.author} />
                </div>
                <p className="feedback-content">{feedback.content}</p>
                <div className="feedback-info">
                  <p className="feedback-author">{feedback.author}</p>
                  <p className="feedback-company">{feedback.company}</p>
                </div>
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