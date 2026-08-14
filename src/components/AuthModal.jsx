import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    authMode,
    setAuthMode,
    closeAuth,
    login,
    signup,
    isLoading,
    authError,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isAuthModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (authMode === 'login') {
      await login(email, password);
    } else {
      await signup(name, email, password);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={closeAuth}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-tape" />

        <button className="auth-modal-close" onClick={closeAuth} aria-label="Close">
          <X size={16} strokeWidth={2.5} />
        </button>

        {/* Compact Header */}
        <div className="auth-modal-header">
          <img src="/assets/4.png" alt="Mascot" className="auth-modal-mascot" />
          <h2 className="auth-modal-title">
            {authMode === 'login' ? 'Welcome Back, Maker!' : 'Join the Club!'}
          </h2>
          <p className="auth-modal-subtitle">
            {authMode === 'login'
              ? 'Sign in to access your orders & maker points'
              : 'Create an account & start crafting today'}
          </p>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab-btn ${authMode === 'login' ? 'active' : ''}`}
            onClick={() => setAuthMode('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${authMode === 'signup' ? 'active' : ''}`}
            onClick={() => setAuthMode('signup')}
          >
            Create Account
          </button>
        </div>

        {/* Error notification */}
        {authError && (
          <div className="auth-error-box">
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{authError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form-body">
          {authMode === 'signup' && (
            <div className="auth-form-group">
              <label className="auth-label">Full Name</label>
              <div className="auth-input-wrapper">
                <User size={16} className="auth-input-icon" />
                <input
                  type="text"
                  placeholder="e.g. Maya Sharma"
                  className="auth-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="auth-form-group">
            <label className="auth-label">Email Address</label>
            <div className="auth-input-wrapper">
              <Mail size={16} className="auth-input-icon" />
              <input
                type="email"
                placeholder="you@example.com"
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrapper">
              <Lock size={16} className="auth-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={isLoading}>
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Loader2 size={16} className="animate-spin" />
                <span>Processing...</span>
              </span>
            ) : (
              <span>{authMode === 'login' ? 'Sign In' : 'Sign Up Free'}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
