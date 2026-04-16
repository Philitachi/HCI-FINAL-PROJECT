import React from 'react';
import { useNavigate } from 'react-router-dom';
import emailVerifiedBg from '../assets/EmailVerified.svg';
import '../styles/PasswordResetSuccess.css';

const PasswordResetSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="reset-success-page-container">
      <div className="reset-success-box">
        <div className="illustration-wrapper-success">
          <img 
            src={emailVerifiedBg} 
            alt="Green checkmark icon indicating your password has been successfully reset" 
            className="success-illustration" 
          />
        </div>

        <h1 className="success-title">Password Reset!</h1>
        <p className="success-description">
          Your password has been successfully reset. You can now sign in with your new password.
        </p>

        <button 
          className="btn-back-signin" 
          onClick={() => navigate('/signin')}
        >
          Back to Sign In <span className="arrow">→</span>
        </button>
      </div>
    </div>
  );
};

export default PasswordResetSuccess;
