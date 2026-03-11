import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/Logo.svg';
import './TopNavigationBar.css';

const TopNavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('home');
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const aboutEl = document.getElementById('about');
      if (aboutEl) {
        // Evaluate if the 'about' component is primarily currently in the viewport
        const rect = aboutEl.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2) {
          setActiveSection('about');
        } else {
          setActiveSection('home');
        }
      } else {
        // Fallbacks for other pages like SignIn, SignUp
        if (location.pathname === '/about' || location.hash === '#about') {
          setActiveSection('about');
        } else {
          setActiveSection('home');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger instantly

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  useEffect(() => {
    if (navRef.current) {
      const activeEl = navRef.current.querySelector(`.nav-link.${activeSection}`);
      if (activeEl) {
        setSliderStyle({
          left: activeEl.offsetLeft,
          width: activeEl.offsetWidth,
        });
      }
    }
  }, [activeSection, location.pathname]);

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="logo-placeholder" style={{ backgroundColor: 'transparent', padding: 0 }}>
          <img src={logo} alt="Fire Safety Inspection System Logo" style={{ width: '40px', height: '40px' }} />
        </div>
        <span className="brand-text">Fire Safety Inspection System</span>
      </div>
      
      <nav className="navbar-controls">
        <div ref={navRef} style={{ position: 'relative', display: 'flex', gap: '2rem' }}>
          <a href="#home" className={`nav-link home ${activeSection === 'home' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a>
          <a href="#about" className={`nav-link about ${activeSection === 'about' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); navigate('/#about'); }}>About Us</a>
          <div className="nav-slider" style={{ ...sliderStyle, position: 'absolute', bottom: '-4px', height: '2px', backgroundColor: '#06B6D4', transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)' }}></div>
        </div>
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
