import React, { useEffect, useRef, useState } from 'react';
import '../styles/AboutFSIS.css';
import logo from '../assets/Logo.svg'; // Reuse the logo for the background watermark
import TopNavigationBar from '../components/TopNavigationBar';

const AboutFSIS = ({ standalone = true }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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
      { threshold: 0.2 } // Trigger when 20% of the section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      // Cleanup observer on unmount
      observer.disconnect();
    };
  }, []);
  return (
    <>
      {standalone && <TopNavigationBar />}
      <section id="about" className="about-fsis-container" ref={sectionRef}>
        {/* Background Watermark Logo */}
        <img src={logo} alt="" className={`about-fsis-watermark fade-in-element ${isVisible ? 'is-visible' : ''}`} aria-hidden="true" />
        
        <div className={`about-fsis-content slide-up-element ${isVisible ? 'is-visible' : ''}`}>
          
          {/* Left Column: Text */}
          <div className="about-fsis-text-col">
            <h1 className="about-fsis-title">About FSIS</h1>
            <p className="about-fsis-body">
              The <strong>Fire Safety Inspection System (FSIS)</strong> is a digital platform designed to streamline fire safety compliance and reporting for businesses and individuals. FSIS enables users to easily access government services, submit applications, and track the status of their requests—all from their mobile devices. By leveraging modern technology, FSIS aims to improve transparency, efficiency, and accessibility in fire safety management across the country.
            </p>
          </div>

          {/* Right Column: Video */}
          <div className="about-fsis-video-wrapper">
            
            <div className="yt-thumbnail-container">
              {/* Top Title Bar Overlay */}
              <div className="yt-title-bar">
                <div className="yt-avatar">
                   <img src={logo} alt="BFP Logo" />
                </div>
                <div className="yt-video-title">Bureau of Fire Protection: Fire Safety Information System</div>
              </div>

              {/* YouTube Play Button */}
              <div className="yt-play-button">
                <svg viewBox="0 0 68 48" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <path className="yt-bg" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"></path>
                  <path d="M 45,24 27,14 27,34" fill="#fff"></path>
                </svg>
              </div>

              {/* Bottom Right Duration Label */}
              <div className="yt-duration">3:45</div>
            </div>

          </div>

        </div>
      </section>
    </>
  );
};

export default AboutFSIS;
