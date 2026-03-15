import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/emailVerified.css';
import emailVerifiedIcon from '../assets/EmailVerified.svg';

const EmailVerified = () => {
  const navigate = useNavigate();

  const handleBackToSignIn = () => {
    navigate('/signin');
  };

  return (
    <div className="email-verified-page-container">
      <div className="email-verified-box">
        <img 
          src={emailVerifiedIcon} 
          alt="Email Verified Checkmark" 
          className="email-verified-icon" 
        />
        
        <h1 className="email-verified-title">Email Verified</h1>
        
        <p className="email-verified-description">
          Your email address was successfully verified.
        </p>

        <button 
          className="btn-back-to-signin" 
          onClick={handleBackToSignIn}
        >
          Back to Sign In
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="arrow-icon">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default EmailVerified;
