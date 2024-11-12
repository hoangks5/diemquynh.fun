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

  const getRandomToken = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/facebook-accounts/list`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      if (data.status === 'success' && data.accounts.length > 0) {
        // Lấy ngẫu nhiên một token từ danh sách tài khoản
        const randomAccount = data.accounts[Math.floor(Math.random() * data.accounts.length)];
        return randomAccount.token;
      }
      throw new Error('Không có tài khoản Facebook nào');
    } catch (error) {
      throw new Error('Vui lòng thêm tài khoản Facebook trước');
    }
  };

  const handleAddGroup = async () => {
    try {
      const activeToken = await getRandomToken();

      // Sử dụng endpoint groups thay vì truy cập trực tiếp
      const response = await fetch(`https://graph.facebook.com/v19.0/${newGroupId}?fields=name,member_count,privacy,administrator&access_token=${activeToken}`);
      const data = await response.json();
      
      if (data.error) {
        if (data.error.code === 100) {
          throw new Error('Không thể truy cập nhóm này. Có thể do ID không đúng hoặc bạn không phải là thành viên của nhóm.');
        }
        if (data.error.code === 3) {
          throw new Error('Token không có đủ quyền. Vui lòng cấp quyền: groups_access_member_info, groups_show_list');
        }
        throw new Error('Group ID không hợp lệ');
      }

      // Kiểm tra xem có phải là nhóm công khai không
      if (data.privacy !== 'OPEN') {
        throw new Error('Chỉ có thể thêm nhóm công khai');
      }

      const newGroup = {
        id: Date.now(),
        groupId: newGroupId,
        name: data.name,
        memberCount: data.member_count || 0,
        privacy: data.privacy,
        isAdmin: data.administrator || false,
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
      const activeToken = await getRandomToken();

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