import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';
import logo from '../assets/Logo.svg';

const Footer = () => {
  return (
    <footer className="fsis-footer">
      <div className="footer-content">
        <div className="footer-section brand-section">
          <div className="footer-logo">
            <img src={logo} alt="FSIS Logo" />
            <h2>FSIS</h2>
          </div>
          <p className="brand-description">
            Fire Safety Inspection System - Making compliance faster, transparent, and accessible
          </p>
        </div>

        <div className="footer-section links-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/#about">About Us</Link></li>
            <li><Link to="/signin">Sign In</Link></li>
            <li><Link to="/signup">Sign up</Link></li>
          </ul>
        </div>

        <div className="footer-section contact-section">
          <h3>Contact</h3>
          <p>
            For more inquiries and support, please contact your local
            Bureau of Fire Protection office
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-divider"></div>
        <p className="copyright">© 2026 Fire Safety Inspection System. All rights reserved.</p>
        <p className="disclaimer">
          We are dedicated to enforcing the Fire Code and related laws, and to responding swiftly to emergencies and disasters.<br />
          Registered with <a href="https://www.bsp.gov.ph" target="_blank" rel="noopener noreferrer" className="bsp-link">Bangko Sentral ng Pilipinas</a> as an Operator of Payment Services under the National Payment Systems Act.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
