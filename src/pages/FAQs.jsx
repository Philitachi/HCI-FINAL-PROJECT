import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronDown, Info, CheckCircle2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopNavigationBar2 from '../components/TopNavigationBar2';
import '../styles/FAQs.css';
import './Dashboard/dashboard.css';

const initialContactFormData = {
  name: '',
  email: '',
  subject: '',
  message: ''
};

const requiredContactFields = [
  { name: 'name', label: 'Name' },
  { name: 'email', label: 'Email address' },
  { name: 'subject', label: 'Subject' },
  { name: 'message', label: 'Message' }
];

const FAQItem = ({ question, answer, isActive, onClick }) => {
  return (
    <div className={`faq-item ${isActive ? 'active' : ''}`}>
      <button className="faq-question" onClick={onClick}>
        <div className="faq-question-content">
          <div className="faq-icon-wrapper">
            <Info size={20} strokeWidth={2.5} />
          </div>
          <span>{question}</span>
        </div>
        <div className="faq-chevron-wrapper">
          <ChevronDown className="faq-chevron" size={20} strokeWidth={2.5} />
        </div>
      </button>
      <div className="faq-answer-container">
        <div className="faq-answer-inner">
          <div className="faq-answer-text">
            {answer.split('\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [formData, setFormData] = useState(initialContactFormData);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const successModalRef = useRef(null);
  const successCloseButtonRef = useRef(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (fieldErrors[name]) {
      setFieldErrors((currentErrors) => ({
        ...currentErrors,
        [name]: ''
      }));
    }
  };

  const handleSuccessClose = useCallback(() => {
    setIsSubmitted(false);
    setFormData(initialContactFormData);
    setFieldErrors({});
  }, []);

  useEffect(() => {
    if (!isSubmitted) return undefined;

    const previouslyFocusedElement = document.activeElement;
    const focusTimer = window.setTimeout(() => {
      successCloseButtonRef.current?.focus();
    }, 0);

    const handleModalKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleSuccessClose();
        return;
      }

      if (event.key !== 'Tab' || !successModalRef.current) return;

      const focusableElements = Array.from(
        successModalRef.current.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        successModalRef.current.focus();
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
  }, [isSubmitted, handleSuccessClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};

    requiredContactFields.forEach(({ name, label }) => {
      if (!formData[name].trim()) {
        nextErrors[name] = `${label} is required.`;
      }
    });

    if (!nextErrors.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitted(true);
  };

  const faqsList = [
    {
      question: "How do I apply for a new Fire Safety Inspection Certificate (FSIC)?",
      answer: "To apply for a new FSIC, navigate to the 'New Application' section in the sidebar. Select 'Apply for certificate', fill out all the required establishment information, and upload the necessary structural and safety documents required for evaluation. Once submitted, your application will be reviewed by your designated local fire station."
    },
    {
      question: "What is the process for renewing my existing FSIC?",
      answer: "You can renew your FSIC by navigating to the 'Renewals' page from the sidebar. Select the establishment that requires renewal, verify that all details are up to date, and submit the current year's assessment fees and other required documents. Renewals are typically processed faster if there are no significant structural modifications to your building."
    },
    {
      question: "How can I check the status of my ongoing application?",
      answer: "You can check the real-time status of your application under the 'My Applications' tab. It will display tabs indicating the current stage of your application, ranging from 'Completeness Check', 'Assessment', 'Pending Review', down to 'Issuance'. You will also receive an email notification when the status changes."
    },
    {
      question: "What happens if my application is cancelled or declined?",
      answer: "If your application is declined, you can view the specific reasons provided by the evaluator in the 'Cancelled Applications' tab under 'My Applications'. There will be an option to resubmit the application along with any corrected or newly requested documents."
    },
    {
      question: "How do I print my certificate once it's approved?",
      answer: "Once an application moves to the 'Completed Applications' tab, an action button to 'Download / Print Certificate' will be available. You can keep a digital copy or print the high-resolution PDF for your establishment's compliance displaying purposes."
    },
    {
      question: "Where can I find the complete list of requirements?",
      answer: "You can view the full list of required documents for all types of applications by navigating to the 'Requirements' section in the sidebar. The requirements are categorized into Evaluation, Occupancy, and Business Permits to help you prepare the necessary files before starting a new application."
    }
  ];

  return (
    <div className="dashboard-container">
      <TopNavigationBar2 />
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-main-content faqs-content">
          <div className="faqs-header">
            <h1 className="faqs-title">Frequently Asked Questions</h1>
            <p className="faqs-subtitle">Find answers to common questions about your applications and fire safety compliance.</p>
          </div>

          <div className="faqs-accordion-container">
            {faqsList.map((faq, index) => (
              <FAQItem 
                key={index}
                question={faq.question}
                answer={faq.answer}
                isActive={activeIndex === index}
                onClick={() => toggleFAQ(index)}
              />
            ))}
          </div>

          <div className="modern-contact-form-container">
            <div className="contact-form-header">
              <div className="contact-icon-container">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <div className="contact-header-text">
                <h3>Still have questions?</h3>
                <p>Send us a direct message and our support team will get back to you shortly.</p>
              </div>
            </div>

            <form className="contact-form-body animate-fade-in" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="faq-contact-name">Your Name <span className="required-asterisk">*</span></label>
                  <input
                    id="faq-contact-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="E.g. John Doe"
                    required
                    aria-invalid={Boolean(fieldErrors.name)}
                    aria-describedby={fieldErrors.name ? 'faq-contact-name-error' : undefined}
                    className={`modern-input ${fieldErrors.name ? 'input-error' : ''}`}
                  />
                  {fieldErrors.name && <span className="faq-field-error" id="faq-contact-name-error">{fieldErrors.name}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="faq-contact-email">Email Address <span className="required-asterisk">*</span></label>
                  <input
                    id="faq-contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="E.g. john@example.com"
                    required
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={fieldErrors.email ? 'faq-contact-email-error' : undefined}
                    className={`modern-input ${fieldErrors.email ? 'input-error' : ''}`}
                  />
                  {fieldErrors.email && <span className="faq-field-error" id="faq-contact-email-error">{fieldErrors.email}</span>}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="faq-contact-subject">Subject <span className="required-asterisk">*</span></label>
                <input
                  id="faq-contact-subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="How can we help you?"
                  required
                  aria-invalid={Boolean(fieldErrors.subject)}
                  aria-describedby={fieldErrors.subject ? 'faq-contact-subject-error' : undefined}
                  className={`modern-input ${fieldErrors.subject ? 'input-error' : ''}`}
                />
                {fieldErrors.subject && <span className="faq-field-error" id="faq-contact-subject-error">{fieldErrors.subject}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="faq-contact-message">Message <span className="required-asterisk">*</span></label>
                <textarea
                  id="faq-contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Type your message here..."
                  rows="4"
                  required
                  aria-invalid={Boolean(fieldErrors.message)}
                  aria-describedby={fieldErrors.message ? 'faq-contact-message-error' : undefined}
                  className={`modern-textarea ${fieldErrors.message ? 'input-error' : ''}`}
                ></textarea>
                {fieldErrors.message && <span className="faq-field-error" id="faq-contact-message-error">{fieldErrors.message}</span>}
              </div>
              <div className="form-submit-row">
                <button type="submit" className="submit-contact-btn">
                  <span>Send Message</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      {isSubmitted && (
        <div className="faq-success-overlay">
          <div
            className="faq-success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="faq-success-title"
            aria-describedby="faq-success-message"
            tabIndex="-1"
            ref={successModalRef}
          >
            <div className="faq-success-icon" aria-hidden="true">
              <CheckCircle2 size={46} strokeWidth={2.2} />
            </div>
            <h2 id="faq-success-title">Message Sent!</h2>
            <p id="faq-success-message">
              We've received your message. The Bureau of Fire Protection will respond
              to the email address you provided as soon as possible.
            </p>
            <button
              type="button"
              className="faq-success-button"
              onClick={handleSuccessClose}
              ref={successCloseButtonRef}
            >
              Send another message
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQs;
