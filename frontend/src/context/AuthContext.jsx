import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from token on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await authAPI.getMe();
        setUser(response.data.user);
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const response = await authAPI.login({ email, password });
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw new Error(message);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setError(null);
    try {
      const response = await authAPI.register(userData);
      const { token, user: newUser } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      return newUser;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed';
      // Check for field-level errors
      if (err.response?.data?.errors) {
        const fieldErrors = err.response.data.errors.map((e) => e.message).join(', ');
        setError(fieldErrors);
        throw new Error(fieldErrors);
      }
      setError(message);
      throw new Error(message);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  }, []);

  const updateProfile = useCallback(async (data) => {
    setError(null);
    try {
      const response = await authAPI.updateProfile(data);
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data.user;
    } catch (err) {
      const message = err.response?.data?.message || 'Profile update failed';
      setError(message);
      throw new Error(message);
    }
  }, []);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    setError(null);
    try {
      await authAPI.changePassword({ currentPassword, newPassword });
    } catch (err) {
      const message = err.response?.data?.message || 'Password change failed';
      setError(message);
      throw new Error(message);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    // robust role detection: support `role`, `roleName`, `isAdmin`, or roles array
    isAdmin: Boolean(
      user?.isAdmin ||
      (typeof user?.role === 'string' && user.role.toLowerCase().includes('admin')) ||
      (typeof user?.roleName === 'string' && user.roleName.toLowerCase().includes('admin')) ||
      (Array.isArray(user?.roles) && user.roles.includes('admin'))
    ),
    isOfficial: Boolean(
      user?.role === 'department_official' ||
      (typeof user?.role === 'string' && user.role.toLowerCase().includes('official')) ||
      (typeof user?.roleName === 'string' && user.roleName.toLowerCase().includes('official'))
    ),
    isCitizen: user?.role === 'citizen',
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;