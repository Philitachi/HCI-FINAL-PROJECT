import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, updatePassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import emailjs from '@emailjs/browser';
import '../styles/ResetPassword.css';
import illustrationDark from '../assets/verifyyouridentitydarkmode.svg';
import illustrationLight from '../assets/verifyyouridentityLightmode.svg';
import { hashPassword } from '../utils/crypto';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userEmail = searchParams.get('email') || '';

  // Steps: 'code' → 'newpassword' → 'success'
  const [step, setStep] = useState('code');

  // Code input state
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  // Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // UI state
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [resendStatus, setResendStatus] = useState('');

  // Firestore user doc reference (stored after code verification)
  const [verifiedUserDocId, setVerifiedUserDocId] = useState('');
  const [verifiedUserData, setVerifiedUserData] = useState(null);

  // Auto-focus first code input
  useEffect(() => {
    if (step === 'code' && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [step]);

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

  // Password validation
  const isPasswordValid = newPassword.length >= 8 && /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) && /\d/.test(newPassword);
  const doPasswordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  const getPasswordHint = () => {
    const missing = [];
    if (newPassword.length < 8) missing.push('at least 8 characters');
    if (!/\d/.test(newPassword)) missing.push('a number');
    if (!/[A-Z]/.test(newPassword)) missing.push('an uppercase letter');
    if (!/[a-z]/.test(newPassword)) missing.push('a lowercase letter');
    if (missing.length === 0) return '';
    if (missing.length === 1) return `Password should contain ${missing[0]}.`;
    const last = missing.pop();
    return `Password should contain ${missing.join(', ')}, and ${last}.`;
  };

  // Code input handlers
  const handleCodeChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      setCode(pastedData.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  // Verify code
  const handleVerifyCode = async () => {
    const enteredCode = code.join('');
    if (enteredCode.length !== 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }

    setIsLoading(true);
    setError('');

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

      // Code is valid — move to password step
      setVerifiedUserDocId(userDoc.id);
      setVerifiedUserData(userData);
      setStep('newpassword');
    } catch (err) {
      console.error('Code verification error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password
  const handleResetPassword = async () => {
    if (!isPasswordValid) {
      setError(getPasswordHint());
      return;
    }
    if (!doPasswordsMatch) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 1. Hash the new password for the hack
      const hashedPass = await hashPassword(newPassword);

      // Update the password in Firestore for the reset hack
      await updateDoc(doc(db, 'users', verifiedUserDocId), {
        password: hashedPass,
        resetCode: null,
        resetCodeExpiresAt: null
      });

      setStep('success');
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend code
  const handleResend = async () => {
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
            src={illustrationDark} 
            alt="Verify Identity" 
            className="reset-password-icon dark-img" 
          />
          <img 
            src={illustrationLight} 
            alt="Verify Identity" 
            className="reset-password-icon light-img" 
          />
        </div>

        {/* STEP 1: Enter Code */}
        {step === 'code' && (
          <>
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
                  onChange={(e) => handleCodeChange(index, e.target.value)}
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
              disabled={isLoading || code.join('').length !== 6}
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>

            <div className="reset-divider"></div>

            <div className="reset-resend-container">
              <span>Didn't receive the code?</span>
              <button 
                className="reset-resend-button" 
                onClick={handleResend}
                disabled={isTimerActive}
              >
                {isTimerActive ? 'Resend available in' : 'Resend code'}
              </button>
              {isTimerActive && (
                <span className="reset-timer-text">{formatTime(resendTimer)}</span>
              )}
            </div>
            {resendStatus && <p className="reset-resend-status">{resendStatus}</p>}
          </>
        )}

        {/* STEP 2: Enter New Password */}
        {step === 'newpassword' && (
          <>
            <h1 className="reset-password-title">Create New Password</h1>
            <p className="reset-password-description">
              Your identity has been verified. Enter your new password below.
            </p>

            <div className="reset-password-form">
              <div className="reset-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New Password"
                  className={`reset-form-input ${newPassword.length > 0 ? (isPasswordValid ? 'input-success' : 'input-error') : ''}`}
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                />
                <button 
                  type="button" 
                  className="reset-password-toggle"
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
              {newPassword.length > 0 && !isPasswordValid && (
                <p className="reset-hint-text">{getPasswordHint()}</p>
              )}

              <div className="reset-input-wrapper">
                <input
                  type={showPasswordConfirm ? 'text' : 'password'}
                  placeholder="Confirm New Password"
                  className={`reset-form-input ${confirmPassword.length > 0 ? (doPasswordsMatch ? 'input-success' : 'input-error') : ''}`}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                />
                <button 
                  type="button" 
                  className="reset-password-toggle"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  aria-label={showPasswordConfirm ? "Hide password" : "Show password"}
                >
                  {showPasswordConfirm ? (
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
              {confirmPassword.length > 0 && !doPasswordsMatch && (
                <p className="reset-hint-text">Passwords do not match.</p>
              )}
            </div>

            {error && <p className="reset-error-text">{error}</p>}

            <button 
              className="btn-reset-action" 
              onClick={handleResetPassword}
              disabled={isLoading || !isPasswordValid || !doPasswordsMatch}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </>
        )}

        {/* STEP 3: Success */}
        {step === 'success' && (
          <>
            <h1 className="reset-password-title">Password Reset!</h1>
            <p className="reset-password-description">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>

            <button 
              className="btn-back-signin" 
              onClick={() => navigate('/signin')}
            >
              Back to Sign In
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="arrow-icon">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
