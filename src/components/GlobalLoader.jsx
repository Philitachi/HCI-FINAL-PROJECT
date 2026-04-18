import React, { useEffect, useRef, useState } from 'react';
import './GlobalLoader.css';

const RECONNECTED_TOAST_DURATION = 2800;

const GlobalLoader = () => {
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== 'undefined' ? !navigator.onLine : false,
  );
  const [showReconnected, setShowReconnected] = useState(false);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);

      if (hasMountedRef.current) {
        setShowReconnected(true);
      }
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    hasMountedRef.current = true;

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!showReconnected) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setShowReconnected(false);
    }, RECONNECTED_TOAST_DURATION);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [showReconnected]);

  return (
    <>
      <div
        className={`network-status-banner ${isOffline ? 'show' : ''}`}
        role="status"
        aria-live="polite"
        aria-hidden={!isOffline}
      >
        <div className="network-status-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="network-status-icon-svg">
            <path d="M2 8.82A15.92 15.92 0 0 1 12 5c3.55 0 6.83 1.15 9.5 3.09" />
            <path d="M5.5 12.55A10.94 10.94 0 0 1 12 10.5c2.53 0 4.86.86 6.71 2.3" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
            <line x1="3" y1="3" x2="21" y2="21" />
          </svg>
        </div>
        <div className="network-status-copy">
          <p className="network-status-title">No internet connection</p>
          <p className="network-status-subtitle">
            You can keep browsing, but actions that need the internet may fail until you reconnect.
          </p>
        </div>
      </div>

      <div
        className={`network-status-toast ${showReconnected ? 'show' : ''}`}
        role="status"
        aria-live="polite"
        aria-hidden={!showReconnected}
      >
        <span className="network-status-toast-dot" aria-hidden="true" />
        Back online. You can try again now.
      </div>
    </>
  );
};

export default GlobalLoader;
