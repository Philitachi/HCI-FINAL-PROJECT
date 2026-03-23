import React from 'react';
import Sidebar from '../components/Sidebar';
import TopNavigationBar2 from '../components/TopNavigationBar2';
import EmptyState from '../components/EmptyState';
import '../styles/Drafts.css';
import './Dashboard/dashboard.css';

const Drafts = () => {
  const draftsList = [
    {
      id: "APP-2026-0955",
      title: "Coastal Roasters Expansion",
      date: "Oct 12, 2026",
      type: "Fire Safety Evaluation Clearance",
      location: "124 Harbor Blvd, West District",
      status: "Draft",
      refNo: "REF-9928-A1"
    },
    {
      id: "APP-2026-0941",
      title: "Vertex Tower Modifications",
      date: "Oct 08, 2026",
      type: "Fire Safety Inspection Certificate",
      location: "450 Peak Street, Upper East",
      status: "Draft",
      refNo: "REF-4491-B7"
    }
  ];

  return (
    <div className="dashboard-container">
      <TopNavigationBar2 />
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-main-content drafts-content">
          <div className="drafts-header">
            <h1 className="drafts-title">Drafts</h1>
              <p className="drafts-subtitle">Pick up right where you left off. These applications are securely saved but not yet submitted.</p>
            </div>

          {draftsList.length > 0 ? (
            <div className="drafts-list">
              {draftsList.map((app) => (
                <div key={app.id} className="draft-list-card">
                  <div className="draft-icon-container">
                    <div className="draft-icon-circle">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </div>
                  </div>

                  <div className="draft-card-content">
                    <div className="draft-title-row">
                      <h3 className="draft-title">{app.title}</h3>
                      <div className="status-badge draft">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        {app.status}
                      </div>
                    </div>

                    <div className="draft-details-col">
                      <div className="draft-detail-text">
                        <svg className="detail-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        {app.type}
                      </div>
                      
                      <div className="draft-detail-text">
                        <svg className="detail-icon outline" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {app.location}
                      </div>

                      <div className="draft-bottom-info">
                        <span className="draft-date-time">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          Last edited: {app.date} 10:30 AM
                        </span>
                        <span className="draft-ref-bottom">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                          </svg>
                          {app.refNo}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="draft-card-actions">
                    <button className="btn-draft-continue">Continue on this application</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState />
          )}

        </main>
      </div>
    </div>
  );
};

export default Drafts;
