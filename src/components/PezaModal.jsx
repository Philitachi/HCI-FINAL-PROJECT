import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './PezaModal.css';
import ExitButton from './exitButton';
import { Landmark } from 'lucide-react';

const PezaModal = ({ onClose, onConfirm }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const previouslyFocusedElement = document.activeElement;
    const focusTimer = window.setTimeout(() => {
      modalRef.current?.focus();
    }, 0);

    const handleModalKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !modalRef.current) return;

      const focusableElements = Array.from(
        modalRef.current.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        modalRef.current.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleModalKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleModalKeyDown);
      if (previouslyFocusedElement instanceof HTMLElement && previouslyFocusedElement.isConnected) {
        previouslyFocusedElement.focus();
      }
    };
  }, [onClose]);

  const modalContent = (
    <div className="peza-modal-overlay" onClick={onClose}>
      <div
        className="peza-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="peza-modal-title"
        aria-describedby="peza-modal-description"
        tabIndex="-1"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="peza-modal-header">
          <div className="peza-modal-icon" aria-hidden="true">
            <Landmark size={28} strokeWidth={2} />
          </div>
          <h3 id="peza-modal-title">PEZA</h3>
          <ExitButton onClick={onClose} />
        </div>
        <div className="peza-modal-body">
          <p id="peza-modal-description">The Philippine Economic Zone Authority (PEZA) is a government agency tasked with promoting investments, extending assistance, registering, granting incentives to, and facilitating the business operations of investors in export-oriented manufacturing and service facilities inside selected areas throughout the country proclaimed by the President of the Philippines as PEZA Special Economic Zones.</p>
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
