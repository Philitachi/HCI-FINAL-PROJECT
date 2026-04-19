import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

const getFocusableElements = (container) => {
  if (!container) return [];

  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter((element) => {
    const isHidden = element.offsetParent === null && element !== document.activeElement;
    return !isHidden && element.getAttribute('aria-hidden') !== 'true';
  });
};

const useModalFocusTrap = (isOpen, options = {}) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);
  const onEscapeRef = useRef(options.onEscape);
  const initialFocusRef = options.initialFocusRef;

  useEffect(() => {
    onEscapeRef.current = options.onEscape;
  }, [options.onEscape]);

  useEffect(() => {
    if (!isOpen) return undefined;

    previousFocusRef.current = document.activeElement;

    const focusTimer = window.setTimeout(() => {
      const preferredFocus = initialFocusRef?.current;

      if (preferredFocus && !preferredFocus.disabled) {
        preferredFocus.focus();
        return;
      }

      const focusableElements = getFocusableElements(modalRef.current);
      const firstFocusableElement = focusableElements[0];

      if (firstFocusableElement) {
        firstFocusableElement.focus();
      } else {
        modalRef.current?.focus();
      }
    }, 0);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        const onEscape = onEscapeRef.current;

        if (onEscape) {
          event.preventDefault();
          onEscape(event);
        }
        return;
      }

      if (event.key !== 'Tab' || !modalRef.current) return;

      const focusableElements = getFocusableElements(modalRef.current);

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

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);

      const previousFocus = previousFocusRef.current;

      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus();
      }
    };
  }, [isOpen, initialFocusRef]);

  return modalRef;
};

export default useModalFocusTrap;
