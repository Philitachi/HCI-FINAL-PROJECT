import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/HomePage.css';
import backgroundImage from '../assets/backgroundImage.png';
import AboutFSIS from './AboutFSIS';
import HowItWorks from './HowItWorks';
import FeaturePage from './FeaturePage';
import WatchUsOnYoutube from './watchusonYoutube';
import CTA from './CTA';
import Footer from './Footer';
import { ArrowRight } from 'lucide-react';

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
