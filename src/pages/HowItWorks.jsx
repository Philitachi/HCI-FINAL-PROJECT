import React, { useEffect, useRef, useState } from 'react';
import '../styles/HowItWorks.css';
import AccessSiteImg from '../assets/Accessthesitedarkmode.svg';
import CreateAccountImg from '../assets/createanaccountdarkmode.svg';
import VerifyIdentityImg from '../assets/verifyyouridentitydarkmode.svg';

const HowItWorks = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false); // Can remove if we only want it to fade in once
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section id="how-it-works" className="hiw-section" ref={sectionRef}>
      <div className={`hiw-content-container ${isVisible ? 'is-visible' : ''}`}>
        
        <div className="hiw-header fade-in-up">
          <h2 className="hiw-section-title">How it works</h2>
          <p className="hiw-section-subtitle">
            Getting started with the Fire Safety Inspection System is quick and simple.
          </p>
        </div>

        <div className="hiw-steps-layout">

          {/* Svg container for the dotted curved lines */}
          <div className="hiw-curves-container hidden-mobile">
            <svg width="100%" height="150" viewBox="0 0 1000 150" preserveAspectRatio="none">
              {/* Curve 1: From Step 1 to Step 2 */}
              <path 
                d="M 150 100 Q 300 -20 450 60" 
                fill="none" 
                stroke="white" 
                strokeWidth="1.5" 
                strokeDasharray="4 4" 
                className="hiw-dotted-line" 
              />
              {/* Curve 2: From Step 2 to Step 3 */}
              <path 
                d="M 550 120 Q 700 180 850 100" 
                fill="none" 
                stroke="white" 
                strokeWidth="1.5" 
                strokeDasharray="4 4" 
                className="hiw-dotted-line" 
              />
            </svg>
          </div>

          {/* Step 1 */}
          <div className="hiw-step fade-in-up" style={{ transitionDelay: '0.2s' }}>
            <div className="hiw-circle-bg">
              <img src={AccessSiteImg} alt="Access the site" className="hiw-illustration" />
            </div>
            <div className="hiw-step-text">
              <h3>Access the site</h3>
              <p>Access the FSIS website through your browser.</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="hiw-step fade-in-up" style={{ transitionDelay: '0.4s' }}>
            <div className="hiw-circle-bg">
              <img src={CreateAccountImg} alt="Create an Account" className="hiw-illustration" />
            </div>
            <div className="hiw-step-text">
              <h3>Create an Account</h3>
              <p>Provide your information to create an account on the platform.</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="hiw-step fade-in-up" style={{ transitionDelay: '0.6s' }}>
            <div className="hiw-circle-bg">
              <img src={VerifyIdentityImg} alt="Verify your Identity" className="hiw-illustration" />
            </div>
            <div className="hiw-step-text">
              <h3>Verify your Identity</h3>
              <p>Email verification will be sent to your registered email address.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
