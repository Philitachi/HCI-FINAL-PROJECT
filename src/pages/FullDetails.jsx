import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { CheckCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopNavigationBar2 from '../components/TopNavigationBar2';
import './FullDetails.css';
import '../styles/ConfirmModal.css';

const FullDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('application');
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const docRef = doc(db, 'applications', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          // Format the createdAt timestamp
          let submittedDate = '---';
          if (data.createdAt) {
            const date = data.createdAt.toDate();
            const dateStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
            const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            submittedDate = `${dateStr} | ${timeStr}`;
          }

          // Build address
          const addressParts = [data.address, data.barangay, data.city].filter(Boolean);
          const fullAddress = addressParts.join(', ') || '---';

          // Build contact
          const contactParts = [data.landline || '---', data.mobile || '---'];
          const contact = contactParts.join(' / ');

          setAppData({
            id: docSnap.id,
            establishmentName: data.establishmentName || '---',
            tradeName: data.tradeName || data.establishmentName || '---',
            applicationType: data.applicationType || '---',
            referenceNumber: data.referenceNumber || '---',
            status: data.status || '---',
            ownerName: data.ownerName || '---',
            representativeName: data.representativeName || '---',
            address: fullAddress,
            contact: contact,
            buildingType: data.buildingType || '---',
            totalBuildArea: data.totalBuildArea || '---',
            occupancyType: data.occupancyType || '---',
            numberOfOccupant: data.numberOfOccupant || '---',
            fireStation: data.fireStation || '---',
            region: data.region || '---',
            province: data.province || '---',
            isPeza: data.isPeza || false,
            submittedDate: submittedDate,
          });
        } else {
          setAppData(null);
        }
      } catch (error) {
        console.error('Error fetching application:', error);
        setAppData(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchApplication();
  }, [id]);

  const tabs = [
    { id: 'application', label: 'Application' },
    { id: 'payments', label: 'Payments' },
    { id: 'issued-certificates', label: 'Issued Certificates' },
    { id: 'issued-clearances', label: 'Issued Clearances' },
    { id: 'other-attachments', label: 'Other Attachments' },
  ];

  if (loading) {
    return (
      <div className="dashboard-container">
        <TopNavigationBar2 />
        <div className="dashboard-body">
          <Sidebar />
          <main className="dashboard-main-content full-details-main">
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary-color)' }}>Loading application details...</div>
          </main>
        </div>
      </div>
    );
  }

  if (!appData) {
    return (
      <div className="dashboard-container">
        <TopNavigationBar2 />
        <div className="dashboard-body">
          <Sidebar />
          <main className="dashboard-main-content full-details-main">
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary-color)' }}>
              <p>Application not found.</p>
              <button onClick={() => navigate('/applications/all')} style={{ marginTop: '1rem', padding: '0.6rem 1.5rem', borderRadius: '8px', border: 'none', background: '#14b8a6', color: 'white', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                Back to Applications
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Determine if application is active or inactive
  const isInactive = ['cancelled', 'declined'].includes(appData?.status?.toLowerCase());
  const statusLabel = isInactive ? "Currently Inactive" : "Currently Active";

  // Determine status badge color
  const getStatusClass = () => {
    if (isInactive) return 'fd-status-red';
    if (appData.status.toLowerCase() === 'completed') return 'fd-status-green';
    return 'fd-status-blue';
  };

  const handleCancelApplication = async () => {
    setIsCancelling(true);
    try {
      await updateDoc(doc(db, 'applications', id), {
        status: 'Cancelled',
        updatedAt: serverTimestamp()
      });

      // Log activity
      const session = JSON.parse(localStorage.getItem('userSession') || '{}');
      await addDoc(collection(db, 'activityLogs'), {
        userEmail: session.email || '',
        action: 'Cancelled Application',
        referenceNumber: appData.referenceNumber || '---',
        establishmentName: appData.establishmentName || '---',
        applicationType: appData.applicationType || '---',
        timestamp: serverTimestamp()
      });

      setCancelConfirm(false);
      setCancelSuccess(appData.establishmentName || 'Application');
      setTimeout(() => {
        setCancelSuccess(null);
        navigate('/applications/all');
      }, 2500);
    } catch (error) {
      console.error('Error cancelling application:', error);
      alert('Failed to cancel application. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

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
                <h1>{appData.establishmentName}</h1>
                <p>{appData.applicationType}</p>
              </div>
            </div>

            <div className="fd-header-right">
              <div className={`fd-status-badge ${getStatusClass()}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                {statusLabel}
              </div>
            </div>
          </div>

          {/* Main Card */}
          <div className="fd-content-card">
            <div className="fd-ref-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <h2>{appData.referenceNumber}</h2>
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
                        <label>Establishment Name</label>
                        <div className="fd-input-mock">{appData.establishmentName}</div>
                      </div>
                      <div className="fd-field">
                        <label>Owner Name</label>
                        <div className="fd-input-mock">{appData.ownerName}</div>
                      </div>
                      <div className="fd-field">
                        <label>Authorized Representative</label>
                        <div className="fd-input-mock">{appData.representativeName}</div>
                      </div>
                      <div className="fd-field">
                        <label>Trade Name</label>
                        <div className="fd-input-mock">{appData.tradeName}</div>
                      </div>
                      <div className="fd-field">
                        <label>Address</label>
                        <div className="fd-input-mock">{appData.address}</div>
                      </div>
                      <div className="fd-field">
                        <label>Contact Number</label>
                        <div className="fd-input-mock">{appData.contact}</div>
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
                        <div className="fd-input-mock">{appData.buildingType}</div>
                      </div>
                      <div className="fd-field">
                        <label>Occupancy Type</label>
                        <div className="fd-input-mock">{appData.occupancyType}</div>
                      </div>
                      <div className="fd-field">
                        <label>Total Floor Area (sq. m)</label>
                        <div className="fd-input-mock">{appData.totalBuildArea}</div>
                      </div>
                      <div className="fd-field">
                        <label>Number of Occupants</label>
                        <div className="fd-input-mock">{appData.numberOfOccupant}</div>
                      </div>
                      <div className="fd-field">
                        <label>PEZA Registered</label>
                        <div className="fd-input-mock">{appData.isPeza ? 'Yes' : 'No'}</div>
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
                        <span>{appData.fireStation}</span>
                      </div>
                      <div className="fd-status-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        <span>{appData.applicationType}</span>
                      </div>
                      <div className="fd-status-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        <span>{appData.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="fd-footer-action">
                    <span className="fd-submitted-text">Application submitted on {appData.submittedDate}</span>
                    <div className="fd-footer-buttons">
                      <button className="fd-btn-back" onClick={() => navigate(-1)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        BACK
                      </button>
                      {appData.status.toLowerCase() !== 'completed' && appData.status.toLowerCase() !== 'cancelled' && (
                        <button className="fd-btn-delete" onClick={() => setCancelConfirm(true)}>CANCEL THIS APPLICATION</button>
                      )}
                    </div>
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

      {/* Cancel Confirmation Modal */}
      {cancelConfirm && (
        <div className="delete-confirm-overlay" onClick={() => setCancelConfirm(false)}>
          <div className="delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-confirm-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <h3 className="delete-confirm-title">Cancel Application?</h3>
            <p className="delete-confirm-text">
              Are you sure you want to cancel the application for <strong>"{appData.establishmentName}"</strong>? This action cannot be undone.
            </p>
            <div className="delete-confirm-actions">
              <button className="btn-confirm-no" onClick={() => setCancelConfirm(false)}>No, Keep it</button>
              <button className="btn-confirm-yes" onClick={handleCancelApplication} disabled={isCancelling}>
                {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Cancel Success Toast */}
      {cancelSuccess && (
        <div style={{
          position: 'fixed',
          top: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'var(--card-bg-color, #1e293b)',
          border: '1px solid var(--card-border-color, #334155)',
          borderRadius: '12px',
          padding: '14px 24px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          animation: 'fadeInDown 0.3s ease',
          color: 'var(--text-primary-color, #fff)',
          fontSize: '0.95rem',
          fontWeight: 500
        }}>
          <CheckCircle size={20} stroke="#10b981" strokeWidth={2} />
          <span>"{cancelSuccess}" has been cancelled successfully.</span>
        </div>
      )}
    </div>
  );
};

export default FullDetails;
