import React, { useEffect, useRef, useState } from 'react';
import '../styles/FeaturePage.css';

// Importing the illustrations
import FsicSystemImg from '../assets/FSIC Online Application System.svg';
import FastProcessImg from '../assets/Fast & Transparent Process.svg';
import SecureMgmtImg from '../assets/Secure Document Management.svg';
import AssistanceImg from '../assets/Assistance for every business owner.svg';

const features = [
  {
    title: "FSIC Online Application",
    description: "Apply for your Fire Safety Inspection Certificate (FSIC) with ease. Our streamlined digital platform provides a fast, convenient way for business owners to fulfill compliance requirements seamlessly.",
    imgSrc: FsicSystemImg,
    altText: "Online Application System Illustration",
  },
  {
    title: "Fast & Transparent Process",
    description: "Monitor your application status in real-time. Submit requirements, track progress, and receive instant notifications at every milestone—all within a single, centralized dashboard.",
    imgSrc: FastProcessImg,
    altText: "Fast and Transparent Process Illustration",
  },
  {
    title: "Secure Data Management",
    description: "Your privacy is our priority. We employ state-of-the-art encryption to ensure that all submitted documents and business information remain fully protected and compliant with government standards.",
    imgSrc: SecureMgmtImg,
    altText: "Secure Document Management Illustration",
  },
  {
    title: "Dedicated Support",
    description: "Access our comprehensive resource center featuring step-by-step guides, FAQs, and responsive customer assistance tailored to help you navigate the FSIC process quickly and accurately.",
    imgSrc: AssistanceImg,
    altText: "Assistance for Business Owners Illustration",
  }
];

const FeaturePage = () => {
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
    <section id="features" className="features-section" ref={sectionRef}>
      <div className={`features-container ${isVisible ? 'is-visible' : ''}`}>
        
        {/* Main Header */}
        <div className="features-header fade-in-up">
          <h2 className="features-main-title">
            <span className="text-gradient">Why choose our system?</span>
          </h2>
          <p className="features-main-subtitle">
            We make compliance easy with a fast, transparent, and fully secure platform designed for business owners.
          </p>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`feature-item fade-in-up`} 
              style={{ transitionDelay: `${0.1 * (index + 1)}s` }}
            >
              <div className="feature-illustration-float">
                <img src={feature.imgSrc} alt={feature.altText} />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturePage;
