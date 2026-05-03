import React, { useEffect } from 'react';
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
                className="btn-download apk-download-button"
                onClick={handleApkDownload}
                aria-label="Download Android APK"
              >
                <AndroidIcon />
                <span className="apk-download-label">Download Android APK</span>
                <Download className="apk-download-icon" size={20} strokeWidth={2.2} aria-hidden="true" />
              </button>
            )}
            <button className="btn-start" onClick={() => navigate(hasActiveSession ? '/dashboard' : '/signin')}>
              Start your Application
              <ArrowRight size={20} strokeWidth={2} className="arrow-icon" />
            </button>
          </div>
        </div>

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
