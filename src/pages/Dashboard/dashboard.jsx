import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import Sidebar from '../../components/Sidebar';
import TopNavigationBar2 from '../../components/TopNavigationBar2';
import { FolderPlus, FileText, FileCheck, Building, Archive, Check, Save, XCircle, Trash2, AlertCircle, ChevronUp, ChevronDown } from 'lucide-react';
import './dashboard.css';
import { persistUserSession } from '../../utils/userSession';
import { formatRelativeDateTime } from '../../utils/time';

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
  const [metrics, setMetrics] = useState({
    active: 0,
    certificates: 0,
    establishments: 0,
    drafts: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000);

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
                await persistUserSession(session);
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

    const fetchMetrics = () => {
      const sessionData = localStorage.getItem('userSession');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        if (session.email) {
          const appsRef = collection(db, 'applications');
          const q = query(appsRef, where('userEmail', '==', session.email));
          return onSnapshot(q, (snapshot) => {
            const apps = snapshot.docs.map(doc => doc.data());
            
            // Normalized status helper
            const getStatus = (a) => (a.status || '').trim().toLowerCase();

            // Drafts are anything with status 'draft'
            const draftCount = apps.filter(a => getStatus(a) === 'draft').length;
            
            // Active applications are anything non-draft, non-cancelled, non-declined
            const activeCount = apps.filter(a => {
              const s = getStatus(a);
              return s && !['draft', 'cancelled', 'declined'].includes(s);
            }).length;

            // Registered Establishments = (All non-drafts) + (Drafts with name & occupancy)
            // This matches the logic in Establishment.jsx
            const establishmentCount = apps.filter(a => {
              const s = getStatus(a);
              if (s !== 'draft') return true;
              return a.establishmentName && a.occupancyType && 
                     a.establishmentName !== '---' && a.occupancyType !== '---';
            }).length;

            setMetrics({
              active: activeCount,
              certificates: 0, // Per user request (Hardcoded to 0)
              establishments: establishmentCount,
              drafts: draftCount
            });
          });
        }
      }
      return undefined; // Return undefined if no session or email, so unsubscribeMetrics doesn't error
    };

    const unsubscribeMetrics = fetchMetrics();
    fetchUserName();

    // Fetch recent activity logs
    let unsubscribeActivity;
    const sessionData2 = localStorage.getItem('userSession');
    if (sessionData2) {
      const session2 = JSON.parse(sessionData2);
      if (session2.email) {
        const logsRef = collection(db, 'activityLogs');
        const logsQuery = query(
          logsRef,
          where('userEmail', '==', session2.email),
          orderBy('timestamp', 'desc'),
          limit(50)
        );
        unsubscribeActivity = onSnapshot(logsQuery, (snapshot) => {
          const logs = snapshot.docs.map(docSnap => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              action: data.action || '',
              referenceNumber: data.referenceNumber || '---',
              establishmentName: data.establishmentName || '---',
              timestamp: data.timestamp || null
            };
          });
          setRecentActivity(logs);
        });
      }
    }

    return () => {
      window.clearInterval(intervalId);
      if (unsubscribeMetrics) unsubscribeMetrics();
      if (unsubscribeActivity) unsubscribeActivity();
    };
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
                <FolderPlus className="card-icon" size={64} stroke="white" strokeWidth={1.5} />
                <h3>Apply for New Application</h3>
              </div>
            </div>

            <div className="hero-metrics-col">
            <div className="metric-card" onClick={() => navigate('/applications/all')} style={{ cursor: 'pointer' }}>
                <div className="metric-icon blue">
                  <FileText size={24} strokeWidth={2} />
                </div>
                <div className="metric-info">
                  <span className="metric-value">{metrics.active}</span>
                  <span className="metric-label">Active<br/>Applications</span>
                </div>
              </div>
              <div className="metric-card" onClick={() => navigate('/applications/completed')} style={{ cursor: 'pointer' }}>
                <div className="metric-icon green">
                  <FileCheck size={24} strokeWidth={2} />
                </div>
                <div className="metric-info">
                  <span className="metric-value">{metrics.certificates}</span>
                  <span className="metric-label">Valid<br/>Certificates/Clearances</span>
                </div>
              </div>
              <div className="metric-card" onClick={() => navigate('/establishment')} style={{ cursor: 'pointer' }}>
                <div className="metric-icon purple">
                  <Building size={24} strokeWidth={2} />
                </div>
                <div className="metric-info">
                  <span className="metric-value">{metrics.establishments}</span>
                  <span className="metric-label">Registered<br/>Establishments</span>
                </div>
              </div>
              <div className="metric-card" onClick={() => navigate('/drafts')} style={{ cursor: 'pointer' }}>
                <div className="metric-icon orange">
                  <Archive size={24} strokeWidth={2} />
                </div>
                <div className="metric-info">
                  <span className="metric-value">{metrics.drafts}</span>
                  <span className="metric-label">Saved<br/>Drafts</span>
                </div>
              </div>
            </div>
          </div>

          <div className="recent-activity">
            <div className="recent-activity-header">
              <h2>Recent Activity</h2>
            </div>
            <div className="activity-list">
              {recentActivity.length > 0 ? (
                <>
                {recentActivity.slice(0, visibleCount).map((log) => {
                  let iconColor = '#3b82f6';
                  let iconBg = 'rgba(59, 130, 246, 0.1)';
                  let IconSvg;
                  if (log.action === 'Submitted Application') {
                    iconColor = '#10b981'; iconBg = 'rgba(16, 185, 129, 0.1)';
                    IconSvg = <Check size={16} stroke={iconColor} strokeWidth={2} />;
                  } else if (log.action === 'Saved Draft') {
                    iconColor = '#f59e0b'; iconBg = 'rgba(245, 158, 11, 0.1)';
                    IconSvg = <Save size={16} stroke={iconColor} strokeWidth={2} />;
                  } else if (log.action === 'Cancelled Application') {
                    iconColor = '#ef4444'; iconBg = 'rgba(239, 68, 68, 0.1)';
                    IconSvg = <XCircle size={16} stroke={iconColor} strokeWidth={2} />;
                  } else if (log.action === 'Deleted Draft') {
                    iconColor = '#64748b'; iconBg = 'rgba(100, 116, 139, 0.1)';
                    IconSvg = <Trash2 size={16} stroke={iconColor} strokeWidth={2} />;
                  } else {
                    IconSvg = <AlertCircle size={16} stroke={iconColor} strokeWidth={2} />;
                  }
                  return (
                    <div key={log.id} className="activity-item">
                      <div className="activity-icon" style={{ backgroundColor: iconBg, color: iconColor }}>
                        {IconSvg}
                      </div>
                      <div className="activity-info">
                        <span className="activity-action">{log.action}</span>
                        <span className="activity-details">
                          {log.referenceNumber} &bull; {log.establishmentName}
                        </span>
                      </div>
                      <span className="activity-time">{formatRelativeDateTime(log.timestamp, currentTime)}</span>
                    </div>
                  );
                })}
                <div className="activity-pagination">
                  {visibleCount > 5 && (
                    <button className="see-more-btn" onClick={() => setVisibleCount(prev => Math.max(5, prev - 5))}>
                      See Less
                      <ChevronUp size={14} strokeWidth={2} />
                    </button>
                  )}
                  {visibleCount < recentActivity.length && (
                    <button className="see-more-btn" onClick={() => setVisibleCount(prev => prev + 5)}>
                      See More
                      <ChevronDown size={14} strokeWidth={2} />
                    </button>
                  )}
                </div>
                </>
              ) : (
                <div className="activity-empty">
                  <FileText size={40} strokeWidth={1.5} style={{ opacity: 0.3 }} />
                  <p>No recent activity yet. Start by submitting an application!</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
