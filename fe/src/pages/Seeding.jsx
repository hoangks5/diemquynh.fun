import { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaTrash } from 'react-icons/fa';
import Menu from '../components/Menu';
import Navbar from '../components/Navbar';
import { useToast } from '../contexts/ToastContext';
import './Seeding.css';

const Seeding = () => {
  const [accounts, setAccounts] = useState([]);
  const [savedContents, setSavedContents] = useState([]);
  const [postUrl, setPostUrl] = useState('');
  const [selectedContent, setSelectedContent] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedingInterval, setSeedingInterval] = useState(5);
  const [currentAccountIndex, setCurrentAccountIndex] = useState(0);
  const [actions, setActions] = useState({
    like: true,
    comment: true
  });
  const { showToast } = useToast();

  useEffect(() => {
    // Lấy accounts từ localStorage
    const savedAccounts = localStorage.getItem('fbAccounts');
    if (savedAccounts) {
      setAccounts(JSON.parse(savedAccounts));
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

  const extractPostId = (url) => {
    const matches = url.match(/(?:posts|videos|photos)\/(\d+)/);
    return matches ? matches[1] : null;
  };

  const handleStartSeeding = async () => {
    if (!postUrl || (!actions.like && !actions.comment) || (actions.comment && !selectedContent)) {
      showToast('Vui lòng điền đầy đủ thông tin', 'error');
      return;
    }

    const postId = extractPostId(postUrl);
    if (!postId) {
      showToast('URL bài viết không hợp lệ', 'error');
      return;
    }

    setIsSeeding(true);
    setCurrentAccountIndex(0);

    try {
      while (isSeeding && currentAccountIndex < accounts.length) {
        const account = accounts[currentAccountIndex];
        
        try {
          // Thực hiện like nếu được chọn
          if (actions.like) {
            const likeResponse = await fetch(`https://graph.facebook.com/${postId}/likes`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                access_token: account.token
              })
            });

            const likeData = await likeResponse.json();
            if (likeData.error) {
              throw new Error(`Lỗi khi like: ${likeData.error.message}`);
            }
          }

          // Thực hiện comment nếu được chọn
          if (actions.comment) {
            const content = savedContents.find(c => c.id === parseInt(selectedContent));
            const commentResponse = await fetch(`https://graph.facebook.com/${postId}/comments`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                message: content.content,
                access_token: account.token
              })
            });

            const commentData = await commentResponse.json();
            if (commentData.error) {
              throw new Error(`Lỗi khi comment: ${commentData.error.message}`);
            }
          }

          showToast(`Seeding thành công với tài khoản ${account.name}`, 'success');
        } catch (error) {
          showToast(`Lỗi với tài khoản ${account.name}: ${error.message}`, 'error');
        }

        // Chờ theo khoảng thời gian đã cài đặt
        await new Promise(resolve => setTimeout(resolve, seedingInterval * 60 * 1000));
        
        setCurrentAccountIndex(prev => prev + 1);
      }
    } finally {
      setIsSeeding(false);
      setCurrentAccountIndex(0);
    }
  };

  const handleStopSeeding = () => {
    setIsSeeding(false);
  };

  return (
    <div className="home-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Menu />
      <Navbar />
      
      <main className="home-main" style={{ flex: 1 }}>
        <div className="seeding-container">
          <h1>Seeding tự động</h1>

          <div className="seeding-config-section">
            {/* URL bài viết */}
            <div className="config-group">
              <h3>URL bài viết cần seeding</h3>
              <input
                type="text"
                value={postUrl}
                onChange={(e) => setPostUrl(e.target.value)}
                placeholder="Nhập URL bài viết Facebook"
                className="post-input"
              />
            </div>

            {/* Chọn hành động */}
            <div className="config-group">
              <h3>Chọn hành động</h3>
              <div className="actions-group">
                <label className="action-checkbox">
                  <input
                    type="checkbox"
                    checked={actions.like}
                    onChange={(e) => setActions(prev => ({...prev, like: e.target.checked}))}
                  />
                  <span>Like</span>
                </label>
                <label className="action-checkbox">
                  <input
                    type="checkbox"
                    checked={actions.comment}
                    onChange={(e) => setActions(prev => ({...prev, comment: e.target.checked}))}
                  />
                  <span>Comment</span>
                </label>
              </div>
            </div>

            {/* Chọn nội dung comment */}
            {actions.comment && (
              <div className="config-group">
                <h3>Chọn nội dung comment</h3>
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
            )}

            {/* Cài đặt thời gian */}
            <div className="config-group">
              <h3>Thời gian giữa các lần seeding (phút)</h3>
              <input
                type="number"
                min="1"
                value={seedingInterval}
                onChange={(e) => setSeedingInterval(e.target.value)}
              />
            </div>

            {/* Danh sách tài khoản */}
            <div className="config-group">
              <h3>Tài khoản sẽ sử dụng ({accounts.length})</h3>
              <div className="accounts-preview">
                {accounts.map((account, index) => (
                  <div 
                    key={account.id} 
                    className={`account-preview ${index === currentAccountIndex && isSeeding ? 'active' : ''}`}
                  >
                    <span className="account-name">{account.name}</span>
                    {index === currentAccountIndex && isSeeding && (
                      <span className="seeding-badge">Đang seeding</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Nút điều khiển */}
            <div className="seeding-controls">
              {!isSeeding ? (
                <button
                  className="start-button"
                  onClick={handleStartSeeding}
                >
                  <FaPlay /> Bắt đầu seeding
                </button>
              ) : (
                <button
                  className="stop-button"
                  onClick={handleStopSeeding}
                >
                  <FaPause /> Dừng seeding
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Seeding; 