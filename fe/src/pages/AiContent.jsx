import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Menu from '../components/Menu';
import Navbar from '../components/Navbar';
import './AiContent.css';

const AiContent = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const [savedContents, setSavedContents] = useState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');
  const outputRef = useRef(null);

  // Fetch saved contents when component mounts
  useEffect(() => {
    fetchSavedContents();
  }, []);

  const fetchSavedContents = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/contents/list', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.status === 'success') {
        setSavedContents(data.contents);
      }
    } catch (error) {
      console.error('Error fetching saved contents:', error);
    }
  };

  const handleSave = async () => {
    if (!outputText || !saveTitle.trim()) return;

    try {
      const response = await fetch('http://localhost:8000/api/contents/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: saveTitle,
          content: outputText,
          user_email: '' // Backend sẽ lấy từ token
        })
      });

      const data = await response.json();
      if (data.status === 'success') {
        setShowSaveDialog(false);
        setSaveTitle('');
        fetchSavedContents();
      }
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  const handleDelete = async (contentId) => {
    if (!window.confirm('Bạn có chắc muốn xóa nội dung này?')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/contents/${contentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.status === 'success') {
        fetchSavedContents();
      }
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  const handleGenerateContent = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/gemini-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_prompt: `Tạo mô tả công việc cho vị trí: ${inputText}. 
                       Định dạng kết quả theo Markdown với các dấu * và **`,
          system_prompt: "Bạn là một chuyên gia trong việc tạo nội dung đăng tuyển việc làm"
        }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        setOutputText(data.response);
      } else {
        setOutputText('Có lỗi xảy ra: ' + data.message);
      }
    } catch (error) {
      setOutputText('Lỗi kết nối đến server: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = async () => {
    if (!outputText || !outputRef.current) return;
    
    try {
      const formattedText = outputRef.current.innerText;
      await navigator.clipboard.writeText(formattedText);
      
      setCopyStatus('Đã sao chép!');
      setTimeout(() => {
        setCopyStatus('');
      }, 2000);
    } catch (err) {
      setCopyStatus('Không thể sao chép!');
    }
  };

  return (
    <div className="ai-content-layout">
      <Menu />
      <Navbar />
      
      <main className="ai-content-main">
        <div className="ai-content-container">
          <div className="content-grid">
            {/* Left Panel - Input & Output */}
            <div className="main-panel">
              <h1 className="ai-chat-header">AI Content Generator</h1>
              
              {/* Input Section */}
              <div className="input-section">
                <div className="input-wrapper">
                  <textarea
                    className="ai-chat-input"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ví dụ: Giám đốc Marketing, Product Manager..."
                    rows={3}
                  />
                </div>
                <button 
                  className={`ai-send-button ${isLoading ? 'loading' : ''}`}
                  onClick={handleGenerateContent}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="button-loading-content">
                      <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      <span>Đang tạo mô tả...</span>
                    </div>
                  ) : (
                    <>
                      <i className="fas fa-magic"></i>
                      <span>Tạo mô tả công việc</span>
                    </>
                  )}
                </button>
              </div>

              {/* Output Section */}
              <div className="output-section">
                <div className="output-header">
                  <div className="output-actions">
                    {outputText && !isLoading && (
                      <>
                        <button 
                          className="action-button copy-button"
                          onClick={handleCopyText}
                        >
                          <i className="fas fa-copy"></i>
                          <span>{copyStatus || 'Sao chép'}</span>
                        </button>
                        <button 
                          className="action-button save-button"
                          onClick={() => setShowSaveDialog(true)}
                        >
                          <i className="fas fa-save"></i>
                          <span>Lưu</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="ai-output" ref={outputRef}>
                  {isLoading ? (
                    <div className="output-loading">
                      <div className="typing-animation">
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                      </div>
                      <div className="loading-text">AI đang soạn mô tả công việc...</div>
                    </div>
                  ) : outputText ? (
                    <ReactMarkdown>{outputText}</ReactMarkdown>
                  ) : (
                    <div className="empty-output">
                      <i className="fas fa-file-alt"></i>
                      <p>Kết quả sẽ hiển thị ở đây...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Panel - Saved Contents */}
            <div className="saved-panel">
              <div className="saved-header">
                <h3>Nội dung đã lưu</h3>
                <span className="saved-count">{savedContents.length} mục</span>
              </div>
              
              <div className="saved-contents-list">
                {savedContents.map((content) => (
                  <div key={content.id} className="saved-content-item">
                    <div className="saved-content-info">
                      <h4>{content.title}</h4>
                      <span className="saved-date">
                        <i className="far fa-calendar-alt"></i>
                        {new Date(content.created_at).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className="saved-content-actions">
                      <button 
                        onClick={() => setOutputText(content.content)}
                        className="action-button load-button"
                        title="Tải lại"
                      >
                        <i className="fas fa-sync-alt"></i>
                        <span>Tải lại</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(content.id)}
                        className="action-button delete-button"
                        title="Xóa"
                      >
                        <i className="fas fa-trash-alt"></i>
                        <span>Xóa</span>
                      </button>
                    </div>
                  </div>
                ))}
                {savedContents.length === 0 && (
                  <div className="empty-saved">
                    <i className="fas fa-folder-open"></i>
                    <p>Chưa có nội dung nào được lưu</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="save-dialog-overlay" onClick={() => setShowSaveDialog(false)}>
          <div className="save-dialog" onClick={e => e.stopPropagation()}>
            <h3>Lưu nội dung</h3>
            <input
              type="text"
              value={saveTitle}
              onChange={(e) => setSaveTitle(e.target.value)}
              placeholder="Nhập tiêu đề..."
              autoFocus
            />
            <div className="save-dialog-actions">
              <button onClick={handleSave} className="primary-button">
                <i className="fas fa-save"></i> Lưu
              </button>
              <button onClick={() => setShowSaveDialog(false)} className="secondary-button">
                <i className="fas fa-times"></i> Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiContent; 