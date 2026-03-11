import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignUpPage.css';
import logo from '../assets/Logo.svg';

const SignUpPage = () => {
  const navigate = useNavigate();

  return (
    <div className="signup-container">
      {/* Background with Dark Gradient */}
      <div className="signup-background"></div>

      {/* Main Content Area */}
      <div className="signup-content">
        {/* Header Section (Above the card) */}
        <div className="signup-header">
          <img src={logo} alt="Fire Safety Inspection System Logo" className="signup-logo" />
          <h1 className="signup-title">Fire Safety Inspection System</h1>
        </div>

        {/* Signup Card */}
        <div className="signup-card">
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

          <h2 className="card-title-left">Create Account</h2>
          <p className="card-subtitle-left">
            Please complete the registration form
          </p>

          <form className="signup-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-grid">
              {/* Row 1 */}
              <div className="input-group">
                <input 
                  type="text" 
                  placeholder="First Name" 
                  className="form-input"
                  required
                />
              </div>
              <div className="input-group">
                <input 
                  type="text" 
                  placeholder="Last Name" 
                  className="form-input"
                  required
                />
              </div>

              {/* Row 2 */}
              <div className="input-group">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="form-input"
                  required
                />
              </div>
              <div className="input-group">
                <input 
                  type="tel" 
                  placeholder="+63 Mobile Number" 
                  className="form-input"
                  required
                />
              </div>

              {/* Row 3 */}
              <div className="input-group">
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="form-input"
                  required
                />
              </div>
              <div className="input-group">
                <input 
                  type="password" 
                  placeholder="Password Confirmation" 
                  className="form-input"
                  required
                />
              </div>
            </div>

            <p className="terms-text">
              By clicking Sign Up, you agree to our <a href="#" className="link-terms" onClick={(e) => { e.preventDefault(); navigate('/terms'); }}>Terms and Conditions</a>. 
              You may receive Email Notifications from us<br/>and can opt out any time.
            </p>

            <div className="submit-container">
              <button type="submit" className="btn-signup-submit">Sign Up</button>
            </div>
          </form>

          <div className="card-footer-signup">
            <p className="signin-prompt">
              Already have an account? <a href="#" className="link-signin" onClick={(e) => { e.preventDefault(); navigate('/signin'); }}>Sign In <span className="arrow">→</span></a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
