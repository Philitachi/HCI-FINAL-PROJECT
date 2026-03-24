import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import Sidebar from '../../components/Sidebar';
import TopNavigationBar2 from '../../components/TopNavigationBar2';
import MyApplicationsNav from '../../components/MyApplicationsNav';
import Pagination from '../../components/Pagination';
import EmptyState from '../../components/EmptyState';
import './CompletedApplications.css';
import '../Dashboard/dashboard.css';

const CompletedApplications = () => {
  const navigate = useNavigate();
  const { filter } = useParams();
  const activeSubTab = filter || 'range';
  const [allApplications, setAllApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Range date picker state
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('userSession') || '{}');
    const userEmail = session.email;

    if (!userEmail) {
      setAllApplications([]);
      setLoading(false);
      return;
    }

    const applicationsRef = collection(db, 'applications');
    const q = query(applicationsRef, where('userEmail', '==', userEmail));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs
        .map(doc => {
          const data = doc.data();
          let dateStr = '';
          let timeStr = '';
          let createdDate = null;
          if (data.createdAt) {
            createdDate = data.createdAt.toDate();
            dateStr = createdDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
            timeStr = createdDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
          }
          const locationParts = [data.fireStation, data.barangay, data.city].filter(Boolean);
          const location = locationParts.join(', ') || data.address || '---';

          return {
            id: doc.id,
            title: data.establishmentName || '---',
            date: dateStr,
            time: timeStr,
            type: data.applicationType || '---',
            location: location,
            status: data.status || '',
            refNo: data.referenceNumber || '---',
            createdDate: createdDate,
            rawData: data
          };
        })
        .filter(app => app.status.trim().toLowerCase() === 'completed')
        .sort((a, b) => {
          const dateA = a.createdDate || new Date(0);
          const dateB = b.createdDate || new Date(0);
          return dateB - dateA;
        });

      setAllApplications(apps);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching completed applications:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter applications based on active sub-tab
  const applications = useMemo(() => {
    const now = new Date();

    switch (activeSubTab) {
      case 'month': {
        // This month
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return allApplications.filter(app => app.createdDate && app.createdDate >= startOfMonth);
      }
      case 'year': {
        // This year
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        return allApplications.filter(app => app.createdDate && app.createdDate >= startOfYear);
      }
      case '30days': {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return allApplications.filter(app => app.createdDate && app.createdDate >= thirtyDaysAgo);
      }
      case '90days': {
        const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        return allApplications.filter(app => app.createdDate && app.createdDate >= ninetyDaysAgo);
      }
      case '6months': {
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        return allApplications.filter(app => app.createdDate && app.createdDate >= sixMonthsAgo);
      }
      case 'range': {
        // Custom date range
        if (!dateFrom && !dateTo) return allApplications;
        return allApplications.filter(app => {
          if (!app.createdDate) return false;
          const appDate = app.createdDate;
          if (dateFrom && appDate < new Date(dateFrom)) return false;
          if (dateTo) {
            const endDate = new Date(dateTo);
            endDate.setHours(23, 59, 59, 999);
            if (appDate > endDate) return false;
          }
          return true;
        });
      }
      default:
        return allApplications;
    }
  }, [allApplications, activeSubTab, dateFrom, dateTo]);

  return (
    <div className="dashboard-container">
      <TopNavigationBar2 />
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-main-content applications-content">
          <MyApplicationsNav activeMainTab="completed" activeSubTab={activeSubTab}>
            {/* Date Range Picker - shown only on 'range' tab */}
            {activeSubTab === 'range' && (
              <div className="date-range-picker-bar">
                <div className="date-range-field">
                  <label className="date-range-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    From
                  </label>
                  <input
                    type="date"
                    className="date-range-input"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
                <span className="date-range-separator">—</span>
                <div className="date-range-field">
                  <label className="date-range-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    To
                  </label>
                  <input
                    type="date"
                    className="date-range-input"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
                {(dateFrom || dateTo) && (
                  <button className="date-range-clear" onClick={() => { setDateFrom(''); setDateTo(''); }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Clear
                  </button>
                )}
              </div>
            )}

            <div className="search-filter-bar">
              <div className="search-wrapper">
                <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input type="text" placeholder="Search list by establishment name" className="search-input" />
              </div>
              <div className="type-filter-wrapper">
                <button className="type-filter-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                  </svg>
                  All Types
                  <svg className="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </MyApplicationsNav>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary-color)' }}>Loading applications...</div>
          ) : applications.length > 0 ? (
            <div className="applications-list">
              {applications.map((app) => (
                <div key={app.id} className="app-list-card">
                  <div className="app-icon-container">
                    <div className="app-icon-circle">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </div>
                  </div>

                  <div className="app-card-content">
                    <div className="app-title-row">
                      <h3 className="app-title">{app.title}</h3>
                      <div className="status-badge green">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Completed
                      </div>
                    </div>

                    <div className="app-details-col">
                      <div className="app-detail-text">
                        <svg className="detail-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        {app.type}
                      </div>

                      <div className="app-detail-text">
                        <svg className="detail-icon outline" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {app.location}
                      </div>

                      <div className="app-bottom-info">
                        <span className="app-date-time">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          {app.date} {app.time}
                        </span>
                        <span className="app-ref-bottom">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                          </svg>
                          {app.refNo}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="app-card-actions">
                    <button className="btn-continue" onClick={() => navigate(`/applications/${app.id}`)}>Access full details</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState />
          )}

          <Pagination />
        </main>
      </div>
    </div>
  );
};

export default CompletedApplications;
