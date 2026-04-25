import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import '../styles/CTA.css';
import { getUserSession } from '../../../utils/userSession';

const CTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const navigate = useNavigate();
  const ctaTarget = getUserSession() ? '/dashboard' : '/signin';

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
            onClick={() => navigate(ctaTarget)}
          >
            Start your Application
            <ArrowRight size={20} strokeWidth={2} className="cta-button-icon" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default CTA;
