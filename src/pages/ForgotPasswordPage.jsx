import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ForgotPasswordPage.css';
import illustrationDark from '../assets/ForgotPasswordIllustrationDarkmode.svg';
import illustrationLight from '../assets/forgotPasswordIllustrationLightmode.svg';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [shake, setShake] = useState(false);
  const emailRef = useRef(null);

  // Check if form was submitted and email is empty
  const isInvalid = hasSubmitted && email.length === 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    
    if (email.length === 0) {
      emailRef.current?.focus();
      setShake(false);
      setTimeout(() => setShake(true), 10);
    } else if (email.length > 0) {
      // Proceed with logic (e.g. API call)
      console.log("Send email submitted");
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-background"></div>
      <div className="forgot-content">
        <div className="forgot-card">
          <div className="illustration-wrapper">
            <img src={illustrationDark} alt="Forgot Password Illustration" className="forgot-illustration dark-img" />
            <img src={illustrationLight} alt="Forgot Password Illustration" className="forgot-illustration light-img" />
          </div>
          
          <h2 className="forgot-title">Forgot your password?</h2>
          <p className="forgot-subtitle">
            Don't worry. You may reset your password here, just tell us the email address you registered on our website.
          </p>
          
          <form className="forgot-form" onSubmit={handleSubmit} noValidate>
            <div className={`input-wrapper-forgotPass ${isInvalid ? 'input-error' : ''} ${shake ? 'shake-active' : ''}`}>
              <span className="input-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </span>
              <input 
                type="email" 
                placeholder="Email Address" 
                className="form-input"
                title="Please fill out this field."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                ref={emailRef}
                required
              />
            </div>
            {isInvalid && (
              <p className="field-error-text-forgotPass">This field is required</p>
            )}
            
            <button type="submit" className="btn-send">Send Email</button>
          </form>
          
          <div className="forgot-footer">
            <a href="#" className="link-back" onClick={(e) => { e.preventDefault(); navigate('/signin'); }}>
              Back to Login <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
