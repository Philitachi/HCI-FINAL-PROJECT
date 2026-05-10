import React, { useEffect, useRef } from 'react';
import { CheckCircle2 } from 'lucide-react';

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(', ');

const ComplaintSuccessModal = ({ isOpen, onClose }) => {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previouslyFocusedElement = document.activeElement;
    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    const handleModalKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !modalRef.current) return;

      const focusableElements = Array.from(
        modalRef.current.querySelectorAll(FOCUSABLE_SELECTOR)
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="complaint-success-overlay">
      <div
        className="complaint-success-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="complaint-success-title"
        aria-describedby="complaint-success-message"
        tabIndex="-1"
        ref={modalRef}
      >
        <div className="complaint-success-icon" aria-hidden="true">
          <CheckCircle2 size={46} strokeWidth={2.2} />
        </div>
        <h2 id="complaint-success-title">Complaint Submitted!</h2>
        <p id="complaint-success-message">
          Your complaint has been successfully submitted to the Bureau of Fire Protection.
          The concerned Bureau of Fire Protection (BFP) office will review your report and respond as soon as possible
          through the email address you provided.
        </p>
        <button
          type="button"
          className="complaint-success-button"
          onClick={onClose}
          ref={closeButtonRef}
        >
          Submit another complaint
        </button>
      </div>
    </div>
  );
};

export default ComplaintSuccessModal;
