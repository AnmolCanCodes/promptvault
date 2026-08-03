import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { storage } from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = storage.getToken();
    if (token) {
      setIsAuthenticated(true);
      const savedUser = storage.getUser();
      if (savedUser) {
        setUser(savedUser);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setIsAuthenticated(true);
    setUser(data.user || { email });
    if (data.user) {
      storage.setUser(data.user);
    }
    return data;
  };

  const register = async (email, password) => {
    const data = await authService.register(email, password);
    return data;
  };

  const logout = () => {
    authService.logout();
    storage.clear();
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
