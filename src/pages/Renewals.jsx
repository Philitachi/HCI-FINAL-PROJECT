import React from 'react';
import Sidebar from '../components/Sidebar';
import TopNavigationBar2 from '../components/TopNavigationBar2';
import EmptyState from '../components/EmptyState';
import './Renewals.css';
import './Dashboard/dashboard.css';

const Renewals = () => {
  return (
    <div className="dashboard-container">
      <TopNavigationBar2 />
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-main-content renewals-content">
          <div className="renewals-header">
            <h1 className="renewals-title">Renewals</h1>
            <div className="renewals-search-bar">
              <div className="renewals-search-wrapper">
                <svg className="renewals-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input 
                  type="text" 
                  placeholder="Search list by establishment name" 
                  className="renewals-search-input" 
                />
              </div>
            </div>
          </div>
          
          <div className="renewals-empty-container">
            <EmptyState />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Renewals;
