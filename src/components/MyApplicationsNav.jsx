import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MyApplicationsNav.css';

const MyApplicationsNav = ({ activeMainTab, activeSubTab }) => {
  const navigate = useNavigate();

  return (
    <div className="applications-tabs-container">
      <div className="main-tabs">
        <button 
          className={`tab-btn \${activeMainTab === 'ongoing' ? 'active' : ''}`} 
          onClick={() => navigate('/applications/all')}
        >
          Ongoing Applications
        </button>
        <button 
          className={`tab-btn \${activeMainTab === 'completed' ? 'active' : ''}`} 
          onClick={() => navigate('/applications/completed')}
        >
          Completed Applications
        </button>
        <button 
          className={`tab-btn \${activeMainTab === 'cancelled' ? 'active' : ''}`} 
          onClick={() => navigate('/applications/cancelled')}
        >
          Cancelled Applications
        </button>
      </div>

      {activeMainTab === 'ongoing' && (
        <div className="filter-tabs">
          <button 
            className={`filter-chip \${activeSubTab === 'all' ? 'active' : ''}`} 
            onClick={() => navigate('/applications/all')}
          >
            All Applications
          </button>
          <button 
            className={`filter-chip \${activeSubTab === 'completeness' ? 'active' : ''}`} 
            onClick={() => navigate('/applications/completeness')}
          >
            Completeness Check
          </button>
          <button 
            className={`filter-chip \${activeSubTab === 'assessment' ? 'active' : ''}`} 
            onClick={() => navigate('/applications/assessment')}
          >
            Assessment
          </button>
          <button 
            className={`filter-chip \${activeSubTab === 'pending' ? 'active' : ''}`} 
            onClick={() => navigate('/applications/pending')}
          >
            Pending Review
          </button>
          <button 
            className={`filter-chip \${activeSubTab === 'issuance' ? 'active' : ''}`} 
            onClick={() => navigate('/applications/issuance')}
          >
            Issuance
          </button>
        </div>
      )}

      {(activeMainTab === 'completed' || activeMainTab === 'cancelled') && (
        <div className="filter-tabs empty-filter-tabs">
          {/* Sub-tabs for completed/cancelled will go here in the future */}
        </div>
      )}
    </div>
  );
};

export default MyApplicationsNav;
