import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import TopNavigationBar2 from '../../components/TopNavigationBar2';
import './dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isDarkMode = localStorage.getItem('theme') !== 'light';
    if (isDarkMode) {
      document.documentElement.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    }
  }, []);

  return (
    <div className="dashboard-container">
      <TopNavigationBar2 />
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-main-content">
          <div className="welcome-section">
            <h1 className="welcome-h1">Welcome back, John Doe</h1>
            <p className="welcome-p">Your fire safety permit applications are up to date.</p>
          </div>

          <div className="action-cards">
            <div className="card apply-card">
              <svg className="card-icon" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h6" />
                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                <line x1="8" y1="10" x2="16" y2="10" />
                <line x1="8" y1="14" x2="12" y2="14" />
                <circle cx="17.5" cy="17.5" r="4.5" fill="white" stroke="none" />
                <line x1="15" y1="17.5" x2="20" y2="17.5" stroke="#0369a1" strokeWidth="2" />
                <line x1="17.5" y1="15" x2="17.5" y2="20" stroke="#0369a1" strokeWidth="2" />
              </svg>
              <h3>Apply for New Permit</h3>
            </div>
            <div className="card pending-card">
              <svg className="card-icon" style={{ color: '#14b8a6' }} width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                <line x1="22" y1="10" x2="4" y2="10" />
              </svg>
              <h3>View Pending Applications</h3>
            </div>
            <div className="card status-card">
              <svg className="card-icon" style={{ color: '#14b8a6' }} width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <circle cx="9" cy="14" r="1.5" fill="currentColor" stroke="none" />
                <circle cx="15" cy="14" r="1.5" fill="currentColor" stroke="none" />
                <circle cx="9" cy="18" r="1.5" fill="currentColor" stroke="none" />
              </svg>
              <h3>Check Renewal Status</h3>
            </div>
          </div>

          <div className="recent-activity">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-text">Application #12345 - <span className="text-muted">Submitted</span></span>
              </div>
              <div className="activity-item">
                <span className="activity-text">Payment Received - <span className="text-muted">Receipt #9876</span></span>
              </div>
              <div className="activity-item">
                <span className="activity-text">Inspection Scheduled - <span className="text-muted">Building A</span></span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
