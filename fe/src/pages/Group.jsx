import { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import './Group.css';
import Navbar from '../components/Navbar';
import Menu from '../components/Menu';
import { useToast } from '../contexts/ToastContext';

const Group = () => {
  const [groups, setGroups] = useState([]);
  const [newGroupId, setNewGroupId] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editGroupId, setEditGroupId] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    const savedGroups = localStorage.getItem('fbGroups');
    if (savedGroups) {
      setGroups(JSON.parse(savedGroups));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fbGroups', JSON.stringify(groups));
  }, [groups]);

  const handleAddGroup = async () => {
    try {
      // Lấy token của tài khoản đang đăng nhập từ localStorage
      const accounts = JSON.parse(localStorage.getItem('fbAccounts') || '[]');
      if (accounts.length === 0) {
        throw new Error('Vui lòng thêm tài khoản Facebook trước');
      }
      const activeToken = accounts[0].token; // Sử dụng token của tài khoản đầu tiên

      // Kiểm tra group ID hợp lệ bằng cách gọi Facebook API
      const response = await fetch(`https://graph.facebook.com/${newGroupId}?fields=name,member_count&access_token=${activeToken}`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error('Group ID không hợp lệ');
      }

      const newGroup = {
        id: Date.now(),
        groupId: newGroupId,
        name: data.name,
        memberCount: data.member_count,
        addedAt: new Date().toISOString()
      };

      setGroups([...groups, newGroup]);
      setNewGroupId('');
      showToast('Thêm nhóm thành công', 'success');
    } catch (error) {
      showToast(error.message || 'Không thể thêm nhóm', 'error');
    }
  };

  const handleDeleteGroup = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa nhóm này?')) {
      setGroups(groups.filter(group => group.id !== id));
      showToast('Đã xóa nhóm thành công', 'success');
    }
  };

  const handleUpdateGroup = async (id) => {
    try {
      const accounts = JSON.parse(localStorage.getItem('fbAccounts') || '[]');
      if (accounts.length === 0) {
        throw new Error('Vui lòng thêm tài khoản Facebook trước');
      }
      const activeToken = accounts[0].token;

      const response = await fetch(`https://graph.facebook.com/${editGroupId}?fields=name,member_count&access_token=${activeToken}`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error('Group ID không hợp lệ');
      }

      setGroups(groups.map(group => {
        if (group.id === id) {
          return {
            ...group,
            groupId: editGroupId,
            name: data.name,
            memberCount: data.member_count,
            updatedAt: new Date().toISOString()
          };
        }
        return group;
      }));
      
      setEditingId(null);
      setEditGroupId('');
      showToast('Cập nhật nhóm thành công', 'success');
    } catch (error) {
      showToast(error.message || 'Không thể cập nhật nhóm', 'error');
    }
  };

  return (
    <div className="home-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Menu />
      <Navbar />
      
      <main className="home-main" style={{ flex: 1 }}>
        <div className="home-content">
          <div className="group-container">
            <h1>Quản lý nhóm Facebook</h1>
            
            <div className="add-group-form">
              <input
                type="text"
                value={newGroupId}
                onChange={(e) => setNewGroupId(e.target.value)}
                placeholder="Nhập ID nhóm Facebook"
                className="group-input"
              />
              <button 
                onClick={handleAddGroup}
                className="add-button"
              >
                <FaPlus /> Thêm nhóm
              </button>
            </div>

            <div className="groups-list">
              {groups.map(group => (
                <div key={group.id} className="group-card">
                  <div className="group-info">
                    <h3>{group.name}</h3>
                    <p>Group ID: {group.groupId}</p>
                    <p>Số thành viên: {group.memberCount}</p>
                    <p>Ngày thêm: {new Date(group.addedAt).toLocaleDateString()}</p>
                    {group.updatedAt && (
                      <p>Cập nhật lần cuối: {new Date(group.updatedAt).toLocaleDateString()}</p>
                    )}
                  </div>

                  {editingId === group.id ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        value={editGroupId}
                        onChange={(e) => setEditGroupId(e.target.value)}
                        placeholder="Nhập ID nhóm mới"
                        className="group-input"
                      />
                      <div className="edit-buttons">
                        <button 
                          onClick={() => handleUpdateGroup(group.id)}
                          className="save-button"
                        >
                          Lưu
                        </button>
                        <button 
                          onClick={() => {
                            setEditingId(null);
                            setEditGroupId('');
                          }}
                          className="cancel-button"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="group-actions">
                      <button 
                        onClick={() => {
                          setEditingId(group.id);
                          setEditGroupId(group.groupId);
                        }}
                        className="edit-button"
                      >
                        <FaEdit /> Sửa
                      </button>
                      <button 
                        onClick={() => handleDeleteGroup(group.id)}
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

export default Group; 