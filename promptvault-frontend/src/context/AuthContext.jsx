import { useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import { storage } from '../utils/storage';
import { AuthContext } from './authContextCore';

const getInitialAuthState = () => {
  const token = storage.getToken();
  const savedUser = storage.getUser();

  return {
    token,
    user: savedUser || null,
    isAuthenticated: Boolean(token),
    loading: Boolean(token && !savedUser)
  };
};

export const AuthProvider = ({ children }) => {
  const [initialAuthState] = useState(getInitialAuthState);
  const [user, setUser] = useState(initialAuthState.user);
  const [loading, setLoading] = useState(initialAuthState.loading);
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthState.isAuthenticated);

  useEffect(() => {
    if (!initialAuthState.token || initialAuthState.user) {
      return;
    }

    authService.me()
      .then((data) => {
        if (data) {
          setUser(data);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
        storage.clear();
      })
      .finally(() => setLoading(false));
  }, [initialAuthState]);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setIsAuthenticated(true);
    setUser(data.user || { email });
    if (data.user) {
      storage.setUser(data.user);
    }
    return data;
  };

  const register = async (email, password, username) => {
    const data = await authService.register(email, password, username);
    return data;
  };

  const logout = () => {
    authService.logout();
    storage.clear();
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout
  }), [user, isAuthenticated, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
