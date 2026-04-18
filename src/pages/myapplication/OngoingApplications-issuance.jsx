import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import TopNavigationBar2 from '../../components/TopNavigationBar2';
import MyApplicationsNav from '../../components/MyApplicationsNav';
import Pagination from '../../components/Pagination';
import EmptyState from '../../components/EmptyState';
import { ApplicationsListSkeleton } from '../../components/PageSkeletons';
import useApplications from '../../hooks/useApplications';
import './OngoingApplications-issuance.css';
import '../Dashboard/dashboard.css';

const OngoingApplicationsIssuance = () => {
  const navigate = useNavigate();
  const [selectedApp, setSelectedApp] = useState(null);
  const { applications: allApplications, loading } = useApplications('Issuance');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedType, setSelectedType] = useState('All Types');
  const [isTypeMenuOpen, setIsTypeMenuOpen] = useState(false);
  const typeMenuRef = useRef(null);

  const occupancyOptions = ['All Types', 'Residential', 'Commercial', 'Industrial', 'Institutional', 'Assembly', 'Educational', 'Storage', 'Mixed Occupancy'];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (typeMenuRef.current && !typeMenuRef.current.contains(event.target)) {
        setIsTypeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredApplications = allApplications.filter(app => {
    const matchesSearch = app.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All Types' || app.occupancyType === selectedType;
    return matchesSearch && matchesType;
  });

  // Reset to first page when searching or filtering
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedType]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentApplications = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="dashboard-container">
      <TopNavigationBar2 />
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-main-content applications-content">
          <MyApplicationsNav activeMainTab="ongoing" activeSubTab="issuance">
            <div className="search-filter-bar">
              <div className="search-wrapper">
                <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input 
                  type="text" 
                  placeholder="Search list by establishment name" 
                  className="search-input" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="type-filter-wrapper" ref={typeMenuRef}>
                <button 
                  className={`type-filter-btn ${isTypeMenuOpen ? 'open' : ''}`}
                  onClick={() => setIsTypeMenuOpen(!isTypeMenuOpen)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                  </svg>
                  {selectedType}
                  <svg className="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                {isTypeMenuOpen && (
                  <div className="type-filter-menu">
                    {occupancyOptions.map((option) => (
                      <div 
                        key={option} 
                        className={`type-filter-item ${selectedType === option ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedType(option);
                          setIsTypeMenuOpen(false);
                        }}
                      >
                        {option === 'All Types' ? 'All Types' : `${option} Occupancy`}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </MyApplicationsNav>

          {loading ? (
            <ApplicationsListSkeleton count={4} />
          ) : currentApplications.length > 0 ? (
            <div className="applications-list">
              {currentApplications.map((app) => (
                <div key={app.id} className={`app-list-card ${app.isActive ? 'active-card' : ''}`} onClick={() => setSelectedApp(app)}>
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
                      <div className="status-badge orange">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        {app.status}
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
                          {app.date} {app.time || ''}
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

          <Pagination 
            totalItems={filteredApplications.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />

          {/* Details Modal */}
          {selectedApp && (
            <div className="issuance-modal-overlay" onClick={() => setSelectedApp(null)}>
              <div className="issuance-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>Application Information</h2>
                  <button className="close-modal-btn" onClick={() => setSelectedApp(null)}>
                    &times;
                  </button>
                </div>
                
                <div className="modal-body">
                  <div className="important-info-box">
                    <div className="info-row">
                      <span>Establishment:</span>
                      <strong>{selectedApp.title}</strong>
                    </div>
                    <div className="info-row">
                      <span>Reference No:</span>
                      <span>{selectedApp.refNo}</span>
                    </div>
                    <div className="info-row">
                      <span>Type:</span>
                      <span>{selectedApp.type}</span>
                    </div>
                    <div className="info-row status-highlight">
                      <span>Status:</span>
                      <span className="badge-highlight">{selectedApp.status}</span>
                    </div>
                    <div className="info-row cost-highlight">
                      <span>Amount Due:</span>
                      <strong className="amount-highlight">{selectedApp.fee}</strong>
                    </div>
                  </div>

                  <p className="payment-notice">
                    💡 Please proceed to the **Payment Section** to settle fees online or offline before the certificate is officially issued and sent to you.
                  </p>

                  <div className="modal-actions-buttons">
                    <button className="secondary-btn" onClick={() => alert('Access Full Info functionality to be implemented')}>
                      Access Full Information
                    </button>
                    <button className="primary-pay-btn" onClick={() => navigate('/payment')}>
                      Proceed to Payment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default OngoingApplicationsIssuance;
