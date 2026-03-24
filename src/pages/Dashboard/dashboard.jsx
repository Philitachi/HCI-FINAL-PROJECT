import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import Sidebar from '../../components/Sidebar';
import TopNavigationBar2 from '../../components/TopNavigationBar2';
import './dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(() => {
    try {
      const sessionData = localStorage.getItem('userSession');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        if (session.firstName || session.lastName) {
          return `${session.firstName || ''} ${session.lastName || ''}`.trim();
        }
      }
    } catch (e) { }
    return '';
  });

  useEffect(() => {
    const isDarkMode = localStorage.getItem('theme') !== 'light';
    if (isDarkMode) {
      document.documentElement.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    }

    const fetchUserName = async () => {
      try {
        const sessionData = localStorage.getItem('userSession');
        if (sessionData) {
          const session = JSON.parse(sessionData);
          if (session.email) {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', session.email));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              const userData = querySnapshot.docs[0].data();
              const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
              setUserName(fullName || 'User');

              // Silently patch the session if missing
              if (!session.firstName) {
                session.firstName = userData.firstName;
                session.lastName = userData.lastName;
                localStorage.setItem('userSession', JSON.stringify(session));
              }
            } else {
              setUserName('User');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
        setUserName('User');
      }
    };

    fetchUserName();
  }, []);

  return (
    <div className="dashboard-container">
      <TopNavigationBar2 />
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-main-content">
          <div className="welcome-section">
            <h1 className="welcome-h1">Welcome back, <span className="highlight-name">{userName || '...'}</span></h1>
            <p className="welcome-p">Your fire safety permit applications are up to date.</p>
          </div>

          <div className="dashboard-hero-layout">
            <div className="hero-action-col">
              <div className="card apply-card" onClick={() => navigate('/new-application/evaluation')} style={{ cursor: 'pointer' }}>
                <svg className="card-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h6" />
                  <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                  <line x1="8" y1="10" x2="16" y2="10" />
                  <line x1="8" y1="14" x2="12" y2="14" />
                  <circle cx="17.5" cy="17.5" r="4.5" fill="white" stroke="none" />
                  <line x1="15" y1="17.5" x2="20" y2="17.5" stroke="#0369a1" strokeWidth="2" />
                  <line x1="17.5" y1="15" x2="17.5" y2="20" stroke="#0369a1" strokeWidth="2" />
                </svg>
                <h3>Apply for New Application</h3>
              </div>
            </div>

            <div className="hero-metrics-col">
              <div className="metric-card">
                <div className="metric-icon blue">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <div className="metric-info">
                  <span className="metric-value">3</span>
                  <span className="metric-label">Active<br/>Applications</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon green">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <div className="metric-info">
                  <span className="metric-value">1</span>
                  <span className="metric-label">Valid<br/>Certificates</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon purple">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                </div>
                <div className="metric-info">
                  <span className="metric-value">2</span>
                  <span className="metric-label">Registered<br/>Establishments</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon orange">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v8"></path><path d="M12 22h6a2 2 0 0 0 2-2V8l-6-6"></path><path d="M14 2v6h6"></path><circle cx="7" cy="17" r="5"></circle><polyline points="7 14.5 7 17 8.5 18.5"></polyline></svg>
                </div>
                <div className="metric-info">
                  <span className="metric-value">1</span>
                  <span className="metric-label">Saved<br/>Draft</span>
                </div>
              </div>
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