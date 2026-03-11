import React from 'react';
import { useNavigate } from 'react-router-dom';
import './exitButton.css';

const ExitButton = ({ onClick, to }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button 
      className="exit-btn-custom" 
      onClick={handleClose}
      aria-label="Close"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  );
};

export default ExitButton;
