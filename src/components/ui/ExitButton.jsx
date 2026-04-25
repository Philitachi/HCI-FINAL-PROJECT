import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ExitButton.css';
import { X } from 'lucide-react';

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
      <X size={16} strokeWidth={3} />
    </button>
  );
};

export default ExitButton;
