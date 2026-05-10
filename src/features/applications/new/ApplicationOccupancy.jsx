import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../../components/layout/Sidebar';
import TopNavigationBar2 from '../../../components/layout/TopNavigationBar2';
import SharedApplicationForm from '../components/SharedApplicationForm';
import { FileText } from 'lucide-react';
import '../styles/NewApplication.css';
import '../../dashboard/styles/dashboard.css';

const getDisplayApplicationTitle = (title = '') => (
  title.replace(/^FSIC\b/i, 'Fire Safety Inspection Certificate (FSIC)')
);

const ApplicationOccupancy = () => {
  const location = useLocation();
  const draftState = location.state || {};

  const subOptions = [
    { id: 'fsic_occ_permit', title: 'FSIC - OCCUPANCY PERMIT', desc: 'Fire Safety Inspection Certificate (FSIC) - Occupancy Permit' }
  ];

  const [selectedSubOption, setSelectedSubOption] = useState(() => {
    if (draftState.draftId && draftState.applicationType) {
      const match = subOptions.find(s => s.title === draftState.applicationType);
      return match || subOptions[0];
    }
    return null;
  });

  return (
    <div className="dashboard-container">
      <TopNavigationBar2 />
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-main-content">
          <div className="new-app-header">
            <h1 className="new-app-title">New Application - Occupancy</h1>
            <p className="new-app-subtitle">
              {!selectedSubOption ? 'Select one of the application categories' : `APPLICATION FORM - ${getDisplayApplicationTitle(selectedSubOption.title)}`}
            </p>
          </div>

          <div className="new-app-content">
            {!selectedSubOption ? (
              <div className="new-app-card">
                 <div className="step-content animate-fade-in">
                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary-color)'}}>Select Specific Option</h3>
                    <div className="sub-category-list">
                      {subOptions.map(sub => (
                        <button
                          type="button"
                          key={sub.id}
                          className="sub-category-card custom-hover"
                          aria-pressed={selectedSubOption?.id === sub.id}
                          onClick={() => setSelectedSubOption(sub)}
                        >
                          <div className="sub-category-icon" aria-hidden="true">
                            <FileText size={24} strokeWidth={2} />
                          </div>
                          <div className="category-text">
                            <h3>{getDisplayApplicationTitle(sub.title)}</h3>
                            <p>{sub.desc}</p>
                          </div>
                        </button>
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

export default ApplicationOccupancy;
