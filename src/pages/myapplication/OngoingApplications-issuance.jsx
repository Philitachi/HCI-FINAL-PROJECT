import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import TopNavigationBar2 from '../../components/TopNavigationBar2';
import MyApplicationsNav from '../../components/MyApplicationsNav';
import './OngoingApplications-issuance.css';
import '../Dashboard/dashboard.css';

const OngoingApplicationsIssuance = () => {
  const navigate = useNavigate();
  const [selectedApp, setSelectedApp] = useState(null);

  const applications = [
    {
      id: 1,
      title: "Jollibee - Main Branch",
      date: "Mar 15, 2026",
      type: "Business Permit Renewal",
      location: "F. Ramos St., Cebu City",
      status: "Awaiting Issuance",
      refNo: "BFP-2026-00421",
      fee: "₱ 2,500.00"
    },
    {
      id: 2,
      title: "Mang Inasal - Cyberzone",
      date: "Mar 18, 2026",
      type: "New Fire Safety Inspection",
      location: "SM City Cebu, Cebu City",
      status: "Awaiting Issuance",
      refNo: "BFP-2026-00518",
      fee: "₱ 1,800.00"
    }
  ];

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

          <div className="applications-list">
            {applications.map((app) => (
              <div key={app.id} className="app-list-card" onClick={() => setSelectedApp(app)}>
                <div className="app-card-left">
                  <h3 className="app-title">{app.title}</h3>
                  <div className="app-meta">
                    <span className="app-id"># {app.id}</span>
                    <span className="meta-divider">•</span>
                    <span className="app-date">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      {app.date}
                    </span>
                  </div>
                  
                  <div className="app-details-row">
                    <div className="app-detail-item">
                      <span className="detail-label">APPLICATION TYPE</span>
                      <div className="detail-value">
                        <svg className="detail-icon orange" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        {app.type}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="app-card-middle">
                  <div className="status-badge orange">
                    <span className="status-dot"></span>
                    {app.status}
                  </div>
                </div>

                <div className="app-card-right">
                  <div className="ref-info">
                    <span className="ref-label">REFERENCE NO.</span>
                    <span className="ref-value">{app.refNo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

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
