import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { AlertCircle } from 'lucide-react';
import { auth, db } from '../../../services/firebase';
import emailjs from '@emailjs/browser';
import '../styles/EmailVerification.css';
import verifyEmailIcon from '../../../assets/verifyyouemailaddress.svg';

const getResendDelaySeconds = (resendAttempt) => {
  if (resendAttempt <= 1) return 60;
  return 5 * 60;
};

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userEmail = searchParams.get('email') || 'your email';
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [resendCount, setResendCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [verifySuccess, setVerifySuccess] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState('');

  const inputRefs = useRef([]);

  useEffect(() => {
    setIsLightMode(document.documentElement.classList.contains('light-mode'));
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsLightMode(document.documentElement.classList.contains('light-mode'));
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let interval = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && isTimerActive) {
      setIsTimerActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleCodeChange = (index, value) => {
    // Only allow single digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setVerifyError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // On backspace, if current is empty, go to previous
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setCode(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredCode = code.join('');
    if (enteredCode.length !== 6) {
      setVerifyError('Please enter the complete 6-digit code.');
      return;
    }

    setIsVerifying(true);
    setVerifyError('');
    setVerifySuccess('');

    try {
      // Find the user document by email
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', userEmail));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setVerifyError('No account found with this email. Please sign up again.');
        setIsVerifying(false);
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // Check if code matches
      if (userData.verificationCode !== enteredCode) {
        setVerifyError('Invalid verification code. Please try again.');
        setIsVerifying(false);
        return;
      }

      // Check if code is expired
      const expiresAt = new Date(userData.codeExpiresAt);
      if (new Date() > expiresAt) {
        setVerifyError('Verification code has expired. Please request a new one.');
        setIsVerifying(false);
        return;
      }

      // Code is valid! Update emailVerified status
      await updateDoc(doc(db, 'users', userDoc.id), {
        emailVerified: true,
        verificationCode: null,
        codeExpiresAt: null
      });

      setVerifySuccess('Email verified successfully!');
      
      // Navigate to email-verified page after a brief delay
      setTimeout(() => {
        navigate('/email-verified');
      }, 1000);
    } catch (error) {
      console.error('Verification error:', error);
      setVerifyError('An error occurred. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!isTimerActive && !isResending) {
      setIsResending(true);
      setResendStatus('');
      setVerifyError('');

      try {
        // Generate a new code
        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
        const newExpiry = new Date(Date.now() + 10 * 60 * 1000);

        // Find the user doc by email and update the code
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', userEmail));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          const newCount = (Number(userData.verificationResendCount) || resendCount) + 1;
          const cooldownSeconds = getResendDelaySeconds(newCount);

          setResendCount(newCount);
          setTimer(cooldownSeconds);
          setIsTimerActive(true);

          await updateDoc(doc(db, 'users', userDoc.id), {
            verificationCode: newCode,
            codeExpiresAt: newExpiry.toISOString(),
            verificationResendCount: newCount
          });

          // Send via EmailJS
          await emailjs.send(
            'service_1sel32g',
            'template_d5x199o',
            {
              to_email: userEmail,
              verification_code: newCode,
              to_name: userData.firstName || 'User',
            },
            'TkdpHziryGZ1SETq9'
          );

          setResendStatus('New verification code sent!');
        } else {
          setResendStatus('No account found. Please sign up again.');
        }
      } catch (error) {
        console.error('Resend error:', error);
        setResendStatus('Failed to resend code. Please try again.');
      } finally {
        setIsResending(false);
      }
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="email-verification-page-container">
      <div className="email-verification-box">
        <img 
          src={verifyEmailIcon} 
          alt="Verify Email" 
          className="email-verification-icon" 
        />
        
        <h1 className="email-verification-title">Verify your email address</h1>
        
        <p className="email-verification-description">
          We have sent a 6-digit verification code to <span className="email-highlight">{userEmail}</span>. Enter the code below to complete your registration.
        </p>

        <p className="email-delivery-note">
          <AlertCircle size={18} className="delivery-note-icon" aria-hidden="true" />
          <span>If you do not see the code in your inbox, please check your spam or junk folder.</span>
        </p>

        {/* 6-Digit Code Input */}
        <div className="code-input-container">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className={`code-input-box ${digit ? 'has-value' : ''} ${verifyError ? 'code-error' : ''} ${verifySuccess ? 'code-success' : ''}`}
              value={digit}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              autoComplete="off"
            />
          ))}
        </div>

        {verifyError && (
          <p className="verify-error-text">{verifyError}</p>
        )}
        {verifySuccess && (
          <p className="verify-success-text">{verifySuccess}</p>
        )}

        <button 
          className="btn-verify-code" 
          onClick={handleVerify}
          disabled={isVerifying || code.join('').length !== 6}
        >
          {isVerifying ? 'Verifying...' : 'Verify Code'}
        </button>

        <div className="email-verification-divider"></div>

        <div className="email-resend-container">
          <span>Didn't receive the code?</span>
          <button 
            className="email-resend-button" 
            onClick={handleResend}
            disabled={isTimerActive || isResending}
          >
            {isResending ? 'Sending...' : isTimerActive ? `Resend available in` : 'Resend code'}
          </button>
          {isTimerActive && (
            <span className="timer-text">{formatTime(timer)}</span>
          )}
        </div>
        {resendStatus && (
          <p className="resend-status-text">{resendStatus}</p>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
