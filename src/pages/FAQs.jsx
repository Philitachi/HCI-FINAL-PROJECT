import React, { useState } from 'react';
import { Home, ChevronDown, Search, Info, CheckCircle2, Eye } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopNavigationBar2 from '../components/TopNavigationBar2';
import '../styles/FAQs.css';
import './Dashboard/dashboard.css';

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
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Simulation of API call
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 5000);
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
          <div className="faqs-hero">
            <div className="faqs-hero-icon-container">
              <Home size={32} strokeWidth={2} />
            </div>
            <div className="faqs-hero-text">
              <h1 className="faqs-title">Frequently Asked Questions</h1>
              <p className="faqs-subtitle">Find answers to common questions about your applications and fire safety compliance.</p>
            </div>
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

            {isSubmitted ? (
              <div className="contact-success-state animate-fade-in">
                <div className="success-icon-wrapper">
                  <CheckCircle2 className="success-icon" size={48} strokeWidth={2} />
                </div>
                <h4>Message Sent!</h4>
                <p>We've received your query and will respond via email as soon as possible.</p>
                <button className="reset-contact-btn" onClick={() => setIsSubmitted(false)}>Send another message</button>
              </div>
            ) : (
              <form className="contact-form-body animate-fade-in" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Your Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="E.g. John Doe" required className="modern-input" />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="E.g. john@example.com" required className="modern-input" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} placeholder="How can we help you?" required className="modern-input" />
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="Type your message here..." rows="4" required className="modern-textarea"></textarea>
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
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FAQs;
