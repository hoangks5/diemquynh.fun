import { useState, useEffect } from 'react';
import Menu from '../components/Menu';
import Navbar from '../components/Navbar';
import { useToast } from '../contexts/ToastContext';
import './AutoPost.css';

const AutoPost = () => {
  const [accounts, setAccounts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [savedContents, setSavedContents] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedContent, setSelectedContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [postInterval, setPostInterval] = useState(5); // Mặc định 5 phút
  const { showToast } = useToast();

  // Lấy dữ liệu khi component mount
  useEffect(() => {
    // Lấy accounts từ localStorage
    const savedAccounts = localStorage.getItem('fbAccounts');
    if (savedAccounts) {
      setAccounts(JSON.parse(savedAccounts));
    }

    // Lấy groups từ localStorage
    const savedGroups = localStorage.getItem('fbGroups');
    if (savedGroups) {
      setGroups(JSON.parse(savedGroups));
    }

    // Lấy saved contents từ API
    fetchSavedContents();
  }, []);

  const fetchSavedContents = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/contents/list`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.status === 'success') {
        setSavedContents(data.contents);
      }
    } catch (error) {
      console.error('Lỗi khi lấy nội dung đã lưu:', error);
      showToast('Không thể lấy nội dung đã lưu', 'error');
    }
  };

  const handleGroupSelect = (groupId) => {
    setSelectedGroups(prev => {
      if (prev.includes(groupId)) {
        return prev.filter(id => id !== groupId);
      } else {
        return [...prev, groupId];
      }
    });
  };

  const handleStartPosting = async () => {
    if (!selectedAccount || selectedGroups.length === 0 || !selectedContent) {
      showToast('Vui lòng chọn đầy đủ thông tin', 'error');
      return;
    }

    setIsPosting(true);
    const account = accounts.find(acc => acc.id === parseInt(selectedAccount));
    const content = savedContents.find(c => c.id === parseInt(selectedContent));

    try {
      for (const groupId of selectedGroups) {
        const group = groups.find(g => g.id === parseInt(groupId));
        
        // Gọi Facebook API để đăng bài
        const response = await fetch(`https://graph.facebook.com/${group.groupId}/feed`, {
          method: 'POST',
          body: JSON.stringify({
            message: content.content,
            access_token: account.token
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        
        if (data.error) {
          throw new Error(`Lỗi khi đăng bài vào nhóm ${group.name}: ${data.error.message}`);
        }

        showToast(`Đã đăng bài thành công vào nhóm ${group.name}`, 'success');
        
        // Đợi theo khoảng thời gian đã cài đặt
        await new Promise(resolve => setTimeout(resolve, postInterval * 60 * 1000));
      }
    } catch (error) {
      console.error('Lỗi khi đăng bài:', error);
      showToast(error.message, 'error');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="home-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Menu />
      <Navbar />
      
      <main className="home-main" style={{ flex: 1 }}>
        <div className="auto-post-container">
          <h1>Tự động đăng bài</h1>

          <div className="post-config-section">
            {/* Chọn tài khoản */}
            <div className="config-group">
              <h3>Chọn tài khoản đăng bài</h3>
              <select 
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
              >
                <option value="">-- Chọn tài khoản --</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Chọn nhóm */}
            <div className="config-group">
              <h3>Chọn nhóm để đăng bài</h3>
              <div className="groups-checkbox-list">
                {groups.map(group => (
                  <label key={group.id} className="group-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedGroups.includes(group.id)}
                      onChange={() => handleGroupSelect(group.id)}
                    />
                    {group.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Chọn nội dung */}
            <div className="config-group">
              <h3>Chọn nội dung đăng</h3>
              <select
                value={selectedContent}
                onChange={(e) => setSelectedContent(e.target.value)}
              >
                <option value="">-- Chọn nội dung --</option>
                {savedContents.map(content => (
                  <option key={content.id} value={content.id}>
                    {content.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Cài đặt thời gian */}
            <div className="config-group">
              <h3>Thời gian giữa các lần đăng (phút)</h3>
              <input
                type="number"
                min="1"
                value={postInterval}
                onChange={(e) => setPostInterval(e.target.value)}
              />
            </div>

            {/* Nút bắt đầu */}
            <button
              className={`start-posting-button ${isPosting ? 'posting' : ''}`}
              onClick={handleStartPosting}
              disabled={isPosting}
            >
              {isPosting ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Đang đăng bài...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-play"></i>
                  <span>Bắt đầu đăng bài</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AutoPost; 