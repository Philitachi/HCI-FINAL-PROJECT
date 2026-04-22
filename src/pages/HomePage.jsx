import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import '../styles/HomePage.css';
import backgroundImage from '../assets/backgroundImage.png';
import AboutFSIS from './AboutFSIS';
import HowItWorks from './HowItWorks';
import FeaturePage from './FeaturePage';
import WatchUsOnYoutube from './watchusonYoutube';
import CTA from './CTA';
import Footer from './Footer';
import { ArrowRight } from 'lucide-react';
import { getUserSession } from '../utils/userSession';

const AndroidIcon = () => (
  <svg
    className="android-icon"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M7.3 8.4h9.4c1.3 0 2.3 1 2.3 2.3v6.6c0 .7-.5 1.2-1.2 1.2h-1.3V21c0 .6-.4 1-1 1s-1-.4-1-1v-2.5h-5V21c0 .6-.4 1-1 1s-1-.4-1-1v-2.5H6.2c-.7 0-1.2-.5-1.2-1.2v-6.6c0-1.3 1-2.3 2.3-2.3Z" />
    <path d="M7.5 7.1 6 4.5c-.2-.3-.1-.6.2-.8.3-.2.6-.1.8.2l1.5 2.6c1-.5 2.2-.8 3.5-.8s2.5.3 3.5.8L17 3.9c.2-.3.5-.4.8-.2.3.2.4.5.2.8l-1.5 2.6c1 .7 1.8 1.6 2.2 2.7H5.3c.4-1.1 1.2-2 2.2-2.7Z" />
    <path d="M9 11.8a.9.9 0 1 0 0-1.8.9.9 0 0 0 0 1.8Zm6 0a.9.9 0 1 0 0-1.8.9.9 0 0 0 0 1.8Z" />
  </svg>
);

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isNativeApp = Capacitor.isNativePlatform();
  const hasActiveSession = Boolean(getUserSession());
  // Place the real APK at public/fsis-mobile-app.apk.
  const apkDownloadPath = `${import.meta.env.BASE_URL}fsis-mobile-app.apk`;

  useEffect(() => {
    if (isNativeApp && hasActiveSession) {
      navigate('/dashboard', { replace: true });
    }
  }, [hasActiveSession, isNativeApp, navigate]);

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
    const downloadLink = document.createElement('a');
    downloadLink.href = apkDownloadPath;
    downloadLink.download = 'fsis-mobile-app.apk';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
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
              <button
                className="btn-download"
                onClick={handleApkDownload}
                aria-label="Download Android APK"
              >
                <AndroidIcon />
                Download Android APK
              </button>
            )}
            <button className="btn-start" onClick={() => navigate(hasActiveSession ? '/dashboard' : '/signin')}>
              Start your Application
              <ArrowRight size={20} strokeWidth={2} className="arrow-icon" />
            </button>
          </div>
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
