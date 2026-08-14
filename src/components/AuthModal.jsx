import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
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
    loginAsDemo,
    isLoading,
    authError,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
          <X size={18} strokeWidth={2.5} />
        </button>

        {/* Header */}
        <div className="auth-modal-header">
          <img src="/assets/4.png" alt="Mascot" className="auth-modal-mascot" />
          <h2 className="auth-modal-title">
            {authMode === 'login' ? 'Welcome Back, Maker!' : 'Join the Creative Club!'}
          </h2>
          <p className="auth-modal-subtitle">
            {authMode === 'login'
              ? 'Sign in to access your orders and maker points stored in database'
              : 'Create your account and earn 50 welcome maker points'}
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
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 14px',
            background: '#FFF5F5',
            border: '1.5px solid #E53E3E',
            borderRadius: 8,
            color: '#C53030',
            fontSize: '0.9rem',
            margin: '0 20px 12px 20px',
            fontFamily: 'var(--font-body)',
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{authError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form-body">
          {authMode === 'signup' && (
            <div className="auth-form-group">
              <label className="auth-label">Full Name</label>
              <div className="auth-input-wrapper">
                <User size={18} className="auth-input-icon" />
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
              <Mail size={18} className="auth-input-icon" />
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
              <Lock size={18} className="auth-input-icon" />
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
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={isLoading}>
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Loader2 size={18} className="animate-spin" />
                <span>Processing...</span>
              </span>
            ) : (
              <span>{authMode === 'login' ? 'Sign In' : 'Sign Up Free'}</span>
            )}
          </button>

          <div className="auth-divider">
            <span>OR QUICK DEMO</span>
          </div>

          <button
            type="button"
            className="auth-demo-btn"
            onClick={loginAsDemo}
            disabled={isLoading}
          >
            <Sparkles size={16} />
            <span>1-Click Test Login as Art Lover</span>
          </button>
        </form>
      </div>
    </div>
  );
}
