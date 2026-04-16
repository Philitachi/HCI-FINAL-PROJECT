import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import emailjs from '@emailjs/browser';
import '../styles/ResetPassword.css';
import verifyEmailDark from '../assets/verifyyouemailaddress.svg';
import verifyEmailLight from '../assets/verifyyouemailaddress.svg';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userEmail = searchParams.get('email') || '';

  // Code input state
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  // UI state
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [resendStatus, setResendStatus] = useState('');

  // Auto-focus first code input
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Resend timer
  useEffect(() => {
    let interval = null;
    if (isTimerActive && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0 && isTimerActive) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, resendTimer]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setCode(newCode);
      setError('');
      inputRefs.current[5].focus();
    }
  };

  const isCodeComplete = code.every((digit) => digit !== '');

  const handleVerifyCode = async () => {
    if (!isCodeComplete) return;

    setIsLoading(true);
    setError('');
    
    const enteredCode = code.join('');

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', userEmail));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError('No account found. Please try again.');
        setIsLoading(false);
        return;
      }

      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();

      if (userData.resetCode !== enteredCode) {
        setError('Invalid code. Please try again.');
        setIsLoading(false);
        return;
      }

      const expiresAt = new Date(userData.resetCodeExpiresAt);
      if (new Date() > expiresAt) {
        setError('Code has expired. Please request a new one.');
        setIsLoading(false);
        return;
      }

      // Code is valid — move to create new password page
      navigate('/create-new-password', { 
        state: { 
          verifiedUserDocId: userDoc.id, 
          verifiedUserData: userData 
        }
      });
    } catch (err) {
      console.error('Code verification error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (isTimerActive) return;
    setResendTimer(60);
    setIsTimerActive(true);
    setResendStatus('');

    try {
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      const newExpiry = new Date(Date.now() + 10 * 60 * 1000);

      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', userEmail));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const userDoc = snapshot.docs[0];
        await updateDoc(doc(db, 'users', userDoc.id), {
          resetCode: newCode,
          resetCodeExpiresAt: newExpiry.toISOString()
        });

        await emailjs.send(
          'service_1sel32g',
          'template_d5x199o',
          {
            to_email: userEmail,
            verification_code: newCode,
            to_name: 'User',
          },
          'TkdpHziryGZ1SETq9'
        );

        setResendStatus('New code sent!');
      }
    } catch (err) {
      console.error('Resend error:', err);
      setResendStatus('Failed to resend. Please try again.');
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="reset-password-page-container">
      <div className="reset-password-box">
        <div className="illustration-wrapper-reset">
          <img 
            src={verifyEmailDark} 
            alt="Illustration of an envelope with a verification code for password reset" 
            className="reset-password-icon dark-img" 
          />
          <img 
            src={verifyEmailLight} 
            alt="Illustration of an envelope with a verification code for password reset" 
            className="reset-password-icon light-img" 
          />
        </div>

        <h1 className="reset-password-title">Enter Reset Code</h1>
        <p className="reset-password-description">
          We sent a 6-digit code to <span className="email-highlight">{userEmail}</span>. Enter it below to verify your identity.
        </p>

        <div className="code-input-container">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className={`code-input-box ${digit ? 'has-value' : ''} ${error ? 'code-error' : ''}`}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              autoComplete="off"
            />
          ))}
        </div>

        {error && <p className="reset-error-text">{error}</p>}

        <button 
          className="btn-reset-action" 
          onClick={handleVerifyCode}
          disabled={!isCodeComplete || isLoading}
        >
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </button>

        <div className="reset-divider"></div>

        <div className="reset-resend-container">
          <span>Didn't receive the code? </span>
          {isTimerActive ? (
            <span className="reset-timer-text">Resend in {formatTime(resendTimer)}</span>
          ) : (
            <button className="reset-resend-button" onClick={handleResendCode}>
              Resend code
            </button>
          )}
        </div>
        
        {resendStatus && (
          <p className="reset-resend-status">
            {resendStatus}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
