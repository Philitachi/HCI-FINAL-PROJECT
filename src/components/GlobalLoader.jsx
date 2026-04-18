import React, { useState, useEffect } from 'react';
import './GlobalLoader.css';

const GlobalLoader = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isSlow, setIsSlow] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setVisible(false);
    };
    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Detect slow connection using Network Information API
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    const checkSpeed = () => {
      if (connection) {
        const slow = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g' || connection.effectiveType === '3g';
        setIsSlow(slow);
      }
    };

    if (connection) {
      checkSpeed();
      connection.addEventListener('change', checkSpeed);
    }

    // Global click listener to intercept interaction during bad network
    const handleGlobalClick = (e) => {
      // Check if they clicked an interactive element natively
      const interactive = e.target.closest('button, a, input[type="submit"], [role="button"], .custom-select-trigger');
      if (interactive) {
        const currentlyOffline = !navigator.onLine;
        let currentlySlow = false;
        
        if (connection) {
          currentlySlow = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g' || connection.effectiveType === '3g';
        }
        
        if (currentlyOffline || currentlySlow) {
          setIsOffline(currentlyOffline);
          setIsSlow(currentlySlow);
          setVisible(true);
          
          // Auto-dismiss the loader after 3 seconds to let them continue
          setTimeout(() => {
            setVisible(false);
          }, 3000);
        }
      }
    };

    // Use capture phase to ensure intercept regardless of click bubbling prevention
    document.addEventListener('click', handleGlobalClick, true);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('click', handleGlobalClick, true);
      if (connection) {
        connection.removeEventListener('change', checkSpeed);
      }
    };
  }, []);

  if (!visible) return null;

  const message = isOffline
    ? 'You are currently offline'
    : 'Slow connection detected';

  const subMessage = isOffline
    ? 'Please check your internet connection'
    : 'Loading may take longer than usual';

  return (
    <div className={`global-loader-overlay ${isOffline || isSlow ? 'show' : 'hide'}`}>
      <div className="global-loader-card">
        {/* Spinning ring */}
        <div className="global-loader-spinner">
          <svg viewBox="0 0 50 50" className="spinner-svg">
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              className="spinner-circle"
            />
          </svg>
          {isOffline && (
            <div className="offline-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="1" y1="1" x2="23" y2="23" />
                <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
                <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
                <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
                <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                <line x1="12" y1="20" x2="12.01" y2="20" />
              </svg>
            </div>
          )}
        </div>

        <p className="global-loader-message">{message}</p>
        <p className="global-loader-sub">{subMessage}</p>
      </div>
    </div>
  );
};

export default GlobalLoader;
