import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CTA.css';

const CTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section id="cta-section" className="cta-section" ref={sectionRef}>
      <div className={`cta-container ${isVisible ? 'is-visible' : ''}`}>
        
        {/* Decorative Background Elements */}
        <div className="cta-glow cta-glow-left"></div>
        <div className="cta-glow cta-glow-right"></div>

        <div className="cta-content fade-in-up">
          <h2 className="cta-title">Ready to get started?</h2>
          
          <p className="cta-subtitle">
            Join hundreds of businesses already using FSIS to streamline their fire safety compliance. 
            Start your application today and experience the difference.
          </p>

          <button 
            className="cta-button" 
            onClick={() => navigate('/signin')}
          >
            Start your Application
            <svg 
              className="cta-button-icon" 
              width="20" height="20" 
              viewBox="0 0 24 24" fill="none" 
              stroke="currentColor" strokeWidth="2" 
              strokeLinecap="round" strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
};

export default CTA;
