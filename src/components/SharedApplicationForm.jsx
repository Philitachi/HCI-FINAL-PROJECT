import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NewApplication.css';
import '../styles/Complaint.css';
import EmailVerifiedSVG from '../assets/EmailVerified.svg';
import ExitButton from './exitButton';

export const CustomSelect = ({ name, value, options, onChange, placeholder, disabled, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="custom-select-container" ref={ref}>
      <div 
        className={`custom-select-trigger ${disabled ? 'disabled' : ''} ${error ? 'error' : ''} ${isOpen ? 'open' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{ userSelect: 'none' }}
      >
        {value || placeholder}
        <div className="custom-select-arrow"></div>
      </div>
      {isOpen && !disabled && (
        <ul className="custom-options-list">
          {options.map((opt) => (
            <li 
              key={opt} 
              className={`custom-option ${value === opt ? 'selected' : ''}`}
              onClick={() => {
                onChange({ target: { name, value: opt, type: 'select' } });
                setIsOpen(false);
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const SharedApplicationForm = ({ selectedCategoryTitle, onBack }) => {
  const navigate = useNavigate();
  // We'll map the previous steps 2,3,4 to 1,2,3 for this shared component
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    establishmentName: '',
    ownerName: '',
    representativeName: '',
    tradeName: '',
    occupancyType: '',
    totalBuildArea: '',
    numberOfOccupant: '',
    address: '',
    region: '',
    province: '',
    city: '',
    barangay: '',
    fireStation: '',
    isPeza: false,
    landline: '',
    mobile: ''
  });

  const [uploadedFiles, setUploadedFiles] = useState({});
  const [dragActiveId, setDragActiveId] = useState(null);
  const [showPezaModal, setShowPezaModal] = useState(false);
  
  const getRequirements = (title) => {
    if (!title) return [];
    const upperTitle = title.toUpperCase();
    if (upperTitle.includes('EVALUATION')) {
      return [
        "Architectural documents",
        "Civil/structural documents",
        "Electrical documents",
        "Mechanical documents",
        "Photocopies of valid licenses of involved professional",
        "Electronics documents",
        "Fire protection plan",
        "1 set of estimated cost of the building to be constructed / renovated / modified as reflected in the bill of materials including labor cost signed and sealed by the designer / contractor and duly notarized",
        "Fire safety compliant report"
      ];
    } else if (upperTitle.includes('BUSINESS')) {
      return [
        "Fees assessment bill from the business permit and licensing office",
        "Copy of fire insurance (if any)",
        "Affidavit of no alteration to building (for new business with valid fsic issued for occupancy)"
      ];
    } else if (upperTitle.includes('OCCUPANCY')) {
      return [
        "Copy of application form for certificate of occupancy from office of the building official",
        "Assessment of fees from obo",
        "Photocopy of certificate of completion",
        "As-built plan (if necessary)"
      ];
    } else {
      return [];
    }
  };
  const requiredDocuments = getRequirements(selectedCategoryTitle);
  const uploadedCount = Object.keys(uploadedFiles).length;

  const occupancyOptions = ['Residential', 'Commercial', 'Industrial', 'Institutional', 'Assembly', 'Educational', 'Storage', 'Mixed Occupancy'];
  const regionOptions = ['REGION I (ILOCOS REGION)', 'REGION II (CAGAYAN VALLEY)', 'REGION III (CENTRAL LUZON)', 'NATIONAL CAPITAL REGION (NCR)'];
  const provinceOptions = ['Metro Manila', 'Cebu', 'Laguna', 'Cavite', 'Ilocos Norte'];
  const cityOptions = ['Manila City', 'Quezon City', 'Cebu City', 'Laoag City', 'Santa Rosa'];
  const barangayOptions = ['Barangay 1', 'Barangay 2', 'Barangay 3', 'Poblacion', 'San Lorenzo'];
  const stationOptions = ['Main Fire Station', 'Sub Station 1', 'Sub Station 2', 'Central District Station'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="new-app-card">
      {/* Progress Wizard */}
      <div className="new-app-steps">
        <div className={`app-step-indicator ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <div className="app-step-circle">{step > 1 ? '✓' : '1'}</div>
          <div className="app-step-label">Fill-up the form</div>
          <div className="app-step-line"></div>
        </div>
        <div className={`app-step-indicator ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <div className="app-step-circle">{step > 2 ? '✓' : '2'}</div>
          <div className="app-step-label">Upload the requirements</div>
          <div className="app-step-line"></div>
        </div>
        <div className={`app-step-indicator ${step === 3 ? 'active' : ''}`}>
          <div className="app-step-circle">3</div>
          <div className="app-step-label">Confirm and submit</div>
          <div className="app-step-line"></div>
        </div>
      </div>

      {/* STEP 1: FORM DETAILS */}
      {step === 1 && (
        <div className="step-content animate-fade-in">
          
          {/* General Information Section */}
          <h3 className="app-form-title">General Information</h3>
          <p className="form-block-subtitle">Type in the required information about the establishment</p>
          
          <div className="app-form-section">
            <div className="app-form-section-header">Establishment Information</div>
            
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Name Of Establishment <span className="required-asterisk">*</span></label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter establishment name"
                  name="establishmentName"
                  value={formData.establishmentName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Name Of Owner <span className="required-asterisk">*</span></label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter owner name"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Name Of Representative <span className="required-asterisk">*</span></label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter representative name"
                  name="representativeName"
                  value={formData.representativeName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Trade Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter trade name"
                  name="tradeName"
                  value={formData.tradeName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Type Of Occupancy <span className="required-asterisk">*</span></label>
                <CustomSelect 
                  name="occupancyType"
                  value={formData.occupancyType}
                  options={occupancyOptions}
                  onChange={handleInputChange}
                  placeholder="Select type of occupancy"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Total Build Area <span className="required-asterisk">*</span></label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="Enter total build area"
                    name="totalBuildArea"
                    value={formData.totalBuildArea}
                    onChange={handleInputChange}
                    style={{ paddingRight: '4rem' }}
                  />
                  <span className="input-suffix">sqm</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Number Of Occupant <span className="required-asterisk">*</span></label>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="Enter number of occupant"
                  name="numberOfOccupant"
                  value={formData.numberOfOccupant}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Address Information Section */}
          <h3 className="app-form-title" style={{ marginTop: '3.5rem' }}>Address</h3>
          <p className="form-block-subtitle">Type in the address of the establishment</p>
          
          <div className="app-form-section">
            <div className="app-form-section-header">Address Information</div>
            
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Unit No., Block No. / Building Name / Street Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Region <span className="required-asterisk">*</span></label>
                <CustomSelect 
                  name="region"
                  value={formData.region}
                  options={regionOptions}
                  onChange={handleInputChange}
                  placeholder="Select region"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Province <span className="required-asterisk">*</span></label>
                <CustomSelect 
                  name="province"
                  value={formData.province}
                  options={provinceOptions}
                  onChange={handleInputChange}
                  placeholder="Select province"
                  disabled={!formData.region}
                />
              </div>

              <div className="form-group">
                <label className="form-label">City <span className="text-muted" style={{ fontWeight: 'normal', color: 'var(--text-primary-color, #0284c7)' }}>(List of station(s) will be based on your selected city)</span> <span className="required-asterisk">*</span></label>
                <CustomSelect 
                  name="city"
                  value={formData.city}
                  options={cityOptions}
                  onChange={handleInputChange}
                  placeholder="Select city"
                  disabled={!formData.province}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Barangay <span className="required-asterisk">*</span></label>
                <CustomSelect 
                  name="barangay"
                  value={formData.barangay}
                  options={barangayOptions}
                  onChange={handleInputChange}
                  placeholder="Select barangay"
                  disabled={!formData.city}
                />
              </div>
            </div>
          </div>

          {/* Fire Station & Contact Information Section */}
          <h3 className="app-form-title" style={{ marginTop: '3.5rem' }}>Fire Station</h3>
          <p className="form-block-subtitle">The selected fire station will receive your application for processing</p>

          <div className="form-group full-width" style={{ marginBottom: '2.5rem' }}>
            <label className="form-label">Fire Station <span className="required-asterisk">*</span></label>
            <CustomSelect 
              name="fireStation"
              value={formData.fireStation}
              options={stationOptions}
              onChange={handleInputChange}
              placeholder={formData.city ? "Select a fire station" : "Select a city to view stations"}
              disabled={!formData.city}
            />
          </div>

          <div className="form-group full-width" style={{ marginBottom: '4rem' }}>
            <label className="form-label" style={{ marginBottom: '1rem', fontWeight: 500 }}>Is it within Philippine Economic Zone Authority (PEZA)?</label>
            <button 
              type="button" 
              className="ieza-button"
              onClick={() => formData.isPeza ? setFormData(prev => ({ ...prev, isPeza: false })) : setShowPezaModal(true)}
              style={{ 
                opacity: formData.isPeza ? 1 : 0.7,
                filter: formData.isPeza ? 'none' : 'grayscale(0.3)'
              }}
            >
              {formData.isPeza ? "✓ PEZA ESTABLISHMENT" : "CLICK IF PEZA ESTABLISHMENT"}
            </button>

            {/* PEZA Modal */}
            {showPezaModal && (
              <div className="peza-modal-overlay" onClick={() => setShowPezaModal(false)}>
                <div className="peza-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="peza-modal-header">
                    <div className="peza-modal-icon">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                      </svg>
                    </div>
                    <h3>PEZA</h3>
                    <ExitButton onClick={() => setShowPezaModal(false)} />
                  </div>
                  <div className="peza-modal-body">
                    <p>The Philippine Economic Zone Authority (PEZA) is a government agency tasked with promoting investments, extending assistance, registering, granting incentives to, and facilitating the business operations of investors in export-oriented manufacturing and service facilities inside selected areas throughout the country proclaimed by the President of the Philippines as PEZA Special Economic Zones.</p>
                  </div>
                  <div className="peza-modal-actions">
                    <button type="button" className="peza-btn-cancel" onClick={() => setShowPezaModal(false)}>CANCEL</button>
                    <button type="button" className="peza-btn-confirm" onClick={() => { setFormData(prev => ({ ...prev, isPeza: true })); setShowPezaModal(false); }}>YES, THIS IS PEZA</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <h3 className="app-form-title">Contact Information</h3>
          <p className="form-block-subtitle">Type in the owner / representative or your contact information</p>
          
          <div className="app-form-section">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Landline</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter landline number"
                  name="landline"
                  value={formData.landline}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Mobile <span className="required-asterisk">*</span></label>
                <div style={{ position: 'relative' }}>
                  <span className="input-prefix">+63</span>
                  <input 
                    type="text" 
                    className="form-input input-with-prefix" 
                    placeholder="Enter mobile number"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '1rem 0' }}>
            <span className="app-form-confirm-text">Are the details above correct?</span>
          </div>

          <div className="app-form-actions">
            <button type="button" className="btn-back" onClick={onBack}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              Back
            </button>
            
            <div className="app-form-actions-right">
              <button type="button" className="btn-draft" onClick={() => alert('Saved to drafts!')}>
                Save to draft
              </button>
              
              <button type="button" className="btn-submit" onClick={() => setStep(2)}>
                Next Step
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: UPLOAD REQUIREMENTS */}
      {step === 2 && (
        <div className="step-content animate-fade-in">
          <div className="upload-req-header">
            <h3 className="upload-req-title">{selectedCategoryTitle}</h3>
            <p className="upload-req-subtitle">Type of application</p>
          </div>
          
          <p className="upload-req-prompt">Upload required document(s)</p>

          {requiredDocuments.length === 0 ? (
            <div className="empty-requirements-state">
              <img src={EmailVerifiedSVG} alt="No Requirements Needed" className="empty-req-img" />
              <p className="empty-req-text">
                No any kind of requirement(s) is needed for this application. Click <span className="text-highlight">"NEXT STEP"</span> button to go onto next page.
              </p>
            </div>
          ) : (
            <>
              <div className="upload-req-notice">
                <h4 className="notice-title">Important Notice</h4>
                <p className="notice-text">File size limit per upload: 20MB</p>
                <p className="notice-text">Please submit document in scale and in pdf format</p>
              </div>

              <h4 className="upload-req-tracker">{uploadedCount} of {requiredDocuments.length} requirements uploaded</h4>

              <h4 className="upload-req-list-title">Requirement(s):</h4>

              <div className="upload-req-list">
                {requiredDocuments.map((doc, idx) => (
              <div key={idx} className="upload-req-card">
                <div className="req-card-header">
                  <span className="req-item-name">{doc}</span>
                  {uploadedFiles[idx] && <span className="req-status-badge">Uploaded</span>}
                </div>
                
                {uploadedFiles[idx] ? (
                  <div className="req-uploaded-file-card">
                    <div className="uploaded-file-info">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                      <div className="uploaded-file-details">
                        <span className="uploaded-file-name">{uploadedFiles[idx].name}</span>
                        <span className="uploaded-file-size">{(uploadedFiles[idx].size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    </div>
                    <div className="uploaded-file-actions">
                      <button 
                        type="button" 
                        className="btn-view-file"
                        onClick={() => {
                          const fileURL = URL.createObjectURL(uploadedFiles[idx]);
                          window.open(fileURL, '_blank');
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        View
                      </button>
                      <button 
                        type="button" 
                        className="btn-delete-file"
                        onClick={() => setUploadedFiles(prev => {
                          const newFiles = { ...prev };
                          delete newFiles[idx];
                          return newFiles;
                        })}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className={`req-drop-zone ${dragActiveId === idx ? 'drag-active' : ''}`}
                    onClick={() => document.getElementById(`file-upload-${idx}`).click()}
                    onDragOver={(e) => { e.preventDefault(); setDragActiveId(idx); }}
                    onDragLeave={(e) => { e.preventDefault(); setDragActiveId(null); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragActiveId(null);
                      const file = e.dataTransfer.files[0];
                      if (file) {
                        if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
                          setUploadedFiles(prev => ({ ...prev, [idx]: file }));
                        } else {
                          alert('Please upload a PDF file.');
                        }
                      }
                    }}
                  >
                    <svg className="drop-zone-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <p className="drop-zone-text">
                      Drag and drop your file here, or click to browse
                    </p>
                    <input 
                      type="file" 
                      id={`file-upload-${idx}`} 
                      style={{ display: 'none' }} 
                      accept=".pdf"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setUploadedFiles(prev => ({ ...prev, [idx]: file }));
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="upload-req-footer-note">
            <p><strong>Note:</strong> you must prepare signed and sealed requirements after the submission of digital copies.</p>
          </div>
          </>
          )}

          <div className="app-form-actions" style={{ marginTop: '2rem' }}>
            <button type="button" className="btn-back" onClick={() => setStep(1)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              Back
            </button>
            
            <div className="app-form-actions-right">
              <button type="button" className="btn-draft" onClick={() => alert('Saved to drafts!')}>
                Save to draft
              </button>
              <button type="button" className="btn-submit" onClick={() => setStep(3)}>
                Next Step
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>
          </div>
        </div>
      )}


      {/* STEP 3: CONFIRMATION */}
      {step === 3 && (
        <div className="step-content animate-fade-in">

          {/* Application Type Card */}
          <div className="confirm-info-card">
            <div className="confirm-info-icon" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
            </div>
            <div className="confirm-info-text">
              <h4>Application for {selectedCategoryTitle}</h4>
              <p>Type of Application</p>
            </div>
          </div>

          {/* Fire Station Card */}
          <div className="confirm-info-card">
            <div className="confirm-info-icon" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <div className="confirm-info-text">
              <h4>{formData.fireStation || '---'}</h4>
              <p>Fire Station</p>
            </div>
          </div>

          {/* Review Application Details */}
          <div className="confirm-review-section">
            <h3 className="confirm-review-title">Review Application Details</h3>
            <p className="confirm-review-subtitle">Kindly verify all information before submitting your application.</p>

            <div className="confirm-details-grid">
              <div className="confirm-detail-item">
                <span className="detail-label">Establishment Name</span>
                <span className="detail-value">{formData.establishmentName || '---'}</span>
              </div>
              <div className="confirm-detail-item">
                <span className="detail-label">Address</span>
                <span className="detail-value">{formData.address || '---'}, {formData.city || ''} {formData.province || ''} {formData.region || ''}</span>
              </div>
              <div className="confirm-detail-item">
                <span className="detail-label">Name of Owner</span>
                <span className="detail-value">{formData.ownerName || '---'}</span>
              </div>
              <div className="confirm-detail-item">
                <span className="detail-label">Name of Representative</span>
                <span className="detail-value">{formData.representativeName || '---'}</span>
              </div>
              <div className="confirm-detail-item">
                <span className="detail-label">Trade Name</span>
                <span className="detail-value">{formData.tradeName || '---'}</span>
              </div>
              <div className="confirm-detail-item">
                <span className="detail-label">Total Build Area</span>
                <span className="detail-value">{formData.totalBuildArea ? `${formData.totalBuildArea} sqm` : '---'}</span>
              </div>
              <div className="confirm-detail-item">
                <span className="detail-label">Number of Occupant</span>
                <span className="detail-value">{formData.numberOfOccupant || '---'}</span>
              </div>
              <div className="confirm-detail-item">
                <span className="detail-label">Type of Occupancy</span>
                <span className="detail-value">{formData.occupancyType || '---'}</span>
              </div>
            </div>

            {/* Contact Information */}
            <h4 className="confirm-section-divider">Contact Information</h4>
            <div className="confirm-details-grid">
              <div className="confirm-detail-item">
                <span className="detail-label">Mobile</span>
                <span className="detail-value">{formData.mobile ? `+63-${formData.mobile}` : '---'}</span>
              </div>
              <div className="confirm-detail-item">
                <span className="detail-label">Landline</span>
                <span className="detail-value">{formData.landline || '---'}</span>
              </div>
            </div>
          </div>

          {/* Thank You Notice */}
          <div className="confirm-thankyou-notice">
            <div className="confirm-thankyou-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </div>
            <p><em>Thank you for applying through our online application system, please take note of the important notice.</em></p>
          </div>

          {/* Important Notice */}
          <div className="confirm-important-notice">
            <h4>Important notice:</h4>
            <p>* Failure to comply with all the requirements, will result to the disapproval of the application.</p>
            <p>* Please prepare the signed and sealed requirements</p>
          </div>

          {/* Disclaimer */}
          <div className="confirm-disclaimer">
            <p><em>There are two options corresponding to the issuance of permit for the applied establishment / project. If your application is non-compliant to all the processes for the said application, Notice Of Disapproval (NOD) may be issued when applying for Fire Safety Evaluation Clearance (FSEC) or Fire Safety Inspection Certificate (FSIC for Occupancy Permit) and Notice To Comply (NTC) when applying for Fire Safety Inspection Certificate (For Business Permit), which may be followed by other issuances if still non-compliant.</em></p>
            <p style={{ marginTop: '1.5rem' }}>By submitting the application, a message will appear displaying the generated reference number.</p>
          </div>

          {/* Action Buttons */}
          <div className="app-form-actions" style={{ marginTop: '2rem' }}>
            <button type="button" className="btn-back" onClick={() => setStep(2)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              Back
            </button>

            <div className="app-form-actions-right">
              <button type="button" className="btn-draft" onClick={() => alert('Saved to drafts!')}>
                Save to draft
              </button>
              <button type="button" className="btn-submit" onClick={() => { alert('Application successfully submitted!'); navigate('/dashboard'); }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SharedApplicationForm;
