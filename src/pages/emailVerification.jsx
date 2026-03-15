import React, { useState, useEffect } from 'react';
import '../styles/emailVerification.css';
import verifyEmailIcon from '../assets/verifyyouemailaddress.svg';

const EmailVerification = () => {
  const [resendCount, setResendCount] = useState(0);
  const [timer, setTimer] = useState(0); // Timer in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    // Check initial theme
    setIsLightMode(document.documentElement.classList.contains('light-mode'));

    // Observer to detect class changes on the html element
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

  const handleResend = () => {
    if (!isTimerActive) {
      const newCount = resendCount + 1;
      setResendCount(newCount);
      
        // Calculate countdown duration in seconds
        const minutes = 1; // Always 1 minute based on recent instruction
        setTimer(minutes * 60);
        setIsTimerActive(true);
      
      // TODO: Implement actual resend API logic here
      console.log(`Resend email triggered. Count: ${newCount}, Wait Time: ${minutes} min`);
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
          alt="Verify Email Envelope" 
          className="email-verification-icon" 
        />
        
        <h1 className="email-verification-title">Verify your email address</h1>
        
        <p className="email-verification-description">
          We have sent email to <span className="email-highlight">philipcorpin@gmail.com</span> to verify the validity of our email address. After receiving the email follow the link provided to complete your registration.
        </p>

        <div className="email-verification-divider"></div>

        <div className="email-resend-container">
          <span>If you not got any mail</span>
          <button 
            className="email-resend-button" 
            onClick={handleResend}
            disabled={isTimerActive}
          >
            {isTimerActive ? `Resend available in` : 'Resend confirmation mail'}
          </button>
          {isTimerActive && (
            <span className="timer-text">{formatTime(timer)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
