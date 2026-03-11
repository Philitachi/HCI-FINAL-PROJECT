import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignInPage.css';
import logo from '../assets/Logo.svg';

const SignInPage = () => {
  const navigate = useNavigate();

  return (
    <div className="signin-container">
      <div className="signin-background"></div>
      <div className="signin-content">
        <div className="signin-header">
          <img src={logo} alt="Fire Safety Inspection System Logo" className="signin-logo" />
          <h1 className="signin-title">Fire Safety Inspection System</h1>
          <p className="signin-subtitle">Bureau of Fire Protection</p>
        </div>

        <div className="signin-card">
          <button 
            className="btn-close" 
            onClick={() => navigate('/')}
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <h2 className="card-title">Welcome Back</h2>
          <p className="card-subtitle">
            Enter your credentials to access your<br />dashboard
          </p>

          <form className="signin-form" onSubmit={(e) => e.preventDefault()}>
            {/* Email Input */}
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </span>
              <input 
                type="email" 
                placeholder="Email Address" 
                className="form-input"
                required
              />
            </div>

            {/* Password Input */}
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
              </span>
              <input 
                type="password" 
                placeholder="Password" 
                className="form-input"
                required
              />
            </div>

            <button type="submit" className="btn-submit">Sign In</button>
          </form>

          <div className="card-footer">
            <a href="#forgot" className="link-forgot">Forgot Password?</a>
            <p className="signup-prompt">
              Don't have an account? <a href="#" className="link-create" onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>Create one <span className="arrow">→</span></a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;