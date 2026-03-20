import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import TopNavigationBar2 from '../../components/TopNavigationBar2';
import MyApplicationsNav from '../../components/MyApplicationsNav';
import './OngoingApplications-All.css';
import '../Dashboard/dashboard.css';

const OngoingApplicationsAll = () => {
  const navigate = useNavigate();

  const applications = [
    {
      id: "APP-2026-0892",
      title: "Coastal Roasters Expansion",
      date: "Oct 12, 2026",
      type: "Fire Safety Evaluation Clearance",
      location: "124 Harbor Blvd, West District",
      status: "Pending Review",
      refNo: "REF-9928-A1",
      isActive: true
    },
    {
      id: "APP-2026-0845",
      title: "Meridian Labs Facility",
      date: "Oct 10, 2026",
      type: "Fire Safety Inspection Certificate",
      location: "890 Tech Park Way, North District",
      status: "Assessment",
      refNo: "REF-7734-B2",
      isActive: false
    },
    {
      id: "APP-2026-0811",
      title: "Elm & Oak Furniture Showroom",
      date: "Oct 08, 2026",
      type: "Annual Renewal",
      location: "455 Artisan Ave, Central District",
      status: "Completeness Check",
      refNo: "REF-5512-C3",
      isActive: false
    },
    {
      id: "APP-2026-0798",
      title: "Nexus Logistics Hub",
      date: "Oct 05, 2026",
      type: "Fire Safety Evaluation Clearance",
      location: "200 Industrial Pkwy, South District",
      status: "Issuance",
      refNo: "REF-3390-D4",
      isActive: false
    }
  ];

  return (
    <div className="dashboard-container">
      <TopNavigationBar2 />
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-main-content applications-content">
          <MyApplicationsNav activeMainTab="ongoing" activeSubTab="all">
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
              <div key={app.id} className={`app-list-card \${app.isActive ? 'active-card' : ''}`}>
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
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        {app.type}
                      </div>
                    </div>
                    
                    <div className="app-detail-item">
                      <span className="detail-label">LOCATION</span>
                      <div className="detail-value">
                        <svg className="detail-icon teal" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {app.location}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="app-card-middle">
                  <div className="status-badge">
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

          <div className="pagination-wrapper">
            <div className="rows-per-page">
              <span>Rows per page</span>
              <button className="rows-dropdown">
                10
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
            <div className="pagination-controls">
              <button className="page-btn nav-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
              <span className="page-ellipsis">...</span>
              <button className="page-btn">12</button>
              <button className="page-btn nav-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OngoingApplicationsAll;
