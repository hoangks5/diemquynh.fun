import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const logout = async () => {
    // Xóa token từ localStorage
    localStorage.removeItem('token');
    // Xóa thông tin user
    setUser(null);
    // Thêm các xử lý đăng xuất khác nếu cần
  };

  const value = {
    user,
    setUser,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 