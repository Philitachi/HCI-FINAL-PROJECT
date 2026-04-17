import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/emailVerified.css';
import emailVerifiedIcon from '../assets/EmailVerified.svg';
import { ArrowRight } from 'lucide-react';

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
          alt="Email Verified" 
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
          <ArrowRight size={20} strokeWidth={2} className="arrow-icon" />
        </button>
      </div>
    </div>
  );
};

export default EmailVerified;
