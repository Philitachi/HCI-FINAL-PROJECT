import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavigationBar from '../components/TopNavigationBar';
import '../styles/HomePage.css';
import backgroundImage from '../assets/backgroundImage.svg';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      {/* Overlay to darken background image for better text readability */}
      <div className="homepage-overlay"></div>

      <TopNavigationBar />

      {/* Main Content / Hero Section */}
      <main className="hero-section">
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
    </div>
  );
};

export default HomePage;
