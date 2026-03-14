import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TopNavigationBar from '../components/TopNavigationBar';
import '../styles/HomePage.css';
import backgroundImage from '../assets/backgroundImage.svg';
import AboutFSIS from './AboutFSIS';
import HowItWorks from './HowItWorks';
import FeaturePage from './FeaturePage';
import WatchUsOnYoutube from './watchusonYoutube';

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <div className="homepage-container">
      <TopNavigationBar />

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
            <button className="btn-download">Download App</button>
            <button className="btn-start" onClick={() => navigate('/signin')}>
              Start Application
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="arrow-icon">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </main>
      
      <AboutFSIS standalone={false} />
      <HowItWorks />
      <FeaturePage />
      <WatchUsOnYoutube />
    </div>
  );
};

export default HomePage;
