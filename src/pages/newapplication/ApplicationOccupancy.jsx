import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import TopNavigationBar2 from '../../components/TopNavigationBar2';
import SharedApplicationForm from '../../components/SharedApplicationForm';
import '../../styles/NewApplication.css';
import '../Dashboard/dashboard.css';

const ApplicationOccupancy = () => {
  const [selectedSubOption, setSelectedSubOption] = useState(null);

  const subOptions = [
    { id: 'fsic_occ_permit', title: 'FSIC - OCCUPANCY PERMIT', desc: 'Fire Safety Inspection Certificate (FSIC - Occupancy Permit)' }
  ];

  return (
    <div className="dashboard-container">
      <TopNavigationBar2 />
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-main-content">
          <div className="new-app-header">
            <h1 className="new-app-title">New Application - Occupancy</h1>
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
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                              <line x1="12" y1="18" x2="12" y2="12"></line>
                              <line x1="9" y1="15" x2="15" y2="15"></line>
                            </svg>
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
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApplicationOccupancy;
