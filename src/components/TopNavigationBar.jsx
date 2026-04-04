import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/Logo.svg';
import './TopNavigationBar.css';
import { Sun, Moon, Home, FileText, LogIn, UserPlus } from 'lucide-react';

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
        <span className="brand-text">
          <span className="brand-accent">Fire Safety</span> Inspection System
        </span>
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
          <Sun className="sun-icon" size={20} strokeWidth={2} style={{ transform: isDarkMode ? 'rotate(-90deg) scale(0)' : 'rotate(0) scale(1)', opacity: isDarkMode ? 0 : 1 }} />
          <Moon className="moon-icon" size={20} strokeWidth={2} style={{ transform: isDarkMode ? 'rotate(0) scale(1)' : 'rotate(90deg) scale(0)', opacity: isDarkMode ? 1 : 0 }} />
        </button>
        <button className="btn-signin" onClick={() => navigate('/signin')}>Sign In</button>
        <button className="btn-signup" onClick={() => navigate('/signup')}>Sign up</button>
      </nav>

      {/* Mobile Controls (always visible on mobile) */}
      <div className="mobile-nav-controls">
        <button className="theme-toggle" aria-label="Toggle dark mode" onClick={() => setIsDarkMode(!isDarkMode)}>
          <Sun className="sun-icon" size={20} strokeWidth={2} style={{ transform: isDarkMode ? 'rotate(-90deg) scale(0)' : 'rotate(0) scale(1)', opacity: isDarkMode ? 0 : 1 }} />
          <Moon className="moon-icon" size={20} strokeWidth={2} style={{ transform: isDarkMode ? 'rotate(0) scale(1)' : 'rotate(90deg) scale(0)', opacity: isDarkMode ? 1 : 0 }} />
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
          <Home size={18} strokeWidth={2} />
          Home
        </a>
        <a className={`mobile-drawer-link ${activeSection === 'submit-complaint' ? 'active' : ''}`} onClick={() => handleMobileNav('/submit-complaint')}>
          <FileText size={18} strokeWidth={2} />
          Submit a Complaint
        </a>
        <div className="mobile-drawer-divider"></div>
        <a className="mobile-drawer-link" onClick={() => handleMobileNav('/signin')}>
          <LogIn size={18} strokeWidth={2} />
          Sign In
        </a>
        <a className="mobile-drawer-link signup" onClick={() => handleMobileNav('/signup')}>
          <UserPlus size={18} strokeWidth={2} />
          Sign Up
        </a>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>}
    </header>
  );
};

export default TopNavigationBar;
