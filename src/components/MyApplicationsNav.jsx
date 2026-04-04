import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyApplicationsNav.css';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

const MyApplicationsNav = ({ activeMainTab, activeSubTab, children }) => {
  const navigate = useNavigate();
  const mainTabsRef = useRef(null);
  const segmentedControlRef = useRef(null);

  // Only animate the main tab when it actually changes
  const prevMainTab = sessionStorage.getItem('prevMainTab');
  const shouldAnimateMainTab = prevMainTab !== activeMainTab;
  useEffect(() => {
    sessionStorage.setItem('prevMainTab', activeMainTab);
  }, [activeMainTab]);

  useEffect(() => {
    if (mainTabsRef.current) {
      const activeTab = mainTabsRef.current.querySelector('.tab-btn.active');
      if (activeTab) {
        const container = mainTabsRef.current;
        const scrollLeft = activeTab.offsetLeft - (container.clientWidth / 2) + (activeTab.clientWidth / 2);
        container.scrollLeft = scrollLeft;
      }
    }
    
    if (segmentedControlRef.current) {
      const activeTab = segmentedControlRef.current.querySelector('.segment-btn.active');
      if (activeTab) {
        const container = segmentedControlRef.current;
        const scrollLeft = activeTab.offsetLeft - (container.clientWidth / 2) + (activeTab.clientWidth / 2);
        container.scrollLeft = scrollLeft;
      }
    }
  }, [activeMainTab, activeSubTab]);

  return (
    <div className="applications-tabs-container">
      <div className="main-tabs" ref={mainTabsRef}>
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
          <div className="segmented-control" ref={segmentedControlRef}>
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
          <div className="segmented-control" ref={segmentedControlRef}>
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
