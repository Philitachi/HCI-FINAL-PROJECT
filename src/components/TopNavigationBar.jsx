import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Logo.svg';
import './TopNavigationBar.css';

const TopNavigationBar = () => {
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="logo-placeholder" style={{ backgroundColor: 'transparent', padding: 0 }}>
          <img src={logo} alt="Fire Safety Inspection System Logo" style={{ width: '40px', height: '40px' }} />
        </div>
        <span className="brand-text">Fire Safety Inspection System</span>
      </div>
      
      <nav className="navbar-controls">
        <a href="#home" className="nav-link active">Home</a>
        <span className="divider">|</span>
        <button className="theme-toggle" aria-label="Toggle dark mode">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
        <button className="btn-signin" onClick={() => navigate('/signin')}>Sign In</button>
        <button className="btn-signup" onClick={() => navigate('/signup')}>Sign up</button>
      </nav>
    </header>
  );
};

export default TopNavigationBar;
