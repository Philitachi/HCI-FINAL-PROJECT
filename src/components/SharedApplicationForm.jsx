import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NewApplication.css';
import '../styles/Complaint.css';

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
              onClick={() => setFormData(prev => ({ ...prev, isPeza: !prev.isPeza }))}
              style={{ 
                opacity: formData.isPeza ? 1 : 0.7,
                filter: formData.isPeza ? 'none' : 'grayscale(0.3)'
              }}
            >
              {formData.isPeza ? "✓ PEZA ESTABLISHMENT" : "CLICK IF PEZA ESTABLISHMENT"}
            </button>
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
          <h3 className="app-form-title">Upload Requirements</h3>
          <p className="form-block-subtitle">Please provide the necessary documents for your application type.</p>
          
          <div className="app-form-section" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', borderStyle: 'dashed' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            <p style={{ color: '#94a3b8' }}>Drag and drop your files here, or click to browse</p>
            <button type="button" className="btn-draft" style={{ marginTop: '1rem' }}>Browse Files</button>
          </div>

          <div className="app-form-actions">
            <button type="button" className="btn-back" onClick={() => setStep(1)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              Back
            </button>
            
            <button type="button" className="btn-submit" onClick={() => setStep(3)}>
              Next Step
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CONFIRMATION */}
      {step === 3 && (
        <div className="step-content animate-fade-in">
          <h3 className="app-form-title">Confirm and Submit</h3>
          <p className="form-block-subtitle">Please review your application details before submitting.</p>
          
          <div className="app-form-section">
            <div className="app-form-ready-box">
              <h4 style={{ margin: '0 0 1rem 0', color: '#14b8a6' }}>Ready to Submit</h4>
              <p style={{ margin: 0, lineHeight: 1.5 }}>Your application for <strong>{selectedCategoryTitle}</strong> is complete and all requirements have been uploaded. By clicking submit, your application will be forwarded to the selected fire station for processing.</p>
            </div>
          </div>

          <div className="app-form-actions">
            <button type="button" className="btn-back" onClick={() => setStep(2)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              Back
            </button>
            
            <button type="button" className="btn-submit" onClick={() => { alert('Application successfully submitted!'); navigate('/dashboard'); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              Submit Application
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default SharedApplicationForm;
