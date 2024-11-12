import { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import './Profile.css';
import Navbar from '../components/Navbar';
import Menu from '../components/Menu';
import { useToast } from '../contexts/ToastContext';

const Profile = () => {
  const [accounts, setAccounts] = useState([]);
  const [newToken, setNewToken] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editToken, setEditToken] = useState('');
  const { showToast } = useToast();

  // Load danh sách tài khoản từ API khi component mount
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await fetch(`${API_URL}/api/facebook-accounts/list`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Không thể tải danh sách tài khoản');
        }

        const data = await response.json();
        if (data.status === 'success') {
          setAccounts(data.accounts);
        }
      } catch (error) {
        showToast('Lỗi khi tải danh sách tài khoản', 'error');
      }
    };

    fetchAccounts();
  }, []);

  // Thêm tài khoản mới
  const handleAddAccount = async () => {
    try {
      // Kiểm tra token hợp lệ bằng cách gọi Facebook API
      const response = await fetch(`https://graph.facebook.com/me?access_token=${newToken}`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error('Token không hợp lệ');
      }

      const newAccount = {
        name: data.name,
        userId: data.id,
        token: newToken,
        addedAt: new Date().toISOString()
      };

      // Lưu vào database thông qua API
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const saveResponse = await fetch(`${API_URL}/api/facebook-accounts/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newAccount)
      });

      if (!saveResponse.ok) {
        throw new Error('Không thể lưu tài khoản');
      }

      setAccounts([...accounts, { ...newAccount, id: Date.now() }]);
      setNewToken('');
      showToast('Thêm tài khoản thành công', 'success');
    } catch (error) {
      showToast(error.message || 'Token không hợp lệ hoặc đã hết hạn', 'error');
    }
  };

  // Xóa tài khoản
  const handleDeleteAccount = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa tài khoản này?')) {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await fetch(`${API_URL}/api/facebook-accounts/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Không thể xóa tài khoản');
        }

        const data = await response.json();
        if (data.status === 'success') {
          setAccounts(accounts.filter(account => account.id !== id));
          showToast('Đã xóa tài khoản thành công', 'success');
        }
      } catch (error) {
        showToast('Lỗi khi xóa tài khoản', 'error');
      }
    }
  };

  // Cập nhật token
  const handleUpdateToken = async (id) => {
    try {
      // Kiểm tra token mới
      const response = await fetch(`https://graph.facebook.com/me?access_token=${editToken}`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error('Token không hợp lệ');
      }

      setAccounts(accounts.map(account => {
        if (account.id === id) {
          return {
            ...account,
            token: editToken,
            name: data.name,
            userId: data.id,
            updatedAt: new Date().toISOString()
          };
        }
        return account;
      }));
      
      setEditingId(null);
      setEditToken('');
      showToast('Cập nhật token thành công', 'success');
    } catch (error) {
      showToast('Token không hợp lệ hoặc đã hết hạn', 'error');
    }
  };

  return (
    <div className="home-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Menu />
      <Navbar />
      
      <main className="home-main" style={{ flex: 1 }}>
        <div className="home-content">
          <div className="profile-container">
            {/* Form thêm tài khoản mới */}
            <div className="add-account-form">
              <input
                type="text"
                value={newToken}
                onChange={(e) => setNewToken(e.target.value)}
                placeholder="Nhập Access Token mới"
                className="token-input"
              />
              <button 
                onClick={handleAddAccount}
                className="add-button"
              >
                <FaPlus /> Thêm tài khoản
              </button>
            </div>

            {/* Danh sách tài khoản */}
            <div className="accounts-list">
              {accounts.map(account => (
                <div key={account.id} className="account-card">
                  <div className="account-info">
                    <h3>{account.name}</h3>
                    <p>ID: {account.userId}</p>
                    <p>Ngày thêm: {new Date(account.addedAt).toLocaleDateString()}</p>
                    {account.updatedAt && (
                      <p>Cập nhật lần cuối: {new Date(account.updatedAt).toLocaleDateString()}</p>
                    )}
                  </div>

                  {editingId === account.id ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        value={editToken}
                        onChange={(e) => setEditToken(e.target.value)}
                        placeholder="Nhập token mới"
                        className="token-input"
                      />
                      <div className="edit-buttons">
                        <button 
                          onClick={() => handleUpdateToken(account.id)}
                          className="save-button"
                        >
                          Lưu
                        </button>
                        <button 
                          onClick={() => {
                            setEditingId(null);
                            setEditToken('');
                          }}
                          className="cancel-button"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="account-actions">
                      <button 
                        onClick={() => {
                          setEditingId(account.id);
                          setEditToken(account.token);
                        }}
                        className="edit-button"
                      >
                        <FaEdit /> Sửa
                      </button>
                      <button 
                        onClick={() => handleDeleteAccount(account.id)}
                        className="delete-button"
                      >
                        <FaTrash /> Xóa
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile; 