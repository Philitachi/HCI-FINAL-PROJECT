import React, { useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Network } from '@capacitor/network';
import './GlobalLoader.css';

const RECONNECTED_TOAST_DURATION = 2800;
const OFFLINE_BANNER_DURATION = 5 * 1000;

const getBrowserIsOffline = () => (
  typeof navigator !== 'undefined' ? !navigator.onLine : false
);

const GlobalLoader = () => {
  const [isOffline, setIsOffline] = useState(getBrowserIsOffline);
  const [showOfflineBanner, setShowOfflineBanner] = useState(getBrowserIsOffline);
  const [connectionToastMode, setConnectionToastMode] = useState(null);
  const hasMountedRef = useRef(false);
  const isOfflineRef = useRef(getBrowserIsOffline());

  useEffect(() => {
    let isActive = true;
    let nativeListenerHandle = null;

    const applyConnectionStatus = (isConnected, shouldShowReconnectToast = true) => {
      if (!isActive) return;

      const nextIsOffline = !isConnected;
      const wasOffline = isOfflineRef.current;
      isOfflineRef.current = nextIsOffline;
      setIsOffline(nextIsOffline);

      if (nextIsOffline) {
        if (!wasOffline) {
          setShowOfflineBanner(true);
          setConnectionToastMode(null);
        }
      } else if (shouldShowReconnectToast && hasMountedRef.current && wasOffline) {
        setShowOfflineBanner(false);
        setConnectionToastMode('online');
      } else {
        setShowOfflineBanner(false);
        setConnectionToastMode(null);
      }
    };

    const handleOnline = () => {
      applyConnectionStatus(true);
    };

    const handleOffline = () => {
      applyConnectionStatus(false);
    };

    if (Capacitor.isNativePlatform()) {
      void Network.getStatus()
        .then((status) => {
          applyConnectionStatus(status.connected, false);
        })
        .catch(() => {
          applyConnectionStatus(!getBrowserIsOffline(), false);
        });

      void Network.addListener('networkStatusChange', (status) => {
        applyConnectionStatus(status.connected);
      }).then((listenerHandle) => {
        if (isActive) {
          nativeListenerHandle = listenerHandle;
        } else {
          void listenerHandle.remove();
        }
      }).catch(() => {
        if (!isActive) return;

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
      });
    } else {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    hasMountedRef.current = true;

    return () => {
      isActive = false;

      if (nativeListenerHandle) {
        void nativeListenerHandle.remove();
      }

      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isOffline || !showOfflineBanner) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setShowOfflineBanner(false);

      if (isOfflineRef.current) {
        setConnectionToastMode('offline');
      }
    }, OFFLINE_BANNER_DURATION);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isOffline, showOfflineBanner]);

  useEffect(() => {
    if (connectionToastMode !== 'online') {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setConnectionToastMode(null);
    }, RECONNECTED_TOAST_DURATION);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [connectionToastMode]);

  const toastMessage = connectionToastMode === 'offline'
    ? "You're offline. We'll update this when your internet is back."
    : 'Back online. You can try again now.';

  return (
    <>
      <div
        className={`network-status-banner ${showOfflineBanner ? 'show' : ''}`}
        role="status"
        aria-live="polite"
        aria-hidden={!showOfflineBanner}
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
        className={`network-status-toast ${connectionToastMode ? 'show' : ''} ${connectionToastMode || ''}`}
        role="status"
        aria-live="polite"
        aria-hidden={!connectionToastMode}
      >
        <span className="network-status-toast-dot" aria-hidden="true" />
        {toastMessage}
      </div>
    </>
  );
};

export default GlobalLoader;
