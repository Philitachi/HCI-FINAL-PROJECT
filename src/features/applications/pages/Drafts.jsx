import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, deleteDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import Sidebar from '../../../components/layout/Sidebar';
import TopNavigationBar2 from '../../../components/layout/TopNavigationBar2';
import EmptyState from '../../../components/ui/EmptyState';
import Pagination from '../../../components/ui/Pagination';
import useDebugLoadingGate from '../../../hooks/useDebugLoadingGate';
import useModalFocusTrap from '../../../hooks/useModalFocusTrap';
import { DraftListSkeleton } from '../../../components/ui/PageSkeletons';
import { Search, FileText, User, Building, MapPin, Calendar, Clock, XCircle, CheckCircle, Trash2 } from 'lucide-react';
import '../styles/Drafts.css';
import '../../../styles/ConfirmModal.css';
import '../../dashboard/styles/dashboard.css';

const Drafts = () => {
  const navigate = useNavigate();
  const [draftsList, setDraftsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const showLoading = useDebugLoadingGate(loading);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const deleteModalRef = useModalFocusTrap(Boolean(deleteConfirm), {
    onEscape: () => setDeleteConfirm(null),
  });

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

  // Reset to first page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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
      setDeleteSuccess(draftInfo?.title || 'Draft');
      setTimeout(() => setDeleteSuccess(null), 2500);
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
              <Search className="drafts-search-icon" size={20} strokeWidth={2} />
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
            
            // Apply pagination
            const indexOfLastItem = currentPage * itemsPerPage;
            const indexOfFirstItem = indexOfLastItem - itemsPerPage;
            const currentDrafts = filteredDrafts.slice(indexOfFirstItem, indexOfLastItem);

            return showLoading ? (
            <DraftListSkeleton count={4} />
          ) : currentDrafts.length > 0 ? (
            <>
              <div className="drafts-list">
                {currentDrafts.map((app) => (
                  <div key={app.id} className="draft-list-card">
                    <div className="draft-icon-container">
                      <div className="draft-icon-circle">
                        <FileText size={24} color="#64748b" strokeWidth={2} />
                      </div>
                    </div>

                    <div className="draft-card-content">
                      <div className="draft-title-row">
                        <h3 className="draft-title">{app.title}</h3>
                        <div className="status-badge draft">
                          <Clock size={14} strokeWidth={2} />
                          Draft
                        </div>
                      </div>

                      <div className="draft-details-col">
                        <div className="draft-detail-text">
                          <FileText className="detail-icon" size={16} strokeWidth={2} />
                          {app.type}
                        </div>
                        
                        <div className="draft-detail-text">
                          <MapPin className="detail-icon outline" size={16} strokeWidth={2} />
                          {app.location}
                        </div>

                        <div className="draft-bottom-info">
                          <span className="draft-date-time">
                            <Calendar size={14} strokeWidth={2} />
                            Last edited: {app.date} {app.time}
                          </span>
                          <span className="draft-ref-bottom">
                            <FileText size={14} strokeWidth={2} />
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
              <Pagination 
                totalItems={filteredDrafts.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </>
          ) : (
            <EmptyState />
          );
          })()}

        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="delete-confirm-overlay" onClick={() => setDeleteConfirm(null)}>
          <div
            className="delete-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-draft-modal-title"
            aria-describedby="delete-draft-modal-description"
            tabIndex="-1"
            ref={deleteModalRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-confirm-icon" aria-hidden="true">
              <XCircle size={48} color="#ef4444" strokeWidth={1.5} />
            </div>
            <h3 className="delete-confirm-title" id="delete-draft-modal-title">Delete Draft?</h3>
            <p className="delete-confirm-text" id="delete-draft-modal-description">
              Are you sure you want to delete the draft for <strong>"{deleteConfirm.title}"</strong>? This action cannot be undone.
            </p>
            <div className="delete-confirm-actions">
              <button type="button" className="btn-confirm-no" onClick={() => setDeleteConfirm(null)}>No, Keep it</button>
              <button type="button" className="btn-confirm-yes" onClick={() => handleDeleteDraft(deleteConfirm.id)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Success Toast */}
      {deleteSuccess && (
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
          <span>"{deleteSuccess}" has been deleted successfully.</span>
        </div>
      )}
    </div>
  );
};

export default Drafts;
