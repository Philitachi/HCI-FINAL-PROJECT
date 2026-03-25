import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavigationBar2 from '../components/TopNavigationBar2';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import useApplications from '../hooks/useApplications';
import '../styles/Renewals.css';
import './Dashboard/dashboard.css';

const Renewals = () => {
  const { applications, loading } = useApplications('Renewal'); // Fetching applications with status 'Renewal'
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredRenewals = applications.filter(app =>
    app.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset to first page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRenewals = filteredRenewals.slice(indexOfFirstItem, indexOfLastItem);

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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary-color)' }}>Loading renewals...</div>
          ) : currentRenewals.length > 0 ? (
            <div className="applications-list">
              {currentRenewals.map((app) => (
                <div key={app.id} className="app-list-card">
                  {/* Reuse the same card structure as OngoingApplications */}
                  <div className="app-icon-container">
                    <div className="app-icon-circle">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1c64f2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                      <div className="status-badge blue">
                        {app.status}
                      </div>
                    </div>
                    <div className="app-details-col">
                      <div className="app-detail-text">{app.type}</div>
                      <div className="app-detail-text">{app.location}</div>
                      <div className="app-bottom-info">
                        <span className="app-date-time">{app.date} {app.time}</span>
                        <span className="app-ref-bottom">{app.refNo}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="renewals-empty-container">
              <EmptyState />
            </div>
          )}

          <Pagination 
            totalItems={filteredRenewals.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </main>
      </div>
    </div>
  );
};

export default Renewals;
