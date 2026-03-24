import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNavigationBar2 from '../components/TopNavigationBar2';
import './FullDetails.css';

const FullDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('application');

  // Hardcoded mockup data to match the screenshot precisely
  const appData = {
    id: id || "APP-2026-X8Y9",
    tradeName: "Jollibe / Comercial",
    subType: "Fireworks Exhibition",
    refNo: "REF#0002824713",
    status: "Currently Active",
    establishment: {
      tradeName: "aREGWS",
      address: "DFGDSF Baan KM 3, BUTUAN CITY (Capital)",
      representative: "asfse",
      contact: "--- / 3245343234"
    },
    building: {
      type: "---",
      floorArea: "54",
      occupancyType: "Educational Occupancy"
    },
    application: {
      station: "BUTUAN CITY FIRE STN/AMPAYON/LIBERTAD SUB STN",
      type: "FIREWORKS EXHIBITION",
      status: "INCOMPLETE APPLICATION",
      submittedDate: "Jan 01, 1970 | 7:30 AM"
    }
  };

  const tabs = [
    { id: 'application', label: 'Application' },
    { id: 'payments', label: 'Payments' },
    { id: 'issued-certificates', label: 'Issued Certificates' },
    { id: 'issued-clearances', label: 'Issued Clearances' },
    { id: 'other-attachments', label: 'Other Attachments' },
  ];

  return (
    <div className="dashboard-container">
      <TopNavigationBar2 />
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-main-content full-details-main">

          {/* Header Banner */}
          <div className="fd-header-card">
            <div className="fd-header-left">
              <div className="fd-header-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>
              </div>
              <div className="fd-header-titles">
                <h1>{appData.tradeName}</h1>
                <p>{appData.subType}</p>
              </div>
            </div>

            <div className="fd-header-right">
              <div className="fd-status-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                {appData.status}
              </div>
            </div>
          </div>

          {/* Main Card */}
          <div className="fd-content-card">
            <div className="fd-ref-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <h2>{appData.refNo}</h2>
            </div>

            <div className="fd-tabs-container">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`fd-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="fd-tab-content">
              {activeTab === 'application' && (
                <div className="fd-application-tab">

                  <div className="fd-section">
                    <div className="fd-section-header">
                      <h3>Establishment Information</h3>
                      <p>Basic details about your business establishment</p>
                    </div>

                    <div className="fd-grid-2">
                      <div className="fd-field">
                        <label>Trade Name</label>
                        <div className="fd-input-mock">{appData.establishment.tradeName}</div>
                      </div>
                      <div className="fd-field">
                        <label>Address</label>
                        <div className="fd-input-mock">{appData.establishment.address}</div>
                      </div>
                      <div className="fd-field">
                        <label>Authorized Representative</label>
                        <div className="fd-input-mock">{appData.establishment.representative}</div>
                      </div>
                      <div className="fd-field">
                        <label>Contact Number</label>
                        <div className="fd-input-mock">{appData.establishment.contact}</div>
                      </div>
                    </div>
                  </div>

                  <div className="fd-section">
                    <div className="fd-section-header">
                      <h3>Building Information</h3>
                      <p>Basic details about the building</p>
                    </div>

                    <div className="fd-grid-2">
                      <div className="fd-field">
                        <label>Building Type</label>
                        <div className="fd-input-mock">{appData.building.type}</div>
                      </div>
                      <div className="fd-field">
                        <label>Floor Area</label>
                        <div className="fd-input-mock">{appData.building.floorArea}</div>
                      </div>
                      <div className="fd-field fd-col-span-2">
                        <label>Occupancy Type</label>
                        <div className="fd-input-mock">{appData.building.occupancyType}</div>
                      </div>
                    </div>
                  </div>

                  <div className="fd-section fd-app-status-section">
                    <div className="fd-section-header">
                      <h3>Application</h3>
                    </div>

                    <div className="fd-app-status-row">
                      <div className="fd-status-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                        <span>{appData.application.station}</span>
                      </div>
                      <div className="fd-status-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        <span>{appData.application.type}</span>
                      </div>
                      <div className="fd-status-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        <span>{appData.application.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="fd-footer-action">
                    <span className="fd-submitted-text">Application submitted on {appData.application.submittedDate}</span>
                    <button className="fd-btn-delete">CANCEL THIS APPLICATION</button>
                  </div>

                </div>
              )}
              {activeTab !== 'application' && (
                <div className="fd-empty-tab">
                  <p>Information for {tabs.find(t => t.id === activeTab)?.label} will be displayed here.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FullDetails;
