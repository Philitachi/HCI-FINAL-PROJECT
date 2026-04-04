import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MyApplicationsNav.css';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

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
          <Clock size={20} strokeWidth={2} className="tab-icon" />
          Ongoing Applications
        </button>
        <button 
          className={`tab-btn ${activeMainTab === 'completed' ? 'active' : ''} ${activeMainTab === 'completed' && shouldAnimateMainTab ? 'animate' : ''}`} 
          onClick={() => navigate('/applications/completed')}
        >
          <CheckCircle size={20} strokeWidth={2} className="tab-icon" />
          Completed Applications
        </button>
        <button 
          className={`tab-btn ${activeMainTab === 'cancelled' ? 'active' : ''} ${activeMainTab === 'cancelled' && shouldAnimateMainTab ? 'animate' : ''}`} 
          onClick={() => navigate('/applications/cancelled')}
        >
          <XCircle size={20} strokeWidth={2} className="tab-icon" />
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
            <button className={`segment-btn ${activeSubTab === 'lastmonth' ? 'active' : ''}`} onClick={() => navigate('/applications/completed/lastmonth')}>Last Month</button>
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
