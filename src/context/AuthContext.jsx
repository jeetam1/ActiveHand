
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('activehands_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Fetch current authenticated user from Django backend
  const refreshUser = useCallback(async () => {
    const token = api.getToken();
    if (!token) return null;
    try {
      const userData = await api.getCurrentUser();
      if (userData) {
        setUser(userData);
        localStorage.setItem('activehands_user', JSON.stringify(userData));
        return userData;
      }
    } catch (e) {
      console.warn('Could not refresh user session:', e);
      if (e.message && e.message.includes('Invalid token')) {
        api.setToken(null);
        setUser(null);
        localStorage.removeItem('activehands_user');
      }
    }
    return null;
  }, []);

  // Check auth session on startup
  useEffect(() => {
    if (api.getToken()) {
      refreshUser();
    }
  }, [refreshUser]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('activehands_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('activehands_user');
      }
    } catch (e) {
      console.error('Failed to update user in localStorage', e);
    }
  }, [user]);

  const login = async (email, password) => {
    setIsLoading(true);
    setAuthError('');
    try {
      const res = await api.login(email, password);
      if (res && res.user) {
        setUser(res.user);
        setIsAuthModalOpen(false);
        setIsLoading(false);
        return { success: true, user: res.user };
      }
    } catch (err) {
      setIsLoading(false);
      setAuthError(err.message || 'Login failed. Please check your credentials.');
      return { success: false, error: err.message };
    }
  };

  const signup = async (name, email, password) => {
    setIsLoading(true);
    setAuthError('');
    try {
      const res = await api.register(name, email, password);
      if (res && res.user) {
        setUser(res.user);
        setIsAuthModalOpen(false);
        setIsLoading(false);
        return { success: true, user: res.user };
      }
    } catch (err) {
      setIsLoading(false);
      setAuthError(err.message || 'Signup failed. Please try again.');
      return { success: false, error: err.message };
    }
  };

  const loginWithGoogle = async (googleUser) => {
    setIsLoading(true);
    setAuthError('');
    try {
      const res = await api.loginWithGoogle(googleUser);
      if (res && res.user) {
        setUser(res.user);
        setIsAuthModalOpen(false);
        setIsLoading(false);
        return { success: true, user: res.user };
      }
    } catch (err) {
      setIsLoading(false);
      setAuthError(err.message || 'Google Sign-In failed. Please try again.');
      return { success: false, error: err.message };
    }
  };

  const forgotPassword = async (email) => {
    setIsLoading(true);
    setAuthError('');
    try {
      const res = await api.forgotPassword(email);
      setIsLoading(false);
      return { success: true, ...res };
    } catch (err) {
      setIsLoading(false);
      setAuthError(err.message || 'Could not send reset code.');
      return { success: false, error: err.message };
    }
  };

  const resetPassword = async (email, code, newPassword) => {
    setIsLoading(true);
    setAuthError('');
    try {
      const res = await api.resetPassword(email, code, newPassword);
      setIsLoading(false);
      return { success: true, ...res };
    } catch (err) {
      setIsLoading(false);
      setAuthError(err.message || 'Password reset failed.');
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (e) {
      console.warn('Logout error:', e);
    }
    setUser(null);
    setIsAccountOpen(false);
    try {
      localStorage.removeItem('activehands_user');
      localStorage.removeItem('activehands_token');
      localStorage.removeItem('activehands_cart');
      localStorage.removeItem('activehands_wishlist');
    } catch (e) {
      console.error('Error clearing localStorage on logout', e);
    }
  };

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthError('');
    setIsAuthModalOpen(true);
  };

  const closeAuth = () => {
    setIsAuthModalOpen(false);
    setAuthError('');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated: !!user,
        isAuthModalOpen,
        authMode,
        setAuthMode,
        openAuth,
        closeAuth,
        isAccountOpen,
        openAccount: () => setIsAccountOpen(true),
        closeAccount: () => setIsAccountOpen(false),
        login,
        signup,
        loginWithGoogle,
        forgotPassword,
        resetPassword,
        logout,
        refreshUser,
        isLoading,
        authError,
        setAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
