import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import '../styles/HomePage.css';
import backgroundImage from '../../../assets/backgroundImage.png';
import AboutFSIS from '../sections/AboutFSIS';
import HowItWorks from '../sections/HowItWorks';
import FeaturePage from '../sections/FeaturePage';
import WatchUsOnYoutube from '../sections/WatchUsOnYoutube';
import CTA from '../sections/CTA';
import Footer from '../sections/Footer';
import { ArrowRight, Download, ChevronDown } from 'lucide-react';
import AndroidIcon from '../../../components/ui/AndroidIcon';
import { getUserSession } from '../../../utils/userSession';

const APK_DOWNLOAD_FILENAME = 'FSIS-Mobile-App.apk';
const APK_DOWNLOAD_PATH = `${import.meta.env.BASE_URL}fsis-mobile-app.apk`;
const DOWNLOAD_STATUS_TIMEOUT_MS = 3500;

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isNativeApp = Capacitor.isNativePlatform();
  const hasActiveSession = Boolean(getUserSession());
  const [isApkDownloadStarting, setIsApkDownloadStarting] = useState(false);
  const downloadStatusTimerRef = useRef(null);

  useEffect(() => {
    if (isNativeApp && hasActiveSession) {
      navigate('/dashboard', { replace: true });
    }
  }, [hasActiveSession, isNativeApp, navigate]);

  useEffect(() => {
    return () => {
      if (downloadStatusTimerRef.current) {
        window.clearTimeout(downloadStatusTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (location.hash === '#about') {
      const element = document.getElementById('about');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (!location.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  const handleApkDownload = () => {
    setIsApkDownloadStarting(true);

    if (downloadStatusTimerRef.current) {
      window.clearTimeout(downloadStatusTimerRef.current);
    }

    downloadStatusTimerRef.current = window.setTimeout(() => {
      setIsApkDownloadStarting(false);
      downloadStatusTimerRef.current = null;
    }, DOWNLOAD_STATUS_TIMEOUT_MS);
  };

  return (
    <div className="homepage-container">
      {/* Main Content / Hero Section */}
      <main 
        className="hero-section" 
        style={{ 
          backgroundImage: `linear-gradient(to right, rgba(17, 24, 39, 0.95) 0%, rgba(17, 24, 39, 0.8) 40%, rgba(17, 24, 39, 0.3) 100%), url(${backgroundImage})` 
        }}
      >
        <div className="hero-content">
          <h1 className="hero-title">
            Redefining <br/> Convenience in <br/>
            <span className="highlight-text">Government Transactions</span>
          </h1>
          <p className="hero-subtitle">
            Empowering Every Filipino with One-Click to Public Services.<br/>
            Streamline your fire safety permits and<br/>
            certificates today.
          </p>
          <div className="hero-actions">
            {!isNativeApp && (
              <a
                className="btn-download apk-download-button"
                href={APK_DOWNLOAD_PATH}
                download={APK_DOWNLOAD_FILENAME}
                onClick={handleApkDownload}
                aria-label={`Download ${APK_DOWNLOAD_FILENAME} for Android`}
              >
                <AndroidIcon />
                <span className="apk-download-label">Download Android APK</span>
                <Download className="apk-download-icon" size={20} strokeWidth={2.2} aria-hidden="true" />
              </a>
            )}
            <button className="btn-start" onClick={() => navigate(hasActiveSession ? '/dashboard' : '/signin')}>
              Start your Application
              <ArrowRight size={20} strokeWidth={2} className="arrow-icon" />
            </button>
          </div>
        </div>

        {isApkDownloadStarting && (
          <div className="apk-download-status" role="status" aria-live="polite">
            Downloading {APK_DOWNLOAD_FILENAME}...
          </div>
        )}

        {/* Scroll Indicator */}
        <div 
          className="scroll-indicator" 
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Scroll down"
        >
          <ChevronDown className="scroll-icon" size={36} strokeWidth={2} />
        </div>
      </main>
      
      <AboutFSIS standalone={false} />
      <HowItWorks />
      <FeaturePage />
      <WatchUsOnYoutube />
      <CTA />
      <Footer />
    </div>
  );
};

export default HomePage;
