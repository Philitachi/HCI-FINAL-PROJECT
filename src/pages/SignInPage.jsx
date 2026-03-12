import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignInPage.css';
import logo from '../assets/Logo.svg';
import ExitButton from '../components/exitButton';

const SignInPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

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
          <ExitButton to="/" />

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
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                className="form-input"
                required
              />
              <button 
                type="button" 
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                )}
              </button>
            </div>

            <button type="submit" className="btn-submit">Sign In</button>
          </form>

          <div className="card-footer">
            <a href="#" className="link-forgot" onClick={(e) => { e.preventDefault(); navigate('/forgot-password'); }}>Forgot Password?</a>
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