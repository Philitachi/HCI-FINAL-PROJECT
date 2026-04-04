import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import TopNavigationBar2 from '../../components/TopNavigationBar2';
import SharedApplicationForm from '../../components/SharedApplicationForm';
import { FileText } from 'lucide-react';
import '../../styles/NewApplication.css';
import '../Dashboard/dashboard.css';

const ApplicationEvaluation = () => {
  const location = useLocation();
  const draftState = location.state || {};
  const [selectedSubOption, setSelectedSubOption] = useState(null);

  const subOptions = [
    { id: 'fsec_eval', title: 'FIRE SAFETY EVALUATION CLEARANCE', desc: 'Fire Safety Evaluation Clearance (FSEC)' }
  ];

  // Auto-select sub-option if coming from a draft
  useEffect(() => {
    if (draftState.draftId && draftState.applicationType) {
      const match = subOptions.find(s => s.title === draftState.applicationType);
      if (match) {
        setSelectedSubOption(match);
      } else {
        // Default to first sub-option if no exact match
        setSelectedSubOption(subOptions[0]);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="dashboard-container">
      <TopNavigationBar2 />
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-main-content">
          <div className="new-app-header">
            <h1 className="new-app-title">New Application - Evaluation</h1>
            <p className="new-app-subtitle">
              {!selectedSubOption ? 'Select one of the application categories' : `APPLICATION FORM - ${selectedSubOption.title}`}
            </p>
          </div>

          <div className="new-app-content">
            {!selectedSubOption ? (
              <div className="new-app-card">
                 <div className="step-content animate-fade-in">
                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary-color)'}}>Select Specific Option</h3>
                    <div className="sub-category-list">
                      {subOptions.map(sub => (
                        <div 
                          key={sub.id}
                          className="sub-category-card custom-hover"
                          style={{ cursor: 'pointer' }}
                          onClick={() => setSelectedSubOption(sub)}
                        >
                          <div className="sub-category-icon">
                            <FileText size={24} strokeWidth={2} />
                          </div>
                          <div className="category-text">
                            <h3>{sub.title}</h3>
                            <p>{sub.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                 </div>
              </div>
            ) : (
              <SharedApplicationForm 
                selectedCategoryTitle={selectedSubOption.title}
                onBack={() => setSelectedSubOption(null)}
                draftId={draftState.draftId}
                draftData={draftState.draftData}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApplicationEvaluation;

