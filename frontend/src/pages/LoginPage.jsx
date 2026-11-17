import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Mail, Lock, LogIn, AlertCircle, Sparkles, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
      showToast('Welcome back to CineReview!', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
      showToast(err.message || 'Login failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@cinereview.com');
    setPassword('Admin@123456');
    setError('');
  };

  return (
    <div className="auth-page app-container">
      <div className="auth-card animate-fade-down">
        {/* Brand Header */}
        <div className="auth-header">
          <Link to="/" className="navbar-logo justify-center mb-3">
            <div className="logo-icon-wrapper">
              <Film size={22} className="logo-film-icon" />
            </div>
            <span className="logo-text">
              Cine<span className="logo-accent">Review</span>
            </span>
          </Link>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to rate movies, write reviews, and access your watchlist</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="auth-error-alert">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="flex justify-between items-center mb-1">
              <label className="form-label">Password</label>
            </div>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full btn-auth-submit"
          >
            <LogIn size={18} />
            <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Demo Credentials Quickfill Box */}
        <div className="demo-credentials-box">
          <div className="demo-title">
            <Sparkles size={14} className="text-purple-400" />
            <span>Demo Test Credentials:</span>
          </div>
          <button
            type="button"
            onClick={fillDemoAdmin}
            className="demo-pill-btn"
            title="Auto-fill default admin credentials"
          >
            <Shield size={12} className="text-amber-400" />
            <span>Fill Admin Demo (admin@cinereview.com)</span>
          </button>
        </div>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            Don't have an account yet?{' '}
            <Link to="/register" className="auth-link">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
