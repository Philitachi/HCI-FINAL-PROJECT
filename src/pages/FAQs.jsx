import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNavigationBar2 from '../components/TopNavigationBar2';
import './FAQs.css';
import './Dashboard/dashboard.css';

const FAQItem = ({ question, answer, isActive, onClick }) => {
  return (
    <div className={`faq-item ${isActive ? 'active' : ''}`}>
      <button className="faq-question" onClick={onClick}>
        {question}
        <svg className="faq-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <div className="faq-answer-container">
        <div className="faq-answer-inner">
          <div className="faq-answer-text">
            {/* Split answers by \n for multiple paragraphs if needed */}
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
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
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

          <div className="faq-contact-box">
            <h3>Still have questions?</h3>
            <p>If you cannot find answer to your question in our FAQ, you can always contact our support team.</p>
            <button className="faq-contact-btn" onClick={() => navigate('/complaint')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Contact Support
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FAQs;
