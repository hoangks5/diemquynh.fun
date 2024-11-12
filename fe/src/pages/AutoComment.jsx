import { useState, useEffect } from 'react';
import Menu from '../components/Menu';
import Navbar from '../components/Navbar';
import { useToast } from '../contexts/ToastContext';
import './AutoComment.css';

const AutoComment = () => {
  const [accounts, setAccounts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [savedContents, setSavedContents] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [selectedContent, setSelectedContent] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentInterval, setCommentInterval] = useState(5); // Mặc định 5 phút
  const [postUrl, setPostUrl] = useState('');
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

  const handleAddPost = () => {
    if (!postUrl.trim()) {
      showToast('Vui lòng nhập URL bài viết', 'error');
      return;
    }

    // Kiểm tra xem URL đã tồn tại chưa
    if (posts.some(post => post.url === postUrl)) {
      showToast('Bài viết này đã được thêm', 'error');
      return;
    }

    const newPost = {
      id: Date.now(),
      url: postUrl,
      addedAt: new Date().toISOString()
    };

    setPosts([...posts, newPost]);
    setPostUrl('');
    showToast('Đã thêm bài viết thành công', 'success');
  };

  const handlePostSelect = (postId) => {
    setSelectedPosts(prev => {
      if (prev.includes(postId)) {
        return prev.filter(id => id !== postId);
      } else {
        return [...prev, postId];
      }
    });
  };

  const handleDeletePost = (id) => {
    setPosts(posts.filter(post => post.id !== id));
    setSelectedPosts(selectedPosts.filter(postId => postId !== id));
  };

  const extractPostId = (url) => {
    // Hàm này sẽ trích xuất post ID từ Facebook URL
    // Đây là một ví dụ đơn giản, bạn có thể cần điều chỉnh theo định dạng URL thực tế
    const matches = url.match(/(?:posts|videos|photos)\/(\d+)/);
    return matches ? matches[1] : null;
  };

  const handleStartCommenting = async () => {
    if (!selectedAccount || selectedPosts.length === 0 || !selectedContent) {
      showToast('Vui lòng chọn đầy đủ thông tin', 'error');
      return;
    }

    setIsCommenting(true);
    const account = accounts.find(acc => acc.id === parseInt(selectedAccount));
    const content = savedContents.find(c => c.id === parseInt(selectedContent));

    try {
      for (const postId of selectedPosts) {
        const post = posts.find(p => p.id === postId);
        const fbPostId = extractPostId(post.url);
        
        if (!fbPostId) {
          throw new Error(`Không thể xác định ID của bài viết: ${post.url}`);
        }

        // Gọi Facebook API để comment
        const response = await fetch(`https://graph.facebook.com/${fbPostId}/comments`, {
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
          throw new Error(`Lỗi khi comment vào bài viết ${post.url}: ${data.error.message}`);
        }

        showToast(`Đã comment thành công vào bài viết`, 'success');
        
        // Đợi theo khoảng thời gian đã cài đặt
        await new Promise(resolve => setTimeout(resolve, commentInterval * 60 * 1000));
      }
    } catch (error) {
      console.error('Lỗi khi comment:', error);
      showToast(error.message, 'error');
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <div className="home-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Menu />
      <Navbar />
      
      <main className="home-main" style={{ flex: 1 }}>
        <div className="auto-comment-container">
          <h1>Tự động bình luận</h1>

          <div className="comment-config-section">
            {/* Chọn tài khoản */}
            <div className="config-group">
              <h3>Chọn tài khoản comment</h3>
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

            {/* Thêm bài viết */}
            <div className="config-group">
              <h3>Thêm bài viết cần comment</h3>
              <div className="add-post-form">
                <input
                  type="text"
                  value={postUrl}
                  onChange={(e) => setPostUrl(e.target.value)}
                  placeholder="Nhập URL bài viết Facebook"
                  className="post-input"
                />
                <button 
                  onClick={handleAddPost}
                  className="add-button"
                >
                  <i className="fas fa-plus"></i>
                  Thêm bài viết
                </button>
              </div>

              {/* Danh sách bài viết đã thêm */}
              <div className="posts-list">
                {posts.map(post => (
                  <div key={post.id} className="post-item">
                    <label className="post-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedPosts.includes(post.id)}
                        onChange={() => handlePostSelect(post.id)}
                      />
                      <span className="post-url">{post.url}</span>
                    </label>
                    <button 
                      onClick={() => handleDeletePost(post.id)}
                      className="delete-button"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Chọn nội dung */}
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

            {/* Cài đặt thời gian */}
            <div className="config-group">
              <h3>Thời gian giữa các lần comment (phút)</h3>
              <input
                type="number"
                min="1"
                value={commentInterval}
                onChange={(e) => setCommentInterval(e.target.value)}
              />
            </div>

            {/* Nút bắt đầu */}
            <button
              className={`start-commenting-button ${isCommenting ? 'commenting' : ''}`}
              onClick={handleStartCommenting}
              disabled={isCommenting}
            >
              {isCommenting ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Đang comment...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-comments"></i>
                  <span>Bắt đầu comment</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AutoComment; 