import React from 'react';
import { createPortal } from 'react-dom';
import './PezaModal.css';
import ExitButton from './exitButton';

const PezaModal = ({ onClose, onConfirm }) => {
  const modalContent = (
    <div className="peza-modal-overlay" onClick={onClose}>
      <div className="peza-modal" onClick={(e) => e.stopPropagation()}>
        <div className="peza-modal-header">
          <div className="peza-modal-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <h3>PEZA</h3>
          <ExitButton onClick={onClose} />
        </div>
        <div className="peza-modal-body">
          <p>The Philippine Economic Zone Authority (PEZA) is a government agency tasked with promoting investments, extending assistance, registering, granting incentives to, and facilitating the business operations of investors in export-oriented manufacturing and service facilities inside selected areas throughout the country proclaimed by the President of the Philippines as PEZA Special Economic Zones.</p>
        </div>
        <div className="peza-modal-actions">
          <button type="button" className="peza-btn-cancel" onClick={onClose}>CANCEL</button>
          <button type="button" className="peza-btn-confirm" onClick={onConfirm}>YES, THIS IS PEZA</button>
        </div>
      </div>
    </div>
  );

  // Safely mount to the #root div so it covers everything and escapes all CSS transforms 
  const target = document.getElementById('root') || document.body;
  return createPortal(modalContent, target);
};

export default PezaModal;
