import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import TopNavigationBar2 from '../../components/TopNavigationBar2';
import SharedApplicationForm from '../../components/SharedApplicationForm';
import ExitButton from '../../components/exitButton';
import { FileText, Search, Plus } from 'lucide-react';
import '../../styles/NewApplication.css';
import '../Dashboard/dashboard.css';

const ApplicationClearance = () => {
  const location = useLocation();
  const draftState = location.state || {};
  const [selectedSubOption, setSelectedSubOption] = useState(null);
  const [showClearanceModal, setShowClearanceModal] = useState(false);
  const [clearanceSearch, setClearanceSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const subOptions = [
    { id: 'clr_fireworks', title: 'FIREWORKS EXHIBITION', desc: 'Clearance' },
    { id: 'clr_drill', title: 'CERTIFICATE OF FIRE DRILL', desc: 'Clearance' },
    { id: 'clr_bldg_eq', title: 'INSTALLATION OF BLDG SERVICE EQUIPMENT', desc: 'Clearance' },
    { id: 'clr_afss', title: 'INSTALLATION OF AUTOMATIC FIRE SUPPRESSION SYSTEM (AFSS)', desc: 'Clearance' },
    { id: 'clr_lpgas', title: 'INSTALLATION OF LPGAS SYSTEM', desc: 'Clearance' },
    { id: 'clr_flammable_liq', title: 'STORAGE FOR FLAMMABLE AND COMBUSTIBLE LIQUIDS', desc: 'Clearance' },
    { id: 'clr_hazmat_cargo', title: 'CONVEYANCE OF HAZARDOUS MATERIALS AND CHEMICALS IN CARGO VEHICLES', desc: 'Clearance' },
    { id: 'clr_electrical', title: 'ELECTRICAL INSTALLATION', desc: 'Clearance' },
    { id: 'clr_fumigation', title: 'FUMIGATION AND THERMAL INSECTICIDAL FOGGING', desc: 'Clearance' },
    { id: 'clr_kitchen_hood', title: 'INSTALLATION OF KITCHEN HOOD SUPRESSION SYSTEMS', desc: 'Clearance' },
    { id: 'clr_flammable_tanks', title: 'INSTALLATION OF FLAMMABLE AND COMBUSTIBLE LIQUIDS STORAGE TANKS', desc: 'Clearance' },
    { id: 'clr_hot_work', title: 'WELDING, CUTTING AND OTHER HOT WORK', desc: 'Clearance' },
    { id: 'clr_standpipe', title: 'INSTALLATION OF STANDPIPE', desc: 'Clearance' },
    { id: 'clr_fdas', title: 'FIRE DETECTION, ALARM & COMMUNICATION SYSTEMS', desc: 'Clearance' }
  ];

  // Auto-select and skip modal if coming from a draft
  useEffect(() => {
    if (draftState.draftId && draftState.applicationType) {
      const match = subOptions.find(s => s.title === draftState.applicationType);
      setSelectedSubOption(match || subOptions[0]);
      setShowForm(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps




  return (
    <div className="dashboard-container">
      <TopNavigationBar2 />
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-main-content">
          <div className="new-app-header">
            <h1 className="new-app-title">New Application - Clearance</h1>
            <p className="new-app-subtitle">
              {!showForm ? 'Select one of the application categories' : `APPLICATION FORM - ${selectedSubOption.title}`}
            </p>
          </div>

          <div className="new-app-content">
            {!showForm ? (
              <div className="new-app-card">
                 <div className="step-content animate-fade-in">
                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary-color)'}}>Select Specific Option</h3>
                    <div className="sub-category-list">
                      {subOptions.map(sub => (
                        <div 
                          key={sub.id}
                          className="sub-category-card custom-hover"
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            setSelectedSubOption(sub);
                            setShowClearanceModal(true);
                          }}
                        >
                          <div className="sub-category-icon">
                            <FileText size={24} strokeWidth={2} />
                          </div>
                          <div className="category-text">
                            <h3>{sub.title}</h3>
                            <p>{sub.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                 </div>
              </div>
            ) : (
              <SharedApplicationForm 
                selectedCategoryTitle={selectedSubOption.title}
                onBack={() => {
                  setShowForm(false);
                  setSelectedSubOption(null);
                }}
                draftId={draftState.draftId}
                draftData={draftState.draftData}
              />
            )}
          </div>
        </main>
      </div>

      {/* Clearance Modal */}
      {showClearanceModal && (() => {
        const selectedTitle = selectedSubOption?.title || '';
        return (
          <div className="clearance-modal-overlay" onClick={() => setShowClearanceModal(false)}>
            <div className="clearance-modal" onClick={e => e.stopPropagation()}>
              <div className="clearance-modal-header">
                <div>
                  <h2 className="clearance-modal-title">Clearance Applications</h2>
                  <p className="clearance-modal-subtitle">{selectedTitle}</p>
                </div>
                <ExitButton onClick={() => setShowClearanceModal(false)} />
              </div>

              <div className="clearance-modal-body">
                <div className="clearance-search-section">
                  <div className="clearance-search-row">
                    <div className="clearance-search-input-wrapper">
                      <Search className="clearance-search-icon" size={18} strokeWidth={2} />
                      <input
                        type="text"
                        className="clearance-search-input"
                        placeholder="Search establishment name..."
                        value={clearanceSearch}
                        onChange={e => setClearanceSearch(e.target.value)}
                      />
                    </div>
                    <button className="clearance-search-btn">
                      <Search size={16} strokeWidth={2} />
                      SEARCH
                    </button>
                  </div>
                </div>

                <div className="clearance-divider">
                  <span>OR</span>
                </div>

                <div className="clearance-new-app-section">
                  <div className="clearance-new-app-icon">
                    <Plus size={28} strokeWidth={2} />
                  </div>
                  <h3 className="clearance-new-app-title">New Application</h3>
                  <p className="clearance-new-app-desc">Apply <span style={{ color: '#14b8a6', fontWeight: 600 }}>{selectedTitle}</span> for a new establishment</p>
                  <button className="clearance-start-btn" onClick={() => { 
                    setShowClearanceModal(false); 
                    setShowForm(true); 
                  }}>
                    <Plus size={16} strokeWidth={2} />
                    START NEW APPLICATION
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default ApplicationClearance;
