import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle, Loader2, CheckCircle2, KeyRound, ArrowLeft } from 'lucide-react';
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
    loginWithGoogle,
    forgotPassword,
    resetPassword,
    isLoading,
    authError,
    setAuthError,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password flow state
  const [resetStep, setResetStep] = useState(1); // 1: enter email, 2: enter code & new pass, 3: success
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [codeHint, setCodeHint] = useState('');
  const [resetSuccessMsg, setResetSuccessMsg] = useState('');

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

  const handleTabSwitch = (mode) => {
    setAuthMode(mode);
    if (setAuthError) setAuthError('');
    setResetStep(1);
    setCodeHint('');
    setResetSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (authMode === 'login') {
      await login(email, password);
    } else if (authMode === 'signup') {
      await signup(name, email, password);
    }
  };

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  const handleGoogleCredentialResponse = async (response) => {
    if (response && response.credential) {
      try {
        const base64Url = response.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const data = JSON.parse(jsonPayload);
        await loginWithGoogle({
          email: data.email,
          name: data.name,
          avatar: data.picture || '/assets/4.png',
          credential: response.credential,
          google_id: data.sub,
        });
      } catch (err) {
        console.error('Error handling Google token:', err);
        await loginWithGoogle({
          credential: response.credential,
        });
      }
    }
  };

  useEffect(() => {
    if (!isAuthModalOpen || authMode === 'forgot_password') return;

    const initGsi = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });
        } catch (e) {
          console.warn('Google GSI init warning:', e);
        }
      }
    };

    if (window.google?.accounts?.id) {
      initGsi();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          initGsi();
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isAuthModalOpen, authMode]);

  // Google Sign In fallback handler
  const handleGoogleSignIn = async () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          triggerPromptFallback();
        }
      });
    } else {
      triggerPromptFallback();
    }
  };

  const triggerPromptFallback = async () => {
    let googleEmail = email.trim();
    if (!googleEmail || !googleEmail.includes('@')) {
      const promptEmail = window.prompt("Enter your Google Account email:", "maker@gmail.com");
      if (!promptEmail) return;
      googleEmail = promptEmail.trim();
    }

    const googleName = name.trim() || googleEmail.split('@')[0].replace(/[._]/g, ' ');
    await loginWithGoogle({
      email: googleEmail,
      name: googleName.charAt(0).toUpperCase() + googleName.slice(1),
      avatar: '/assets/4.png',
      google_id: `google_${Date.now()}`
    });
  };

  // Forgot password step 1: Request reset code
  const handleSendResetCode = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    const res = await forgotPassword(email.trim());
    if (res && res.success) {
      if (res.reset_code) {
        setCodeHint(res.reset_code);
      }
      setResetStep(2);
    }
  };

  // Forgot password step 2: Submit code and new password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetCode.trim() || !newPassword) return;
    const res = await resetPassword(email.trim(), resetCode.trim(), newPassword);
    if (res && res.success) {
      setResetSuccessMsg(res.message || 'Password successfully updated!');
      setResetStep(3);
    }
  };

  if (!isAuthModalOpen) return null;

  const isNoAccountError =
    authError &&
    (authError.toLowerCase().includes('create an account') ||
      authError.toLowerCase().includes('no account found'));

  const isAlreadyExistsError =
    authError && authError.toLowerCase().includes('already exists');

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
            {authMode === 'login' && 'Welcome Back, Maker!'}
            {authMode === 'signup' && 'Join the Club!'}
            {authMode === 'forgot_password' && 'Reset Password'}
          </h2>
          <p className="auth-modal-subtitle">
            {authMode === 'login' && 'Sign in to access your orders & maker points'}
            {authMode === 'signup' && 'Create an account & start crafting today'}
            {authMode === 'forgot_password' && (resetStep === 1 ? 'Enter your email to receive a verification code' : resetStep === 2 ? 'Enter your code and choose a new password' : 'All done! You can now log in.')}
          </p>
        </div>

        {/* Tabs (shown only for login / signup) */}
        {authMode !== 'forgot_password' && (
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab-btn ${authMode === 'login' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('login')}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${authMode === 'signup' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('signup')}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Error notification with smart CTA */}
        {authError && (
          <div className="auth-error-box">
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
            <div className="auth-error-content">
              <span className="auth-error-msg">{authError}</span>
              {isNoAccountError && (
                <button
                  type="button"
                  className="auth-error-action-btn"
                  onClick={() => handleTabSwitch('signup')}
                >
                  Create Account Now →
                </button>
              )}
              {isAlreadyExistsError && (
                <button
                  type="button"
                  className="auth-error-action-btn"
                  onClick={() => handleTabSwitch('login')}
                >
                  Sign In Instead →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Main Form for Login & Signup */}
        {authMode !== 'forgot_password' && (
          <div className="auth-form-body">
            {/* Google Sign In Button */}
            <button
              type="button"
              className="auth-google-btn"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="auth-divider">
              <span>or with email</span>
            </div>

            <form onSubmit={handleSubmit}>
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
                <div className="auth-label-row">
                  <label className="auth-label" style={{ margin: 0 }}>Password</label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      className="auth-forgot-link"
                      onClick={() => handleTabSwitch('forgot_password')}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
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

              <div className="auth-footer-switch">
                {authMode === 'login' ? (
                  <span>
                    Don't have an account yet?{' '}
                    <button
                      type="button"
                      className="auth-switch-link"
                      onClick={() => handleTabSwitch('signup')}
                    >
                      Create one here
                    </button>
                  </span>
                ) : (
                  <span>
                    Already have an account?{' '}
                    <button
                      type="button"
                      className="auth-switch-link"
                      onClick={() => handleTabSwitch('login')}
                    >
                      Sign in here
                    </button>
                  </span>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Forgot Password Flow */}
        {authMode === 'forgot_password' && (
          <div className="auth-form-body">
            {resetStep === 1 && (
              <form onSubmit={handleSendResetCode}>
                <div className="auth-form-group">
                  <label className="auth-label">Your Registered Email</label>
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

                <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                  {isLoading ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Sending Code...</span>
                    </span>
                  ) : (
                    <span>Send Reset Code</span>
                  )}
                </button>
              </form>
            )}

            {resetStep === 2 && (
              <form onSubmit={handleResetPassword}>
                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: '0.9rem', color: '#4A5568' }}>
                    Reset code sent to <strong>{email}</strong>
                  </span>
                  {codeHint && (
                    <div>
                      <span className="auth-code-hint">Reset Code: {codeHint}</span>
                    </div>
                  )}
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">6-Digit Code</label>
                  <div className="auth-input-wrapper">
                    <KeyRound size={16} className="auth-input-icon" />
                    <input
                      type="text"
                      placeholder="e.g. 123456"
                      maxLength={10}
                      className="auth-input"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="auth-form-group">
                  <label className="auth-label">New Password</label>
                  <div className="auth-input-wrapper">
                    <Lock size={16} className="auth-input-icon" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="auth-input"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="auth-eye-btn"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      aria-label="Toggle password"
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                  {isLoading ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Updating Password...</span>
                    </span>
                  ) : (
                    <span>Save New Password</span>
                  )}
                </button>
              </form>
            )}

            {resetStep === 3 && (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <div className="auth-success-box" style={{ margin: '0 0 18px 0' }}>
                  <CheckCircle2 size={20} color="#38A169" style={{ flexShrink: 0 }} />
                  <span>{resetSuccessMsg || 'Password successfully updated!'}</span>
                </div>
                <button
                  type="button"
                  className="auth-submit-btn"
                  onClick={() => handleTabSwitch('login')}
                >
                  Sign In with New Password
                </button>
              </div>
            )}

            {/* Back button */}
            <div className="auth-footer-switch" style={{ marginTop: 20 }}>
              <button
                type="button"
                className="auth-switch-link"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
                onClick={() => handleTabSwitch('login')}
              >
                <ArrowLeft size={14} /> Back to Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
