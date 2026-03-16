import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import emailjs from '@emailjs/browser';
import '../styles/ForgotPasswordPage.css';
import illustrationDark from '../assets/ForgotPasswordIllustrationDarkmode.svg';
import illustrationLight from '../assets/forgotPasswordIllustrationLightmode.svg';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [shake, setShake] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const emailRef = useRef(null);

  const isInvalid = hasSubmitted && email.length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    setError('');
    
    if (email.length === 0) {
      emailRef.current?.focus();
      setShake(false);
      setTimeout(() => setShake(true), 10);
      return;
    }

    setIsLoading(true);
    try {
      // 1. Check if email exists in Firestore
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError('No account found with this email address.');
        setIsLoading(false);
        return;
      }

      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();

      // 2. Generate a 6-digit reset code
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      const codeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

      // 3. Store reset code in Firestore
      await updateDoc(doc(db, 'users', userDoc.id), {
        resetCode: resetCode,
        resetCodeExpiresAt: codeExpiresAt.toISOString()
      });

      // 4. Send code via EmailJS
      await emailjs.send(
        'service_1sel32g',
        'template_d5x199o',
        {
          to_email: email,
          verification_code: resetCode,
          to_name: userData.firstName || 'User',
        },
        'TkdpHziryGZ1SETq9'
      );

      // 5. Navigate to reset password page
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
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
            Don't worry. Enter your email and we'll send you a 6-digit code to reset your password.
          </p>
          
          <form className="forgot-form" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="form-top-error-forgot">{error}</div>
            )}
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
            
            <button type="submit" className="btn-send" disabled={isLoading}>
              {isLoading ? 'Sending Code...' : 'Send Code'}
            </button>
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

