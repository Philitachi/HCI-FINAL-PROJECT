import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MyApplicationsNav.css';

const MyApplicationsNav = ({ activeMainTab, activeSubTab, children }) => {
  const navigate = useNavigate();

  // Only animate the main tab when it actually changes
  const prevMainTab = sessionStorage.getItem('prevMainTab');
  const shouldAnimateMainTab = prevMainTab !== activeMainTab;
  React.useEffect(() => {
    sessionStorage.setItem('prevMainTab', activeMainTab);
  }, [activeMainTab]);

  return (
    <div className="applications-tabs-container">
      <div className="main-tabs">
        <button 
          className={`tab-btn ${activeMainTab === 'ongoing' ? 'active' : ''} ${activeMainTab === 'ongoing' && shouldAnimateMainTab ? 'animate' : ''}`} 
          onClick={() => navigate('/applications/all')}
        >
          <svg className="tab-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          Ongoing Applications
        </button>
        <button 
          className={`tab-btn ${activeMainTab === 'completed' ? 'active' : ''} ${activeMainTab === 'completed' && shouldAnimateMainTab ? 'animate' : ''}`} 
          onClick={() => navigate('/applications/completed')}
        >
          <svg className="tab-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          Completed Applications
        </button>
        <button 
          className={`tab-btn ${activeMainTab === 'cancelled' ? 'active' : ''} ${activeMainTab === 'cancelled' && shouldAnimateMainTab ? 'animate' : ''}`} 
          onClick={() => navigate('/applications/cancelled')}
        >
          <svg className="tab-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          Cancelled/Declined Applications
        </button>
      </div>

      {activeMainTab === 'ongoing' && (
        <div className="segmented-control-wrapper">
          <div className="segmented-control">
            <button className={`segment-btn ${activeSubTab === 'all' ? 'active' : ''}`} onClick={() => navigate('/applications/all')}>All Applications</button>
            <button className={`segment-btn ${activeSubTab === 'completeness' ? 'active' : ''}`} onClick={() => navigate('/applications/completeness')}>Completeness Check</button>
            <button className={`segment-btn ${activeSubTab === 'assessment' ? 'active' : ''}`} onClick={() => navigate('/applications/assessment')}>Assessment</button>
            <button className={`segment-btn ${activeSubTab === 'pending' ? 'active' : ''}`} onClick={() => navigate('/applications/pending')}>Pending Review</button>
            <button className={`segment-btn ${activeSubTab === 'issuance' ? 'active' : ''}`} onClick={() => navigate('/applications/issuance')}>Issuance</button>
          </div>
        </div>
      )}

      {activeMainTab === 'completed' && (
        <div className="segmented-control-wrapper">
          <div className="segmented-control">
            <button className={`segment-btn ${activeSubTab === 'range' ? 'active' : ''}`} onClick={() => navigate('/applications/completed/range')}>Range Filter</button>
            <button className={`segment-btn ${activeSubTab === 'month' ? 'active' : ''}`} onClick={() => navigate('/applications/completed/month')}>This Month</button>
            <button className={`segment-btn ${activeSubTab === 'year' ? 'active' : ''}`} onClick={() => navigate('/applications/completed/year')}>This Year</button>
            <button className={`segment-btn ${activeSubTab === '30days' ? 'active' : ''}`} onClick={() => navigate('/applications/completed/30days')}>Last 30 Days</button>
            <button className={`segment-btn ${activeSubTab === '90days' ? 'active' : ''}`} onClick={() => navigate('/applications/completed/90days')}>Last 90 Days</button>
            <button className={`segment-btn ${activeSubTab === '6months' ? 'active' : ''}`} onClick={() => navigate('/applications/completed/6months')}>Last 6 Months</button>
          </div>
        </div>
      )}


      {children}
    </div>
  );
};

export default MyApplicationsNav;
