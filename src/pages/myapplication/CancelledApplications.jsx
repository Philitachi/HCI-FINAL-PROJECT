import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import Sidebar from '../../components/Sidebar';
import TopNavigationBar2 from '../../components/TopNavigationBar2';
import MyApplicationsNav from '../../components/MyApplicationsNav';
import Pagination from '../../components/Pagination';
import EmptyState from '../../components/EmptyState';
import './CancelledApplications.css';
import '../Dashboard/dashboard.css';

const CancelledApplications = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('cancelled');
  const [allApps, setAllApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('userSession') || '{}');
    const userEmail = session.email;

    if (!userEmail) {
      setAllApps([]);
      setLoading(false);
      return;
    }

    const applicationsRef = collection(db, 'applications');
    const q = query(applicationsRef, where('userEmail', '==', userEmail));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs
        .map(docSnap => {
          const data = docSnap.data();
          let dateStr = '';
          let timeStr = '';
          if (data.createdAt) {
            const date = data.createdAt.toDate();
            dateStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
            timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
          }
          const locationParts = [data.fireStation, data.barangay, data.city].filter(Boolean);
          const location = locationParts.join(', ') || data.address || '---';

          return {
            id: docSnap.id,
            title: data.establishmentName || '---',
            date: dateStr,
            time: timeStr,
            type: data.applicationType || '---',
            location: location,
            status: data.status || '',
            refNo: data.referenceNumber || '---',
          };
        })
        .filter(app => {
          const s = app.status.trim().toLowerCase();
          return s === 'cancelled' || s === 'declined';
        })
        .sort((a, b) => {
          const dateA = a.date || '';
          const dateB = b.date || '';
          return dateB.localeCompare(dateA);
        });

      setAllApps(apps);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching cancelled applications:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter by selected tab
  const applications = allApps.filter(app => {
    const s = app.status.trim().toLowerCase();
    return filter === 'cancelled' ? s === 'cancelled' : s === 'declined';
  });

  return (
    <div className="dashboard-container">
      <TopNavigationBar2 />
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-main-content applications-content">
          <MyApplicationsNav activeMainTab="cancelled">
            <div className="segmented-control-wrapper" style={{ marginBottom: '1.5rem' }}>
              <div className="segmented-control">
                <button 
                  className={`segment-btn ${filter === 'cancelled' ? 'active' : ''}`} 
                  onClick={() => setFilter('cancelled')}
                >
                  Cancelled Applications
                </button>
                <button 
                  className={`segment-btn ${filter === 'declined' ? 'active' : ''}`} 
                  onClick={() => setFilter('declined')}
                >
                  Declined Applications
                </button>
              </div>
            </div>

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
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                      <div className={`status-badge ${filter === 'declined' ? 'declined' : 'cancelled'}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          {filter === 'declined' ? (
                            <>
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="15" y1="9" x2="9" y2="15"></line>
                              <line x1="9" y1="9" x2="15" y2="15"></line>
                            </>
                          ) : (
                            <>
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="8" y1="12" x2="16" y2="12"></line>
                            </>
                          )}
                        </svg>
                        {filter === 'declined' ? 'Application Declined' : 'Application Cancelled'}
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
                    <button className="btn-reattempt" onClick={async () => {
                      try {
                        await updateDoc(doc(db, 'applications', app.id), { status: 'Completeness Check', updatedAt: serverTimestamp() });
                      } catch (err) {
                        console.error('Error reattempting:', err);
                        alert('Failed to reattempt. Please try again.');
                      }
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 4 23 10 17 10"></polyline>
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                      </svg>
                      Reattempt submission
                    </button>
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

export default CancelledApplications;
