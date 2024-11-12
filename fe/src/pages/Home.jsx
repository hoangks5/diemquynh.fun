import { useState, useEffect } from 'react';
import { FaUser, FaUsers, FaRobot, FaChartLine } from 'react-icons/fa';
import { 
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import Menu from '../components/Menu';
import Navbar from '../components/Navbar';
import './Home.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const Home = () => {
  const [userData, setUserData] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    accounts: [],
    groups: [],
    contents: []
  });

  // Dữ liệu mẫu cho biểu đồ hoạt động
  const activityData = [
    { name: 'T2', value: 4 },
    { name: 'T3', value: 3 },
    { name: 'T4', value: 6 },
    { name: 'T5', value: 8 },
    { name: 'T6', value: 7 },
    { name: 'T7', value: 5 },
    { name: 'CN', value: 4 }
  ];

  useEffect(() => {
    const groups = JSON.parse(localStorage.getItem('fbGroups') || '[]');
    
    const fetchData = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        
        // Lấy danh sách tài khoản Facebook
        const accountsResponse = await fetch(`${API_URL}/api/facebook-accounts/list`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const accountsData = await accountsResponse.json();
        
        // Lấy danh sách nội dung
        const contentsResponse = await fetch(`${API_URL}/api/contents/list`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const contentsData = await contentsResponse.json();

        if (accountsData.status === 'success' && contentsData.status === 'success') {
          setDashboardData({
            accounts: accountsData.accounts,
            groups: groups,
            contents: contentsData.contents
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const pieData = [
    { name: 'Tài khoản', value: dashboardData.accounts.length },
    { name: 'Nhóm', value: dashboardData.groups.length },
    { name: 'Nội dung AI', value: dashboardData.contents.length }
  ];

  return (
    <div className="home-layout">
      <Menu />
      <Navbar />
      
      <main className="home-main">
        <div className="dashboard-container">
          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <FaUser />
              </div>
              <div className="stat-content">
                <h3>Tài khoản Facebook</h3>
                <p className="stat-number">{dashboardData.accounts.length}</p>
                <p className="stat-description">tài khoản đang quản lý</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <FaUsers />
              </div>
              <div className="stat-content">
                <h3>Nhóm Facebook</h3>
                <p className="stat-number">{dashboardData.groups.length}</p>
                <p className="stat-description">nhóm đang theo dõi</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <FaRobot />
              </div>
              <div className="stat-content">
                <h3>Nội dung AI</h3>
                <p className="stat-number">{dashboardData.contents.length}</p>
                <p className="stat-description">mẫu đã được tạo</p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-section">
            {/* Main Chart */}
            <div className="chart-card">
              <h3>Hoạt động trong tuần</h3>
              <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Activities Card */}
            <div className="activities-card">
              <h3>Hoạt động gần đây</h3>
              <div className="activities-list">
                {dashboardData.contents.slice(0, 5).map(content => (
                  <div key={content.id} className="activity-item">
                    <div className="activity-info">
                      <span className="activity-icon"><FaRobot /></span>
                      <div>
                        <p className="activity-title">{content.title}</p>
                        <p className="activity-time">
                          {new Date(content.created_at).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    <span className="activity-type">Nội dung AI</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;