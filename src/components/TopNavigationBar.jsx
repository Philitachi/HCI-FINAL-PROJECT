import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/Logo.svg';
import './TopNavigationBar.css';

const TopNavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('home');
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') !== 'light';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const complaintEl = document.getElementById('submit-complaint');
    if (complaintEl) {
      const handleScroll = () => {
        const rect = complaintEl.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2) {
          setActiveSection('submit-complaint');
        } else {
          setActiveSection('home');
        }
      };
      window.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      if (location.pathname === '/submit-complaint' || location.hash === '#submit-complaint') {
        setActiveSection('submit-complaint');
      } else {
        setActiveSection('home');
      }
    }
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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(e.target) && !e.target.closest('.hamburger-btn')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  const handleMobileNav = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="logo-placeholder" style={{ backgroundColor: 'transparent', padding: 0 }}>
          <img src={logo} alt="Fire Safety Inspection System Logo" style={{ width: '40px', height: '40px' }} />
        </div>
        <span className="brand-text">Fire Safety Inspection System</span>
      </div>
      
      {/* Desktop Nav */}
      <nav className="navbar-controls desktop-nav">
        <div ref={navRef} style={{ position: 'relative', display: 'flex', gap: '2rem' }}>
          <a href="#home" className={`nav-link home ${activeSection === 'home' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a>
          <a href="#submit-complaint" className={`nav-link submit-complaint ${activeSection === 'submit-complaint' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); navigate('/submit-complaint'); }}>Submit a Complaint</a>
          <div className="nav-slider" style={{ ...sliderStyle, position: 'absolute', bottom: '-4px', height: '2px', backgroundColor: isDarkMode ? '#06B6D4' : '#0369A1', transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)' }}></div>
        </div>
        <span className="divider">|</span>
        <button className="theme-toggle" aria-label="Toggle dark mode" onClick={() => setIsDarkMode(!isDarkMode)}>
          <svg 
            className="sun-icon" 
            style={{ transform: isDarkMode ? 'rotate(-90deg) scale(0)' : 'rotate(0) scale(1)', opacity: isDarkMode ? 0 : 1 }}
            width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg 
            className="moon-icon"
            style={{ transform: isDarkMode ? 'rotate(0) scale(1)' : 'rotate(90deg) scale(0)', opacity: isDarkMode ? 1 : 0 }}
            width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
        <button className="btn-signin" onClick={() => navigate('/signin')}>Sign In</button>
        <button className="btn-signup" onClick={() => navigate('/signup')}>Sign up</button>
      </nav>

      {/* Mobile Controls (always visible on mobile) */}
      <div className="mobile-nav-controls">
        <button className="theme-toggle" aria-label="Toggle dark mode" onClick={() => setIsDarkMode(!isDarkMode)}>
          <svg 
            className="sun-icon" 
            style={{ transform: isDarkMode ? 'rotate(-90deg) scale(0)' : 'rotate(0) scale(1)', opacity: isDarkMode ? 0 : 1 }}
            width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg 
            className="moon-icon"
            style={{ transform: isDarkMode ? 'rotate(0) scale(1)' : 'rotate(90deg) scale(0)', opacity: isDarkMode ? 1 : 0 }}
            width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
        <button className={`hamburger-btn ${isMobileMenuOpen ? 'open' : ''}`} aria-label="Toggle menu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`} ref={mobileMenuRef}>
        <a className={`mobile-drawer-link ${activeSection === 'home' ? 'active' : ''}`} onClick={() => handleMobileNav('/')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          Home
        </a>
        <a className={`mobile-drawer-link ${activeSection === 'submit-complaint' ? 'active' : ''}`} onClick={() => handleMobileNav('/submit-complaint')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
          Submit a Complaint
        </a>
        <div className="mobile-drawer-divider"></div>
        <a className="mobile-drawer-link" onClick={() => handleMobileNav('/signin')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
          Sign In
        </a>
        <a className="mobile-drawer-link signup" onClick={() => handleMobileNav('/signup')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
          Sign Up
        </a>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>}
    </header>
  );
};

export default TopNavigationBar;
