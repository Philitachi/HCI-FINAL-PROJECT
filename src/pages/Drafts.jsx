import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, deleteDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import Sidebar from '../components/Sidebar';
import TopNavigationBar2 from '../components/TopNavigationBar2';
import EmptyState from '../components/EmptyState';
import '../styles/Drafts.css';
import '../styles/ConfirmModal.css';
import './Dashboard/dashboard.css';

const Drafts = () => {
  const navigate = useNavigate();
  const [draftsList, setDraftsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('userSession') || '{}');
    const userEmail = session.email;

    if (!userEmail) {
      setDraftsList([]);
      setLoading(false);
      return;
    }

    const applicationsRef = collection(db, 'applications');
    const q = query(applicationsRef, where('userEmail', '==', userEmail));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const drafts = snapshot.docs
        .map(docSnap => {
          const data = docSnap.data();
          let dateStr = '';
          let timeStr = '';
          if (data.updatedAt) {
            const date = data.updatedAt.toDate();
            dateStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
            timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
          } else if (data.createdAt) {
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
            rawData: data
          };
        })
        .filter(app => app.status.trim().toLowerCase() === 'draft')
        .sort((a, b) => b.date.localeCompare(a.date));

      setDraftsList(drafts);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching drafts:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteDraft = async (draftId) => {
    try {
      // Capture draft info before deleting
      const draftInfo = draftsList.find(d => d.id === draftId);
      
      await deleteDoc(doc(db, 'applications', draftId));

      // Log activity
      const session = JSON.parse(localStorage.getItem('userSession') || '{}');
      await addDoc(collection(db, 'activityLogs'), {
        userEmail: session.email || '',
        action: 'Deleted Draft',
        referenceNumber: draftInfo?.refNo || '---',
        establishmentName: draftInfo?.title || '---',
        applicationType: draftInfo?.type || '---',
        timestamp: serverTimestamp()
      });

      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting draft:', error);
      alert('Failed to delete draft. Please try again.');
    }
  };

  const handleContinueDraft = (draft) => {
    const type = (draft.type || '').toUpperCase();
    let route = '/new-application/evaluation'; // default

    // Map application type to correct route based on title keywords
    if (type.includes('OCCUPANCY')) {
      route = '/new-application/occupancy';
    } else if (type.includes('BUSINESS PERMIT')) {
      route = '/new-application/certificate';
    } else if (type.includes('EVALUATION') || type.includes('FSEC')) {
      route = '/new-application/evaluation';
    } else {
      // Default fallback is Clearance for everything else (Hot work, Fire Drill, etc.)
      route = '/new-application/clearance';
    }

    navigate(route, {
      state: {
        draftId: draft.id,
        draftData: draft.rawData,
        applicationType: draft.type
      }
    });
  };

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

          <div className="drafts-search-bar">
            <div className="drafts-search-wrapper">
              <svg className="drafts-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Search list by establishment name"
                className="drafts-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {(() => {
            const filteredDrafts = draftsList.filter(app =>
              app.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            return loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary-color)' }}>Loading drafts...</div>
          ) : filteredDrafts.length > 0 ? (
            <div className="drafts-list">
              {filteredDrafts.map((app) => (
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
                        Draft
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
                          Last edited: {app.date} {app.time}
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
                    <button className="btn-draft-continue" onClick={() => handleContinueDraft(app)}>Continue on this application</button>
                    <button className="btn-draft-delete" onClick={() => setDeleteConfirm({ id: app.id, title: app.title })}>Delete this application</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState />
          );
          })()}

        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="delete-confirm-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-confirm-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <h3 className="delete-confirm-title">Delete Draft?</h3>
            <p className="delete-confirm-text">
              Are you sure you want to delete the draft for <strong>"{deleteConfirm.title}"</strong>? This action cannot be undone.
            </p>
            <div className="delete-confirm-actions">
              <button className="btn-confirm-no" onClick={() => setDeleteConfirm(null)}>No, Keep it</button>
              <button className="btn-confirm-yes" onClick={() => handleDeleteDraft(deleteConfirm.id)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drafts;

