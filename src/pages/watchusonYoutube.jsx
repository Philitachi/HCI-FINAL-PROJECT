import React, { useEffect, useRef, useState } from 'react';
import '../styles/watchusonYoutube.css';
import logo from '../assets/Logo.svg';

const videos = [
  { 
    title: "BFP-FSIS Customer Relation Office", 
    duration: "2:15" 
  },
  { 
    title: "BFP-FSIS Assesor", 
    duration: "1:45" 
  },
  { 
    title: "BFP-FSIS Inspector", 
    duration: "3:20" 
  }
];

const WatchUsOnYoutube = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section id="youtube-section" className="youtube-section" ref={sectionRef}>
      <div className={`youtube-container ${isVisible ? 'is-visible' : ''}`}>
        
        {/* Header Section */}
        <div className="youtube-header fade-in-up">
          <h2 className="youtube-title">Watch us on YouTube</h2>
          <p className="youtube-subtitle">
            Discover more about the Fire Safety Inspection System (FSIS) through our featured videos.<br className="hidden-mobile" />
            Learn how to apply, track your application, and get tips for a smooth experience.
          </p>
        </div>

        {/* Video Grid */}
        <div className="youtube-grid">
          {videos.map((video, index) => (
            <div 
              className="youtube-card fade-in-up" 
              key={index} 
              style={{ transitionDelay: `${0.2 + (index * 0.15)}s` }}
            >
              <div className="youtube-thumbnail">
                {/* Top Title Bar Overlay */}
                <div className="yt-card-topbar">
                  <div className="yt-card-avatar">
                    <img src={logo} alt="BFP Logo" />
                  </div>
                  <span className="yt-card-title">{video.title}</span>
                </div>
                
                {/* Center Play Button Overlay */}
                <div className="yt-card-center-play">
                  <svg viewBox="0 0 68 48" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path className="yt-bg" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"></path>
                    <path d="M 45,24 27,14 27,34" fill="#fff"></path>
                  </svg>
                </div>
                
                {/* Duration Label */}
                <div className="yt-card-duration">{video.duration}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Section */}
        <div className="youtube-footer fade-in-up" style={{ transitionDelay: '0.7s' }}>
          Watch more on <a href="https://www.youtube.com/@bxcore1360" target="_blank" rel="noreferrer" className="youtube-link">https://www.youtube.com/@bxcore1360</a>
        </div>

      </div>
    </section>
  );
};

export default WatchUsOnYoutube;
