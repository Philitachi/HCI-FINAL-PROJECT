import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/NewApplication.css';
import '../styles/Complaint.css';
import EmailVerifiedSVG from '../assets/EmailVerified.svg';
import ExitButton from './exitButton';
import PezaModal from './PezaModal';
import { FileText, Home, Check, User, MapPin, Calendar, ChevronRight, Info, ArrowLeft, ArrowRight, FileCheck, Eye, X, UploadCloud, Send, XCircle, CheckCircle } from 'lucide-react';
import regionsData from '../data/regions.json';
import provincesData from '../data/provinces.json';
import citiesData from '../data/cities.json';
import barangaysData from '../data/barangays.json';

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

const SharedApplicationForm = ({ selectedCategoryTitle, onBack, draftId, draftData }) => {
  const navigate = useNavigate();
  // We'll map the previous steps 2,3,4 to 1,2,3 for this shared component
  const [step, setStep] = useState(1);

  // Detect if this is a renewal application
  const isRenewal = selectedCategoryTitle?.toUpperCase().includes('RENEWAL');
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Mock previous applications data for renewal
  const previousApplications = [
    // Empty array = no previous applications. Add sample data below to test with applications:
    // {
    //   id: 'APP-2025-1234',
    //   establishmentName: 'Coastal Roasters Café',
    //   owner: 'Maria Santos',
    //   location: '124 Harbor Blvd, West District, Quezon City',
    //   type: 'FSIC - Business Permit',
    //   lastRenewal: 'Mar 15, 2025',
    //   refNo: 'REF-9928-A1',
    //   status: 'Completed'
    // },
    // {
    //   id: 'APP-2025-0987',
    //   establishmentName: 'Meridian Labs Facility',
    //   owner: 'Juan Dela Cruz',
    //   location: '890 Tech Park Way, North District, Makati',
    //   type: 'FSIC - Business Permit',
    //   lastRenewal: 'Jan 22, 2025',
    //   refNo: 'REF-7734-B2',
    //   status: 'Completed'
    // },
  ];

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
    regionCode: '',
    province: '',
    provinceCode: '',
    city: '',
    cityCode: '',
    barangay: '',
    barangayCode: '',
    fireStation: '',
    isPeza: false,
    landline: '',
    mobile: ''
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [reqErrors, setReqErrors] = useState({});
  const reqRefs = useRef([]);

  // Refs for auto-focusing invalid fields
  const refs = {
    establishmentName: useRef(null),
    ownerName: useRef(null),
    representativeName: useRef(null),
    occupancyType: useRef(null),

    totalBuildArea: useRef(null),
    numberOfOccupant: useRef(null),
    region: useRef(null),
    province: useRef(null),
    city: useRef(null),
    barangay: useRef(null),
    fireStation: useRef(null),
    mobile: useRef(null)
  };

  const [uploadedFiles, setUploadedFiles] = useState({});
  const [dragActiveId, setDragActiveId] = useState(null);
  const [showPezaModal, setShowPezaModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedRef, setSubmittedRef] = useState('');
  const [successType, setSuccessType] = useState('Submit'); // 'Submit', 'Draft', or 'Error'

  // Pre-fill form data from draft if provided
  useEffect(() => {
    if (draftData) {
      setFormData(prev => ({
        ...prev,
        establishmentName: draftData.establishmentName || '',
        ownerName: draftData.ownerName || '',
        representativeName: draftData.representativeName || '',
        tradeName: draftData.tradeName || '',
        occupancyType: draftData.occupancyType || '',
        totalBuildArea: draftData.totalBuildArea || '',
        numberOfOccupant: draftData.numberOfOccupant || '',
        address: draftData.address || '',
        region: draftData.region || '',
        regionCode: draftData.regionCode || '',
        province: draftData.province || '',
        provinceCode: draftData.provinceCode || '',
        city: draftData.city || '',
        cityCode: draftData.cityCode || '',
        barangay: draftData.barangay || '',
        barangayCode: draftData.barangayCode || '',
        fireStation: draftData.fireStation || '',
        isPeza: draftData.isPeza || false,
        landline: draftData.landline || '',
        mobile: draftData.mobile || '',
      }));
    }
  }, [draftData]);

  // Generate a random reference number
  const generateRefNumber = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = Math.floor(1000 + Math.random() * 9000);
    const suffix = chars[Math.floor(Math.random() * chars.length)] + Math.floor(1 + Math.random() * 9);
    return `REF-${nums}-${suffix}`;
  };

  // Save application data to Firestore
  const handleSubmitToFirebase = async (status = 'Completeness Check') => {
    setIsSubmitting(true);
    try {
      const session = JSON.parse(localStorage.getItem('userSession') || '{}');
      const refNumber = draftId ? (draftData?.referenceNumber || generateRefNumber()) : generateRefNumber();

      const applicationData = {
        // Form data
        establishmentName: formData.establishmentName,
        ownerName: formData.ownerName,
        representativeName: formData.representativeName,
        tradeName: formData.tradeName,
        occupancyType: formData.occupancyType,
        buildingType: formData.buildingType || '',
        totalBuildArea: formData.totalBuildArea,
        numberOfOccupant: formData.numberOfOccupant,
        address: formData.address,
        region: formData.region,
        province: formData.province,
        city: formData.city,
        barangay: formData.barangay,
        fireStation: formData.fireStation,
        isPeza: formData.isPeza,
        landline: formData.landline,
        mobile: formData.mobile,
        // Meta data
        applicationType: selectedCategoryTitle,
        status: status,
        referenceNumber: refNumber,
        userEmail: session.email || '',
        userName: `${session.firstName || ''} ${session.lastName || ''}`.trim(),
        updatedAt: serverTimestamp(),
      };

      if (draftId) {
        // Update existing draft document
        await updateDoc(doc(db, 'applications', draftId), applicationData);
      } else {
        // Create new document
        applicationData.createdAt = serverTimestamp();
        await addDoc(collection(db, 'applications'), applicationData);
      }

      // Log activity
      await addDoc(collection(db, 'activityLogs'), {
        userEmail: session.email || '',
        action: status === 'Draft' ? 'Saved Draft' : 'Submitted Application',
        referenceNumber: refNumber,
        establishmentName: formData.establishmentName || '---',
        applicationType: selectedCategoryTitle,
        timestamp: serverTimestamp()
      });

      if (status === 'Draft') {
        setSuccessType('Draft');
        setSubmittedRef(refNumber);
        setShowSuccessModal(true);
      } else {
        setSuccessType('Submit');
        setSubmittedRef(refNumber);
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Error saving application:', error);
      setSuccessType('Error');
      setShowSuccessModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

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
  const buildingOptions = ['High Rise', 'Mid Rise', 'Low Rise', 'Single Detached', 'Rowhouse', 'Apartment', 'Condominium', 'Warehouse', 'Other'];



  // PSGC address options
  const regionOptions = useMemo(() => regionsData.map(r => r.name), []);
  const regionCodeMap = useMemo(() => {
    const map = {};
    regionsData.forEach(r => { map[r.name] = r.code; });
    return map;
  }, []);
  const regionNameMap = useMemo(() => {
    const map = {};
    regionsData.forEach(r => { map[r.code] = r.name; });
    return map;
  }, []);

  const provinceOptions = useMemo(() => {
    if (!formData.regionCode) return [];
    return (provincesData[formData.regionCode] || []).map(p => p.name);
  }, [formData.regionCode]);
  const provinceCodeMap = useMemo(() => {
    if (!formData.regionCode) return {};
    const map = {};
    (provincesData[formData.regionCode] || []).forEach(p => { map[p.name] = p.code; });
    return map;
  }, [formData.regionCode]);

  const cityOptions = useMemo(() => {
    if (!formData.provinceCode) return [];
    return (citiesData[formData.provinceCode] || []).map(c => c.name);
  }, [formData.provinceCode]);
  const cityCodeMap = useMemo(() => {
    if (!formData.provinceCode) return {};
    const map = {};
    (citiesData[formData.provinceCode] || []).forEach(c => { map[c.name] = c.code; });
    return map;
  }, [formData.provinceCode]);

  const barangayOptions = useMemo(() => {
    if (!formData.cityCode) return [];
    return (barangaysData[formData.cityCode] || []).map(b => b.name);
  }, [formData.cityCode]);

  const stationOptions = ['Main Fire Station', 'Sub Station 1', 'Sub Station 2', 'Central District Station'];

  // Helper to get display names from codes
  const getRegionName = () => regionNameMap[formData.regionCode] || '';
  const getProvinceName = () => {
    if (!formData.regionCode || !formData.provinceCode) return '';
    const prov = (provincesData[formData.regionCode] || []).find(p => p.code === formData.provinceCode);
    return prov ? prov.name : '';
  };
  const getCityName = () => {
    if (!formData.provinceCode || !formData.cityCode) return '';
    const city = (citiesData[formData.provinceCode] || []).find(c => c.code === formData.cityCode);
    return city ? city.name : '';
  };
  const getBarangayName = () => {
    if (!formData.cityCode || !formData.barangayCode) return '';
    const brgy = (barangaysData[formData.cityCode] || []).find(b => b.code === formData.barangayCode);
    return brgy ? brgy.name : '';
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };

      // Cascading address resets + code lookup
      if (name === 'region') {
        updated.regionCode = regionCodeMap[value] || '';
        updated.provinceCode = '';
        updated.province = '';
        updated.cityCode = '';
        updated.city = '';
        updated.barangayCode = '';
        updated.barangay = '';
      }
      if (name === 'province') {
        updated.provinceCode = provinceCodeMap[value] || '';
        updated.cityCode = '';
        updated.city = '';
        updated.barangayCode = '';
        updated.barangay = '';
      }
      if (name === 'city') {
        updated.cityCode = cityCodeMap[value] || '';
        updated.barangayCode = '';
        updated.barangay = '';
      }
      if (name === 'barangay') {
        // Look up barangay code
        const brgyList = barangaysData[updated.cityCode] || [];
        const found = brgyList.find(b => b.name === value);
        updated.barangayCode = found ? found.code : '';
      }
      return updated;
    });

    // Clear error when field is populated
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      // Validate Step 1 fields
      const errors = {};
      const requiredFields = [
        'establishmentName', 'ownerName', 'representativeName',
        'occupancyType', 'totalBuildArea', 'numberOfOccupant',
        'region', 'province', 'city', 'barangay', 'fireStation', 'mobile'
      ];

      let firstInvalidField = null;

      requiredFields.forEach(field => {
        if (!formData[field]) {
          errors[field] = true;
          if (!firstInvalidField) firstInvalidField = field;
        }
      });



      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);

        // Focus the first invalid field
        if (firstInvalidField && refs[firstInvalidField].current) {
          // Check if it's the CustomSelect component (it has a click handler on the container)
          const refElem = refs[firstInvalidField].current;
          if (refElem.classList && refElem.classList.contains('custom-select-container')) {
            // Scroll to the CustomSelect
            refElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Add a visual pulse effect
            refElem.firstChild.classList.add('error-pulse');
            setTimeout(() => {
              if (refElem.firstChild) refElem.firstChild.classList.remove('error-pulse');
            }, 1000);
          } else {
            // Standard input focus
            refElem.focus();
            refElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
        return; // Prevent advancing
      }
    } else if (step === 2) {
      // Document upload validation is skipped for now
    }

    setStep(step + 1);
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

      {/* STEP 1: FORM DETAILS (or RENEWAL APPLICATIONS LIST) */}
      {step === 1 && (
        <div className="step-content animate-fade-in">

          {isRenewal ? (
            /* ===== RENEWAL: Show Previous Applications List ===== */
            <div className="renewal-applications-container">
              <div className="renewal-header">
                <div className="renewal-header-icon">
                  <FileText size={28} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="renewal-title">Applications</h3>
                  <p className="renewal-subtitle">Select a previous application to renew</p>
                </div>
              </div>

              {previousApplications.length > 0 ? (
                <div className="renewal-app-list">
                  {previousApplications.map((app) => (
                    <div
                      key={app.id}
                      className={`renewal-app-card ${selectedApplication?.id === app.id ? 'selected' : ''}`}
                      onClick={() => setSelectedApplication(app)}
                    >
                      <div className="renewal-app-icon">
                        <Home size={24} strokeWidth={2} />
                      </div>
                      <div className="renewal-app-info">
                        <div className="renewal-app-name-row">
                          <h4 className="renewal-app-name">{app.establishmentName}</h4>
                          <span className="renewal-app-status-badge">
                            <Check size={12} strokeWidth={2.5} />
                            {app.status}
                          </span>
                        </div>
                        <div className="renewal-app-details">
                          <span className="renewal-app-detail">
                            <User size={14} strokeWidth={2} />
                            {app.owner}
                          </span>
                          <span className="renewal-app-detail">
                            <MapPin size={14} strokeWidth={2} />
                            {app.location}
                          </span>
                        </div>
                        <div className="renewal-app-meta">
                          <span className="renewal-app-meta-item">
                            <Calendar size={13} strokeWidth={2} />
                            Last Renewed: {app.lastRenewal}
                          </span>
                          <span className="renewal-app-meta-item">
                            <FileText size={13} strokeWidth={2} />
                            {app.refNo}
                          </span>
                        </div>
                      </div>
                      <div className="renewal-app-select-indicator">
                        <ChevronRight size={20} strokeWidth={2} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="renewal-empty-state">
                  <div className="renewal-empty-icon">
                    <FileText size={56} strokeWidth={1.2} />
                  </div>
                  <h3 className="renewal-empty-title">No Previous Applications Found</h3>
                  <p className="renewal-empty-subtitle">We couldn't find any previous applications linked to your account.</p>

                  <div className="renewal-info-banner">
                    <div className="renewal-info-banner-icon">
                      <Info size={20} strokeWidth={2} />
                    </div>
                    <p>If your business establishment is missing, please contact your nearest fire station to have your record linked to your account.</p>
                  </div>
                </div>
              )}

              <div className="app-form-actions">
                <button type="button" className="btn-back" onClick={onBack}>
                  <ArrowLeft size={18} strokeWidth={2} />
                  Back
                </button>

                {previousApplications.length > 0 && (
                  <div className="app-form-actions-right">
                    <button
                      type="button"
                      className="btn-submit"
                      disabled={!selectedApplication}
                      onClick={() => { if (selectedApplication) setStep(2); }}
                      style={{ opacity: selectedApplication ? 1 : 0.5, cursor: selectedApplication ? 'pointer' : 'not-allowed' }}
                    >
                      Proceed to Renewal
                      <ArrowRight size={18} strokeWidth={2} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ===== NON-RENEWAL: Original Form ===== */
            <>
              {/* General Information Section */}
              <h3 className="app-form-title">General Information</h3>
              <p className="form-block-subtitle">Type in the required information about the establishment</p>

              <div className="app-form-section">
                <div className="app-form-section-header">Establishment Information</div>

                <div className="form-grid">
                  <div className="form-group full-width">
                    <label className="form-label">Name Of Establishment <span className="required-asterisk">*</span></label>
                    <input
                      ref={refs.establishmentName}
                      type="text"
                      className={`form-input ${fieldErrors.establishmentName ? 'input-error' : ''}`}
                      placeholder="Enter establishment name"
                      name="establishmentName"
                      value={formData.establishmentName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Name Of Owner <span className="required-asterisk">*</span></label>
                    <input
                      ref={refs.ownerName}
                      type="text"
                      className={`form-input ${fieldErrors.ownerName ? 'input-error' : ''}`}
                      placeholder="Enter owner name"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Name Of Representative <span className="required-asterisk">*</span></label>
                    <input
                      ref={refs.representativeName}
                      type="text"
                      className={`form-input ${fieldErrors.representativeName ? 'input-error' : ''}`}
                      placeholder="Enter representative name"
                      name="representativeName"
                      value={formData.representativeName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group full-width">
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
                    <div ref={refs.occupancyType}>
                      <CustomSelect
                        name="occupancyType"
                        value={formData.occupancyType}
                        options={occupancyOptions}
                        onChange={handleInputChange}
                        placeholder="Select type of occupancy"
                        error={fieldErrors.occupancyType}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Type Of Building</label>
                    <div ref={refs.buildingType}>
                      <CustomSelect
                        name="buildingType"
                        value={formData.buildingType || ''}
                        options={buildingOptions}
                        onChange={handleInputChange}
                        placeholder="Select type of building"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Total Build Area <span className="required-asterisk">*</span></label>
                    <div style={{ position: 'relative' }}>
                      <input
                        ref={refs.totalBuildArea}
                        type="number"
                        className={`form-input ${fieldErrors.totalBuildArea ? 'input-error' : ''}`}
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
                      ref={refs.numberOfOccupant}
                      type="number"
                      className={`form-input ${fieldErrors.numberOfOccupant ? 'input-error' : ''}`}
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
                    <div ref={refs.region}>
                      <CustomSelect
                        name="region"
                        value={formData.region}
                        options={regionOptions}
                        onChange={handleInputChange}
                        placeholder="Select region"
                        error={fieldErrors.region}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Province <span className="required-asterisk">*</span></label>
                    <div ref={refs.province}>
                      <CustomSelect
                        name="province"
                        value={formData.province}
                        options={provinceOptions}
                        onChange={handleInputChange}
                        placeholder="Select province"
                        disabled={!formData.region}
                        error={fieldErrors.province}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">City <span className="text-muted" style={{ fontWeight: 'normal', color: 'var(--text-primary-color, #0284c7)' }}>(List of station(s) will be based on your selected city)</span> <span className="required-asterisk">*</span></label>
                    <div ref={refs.city}>
                      <CustomSelect
                        name="city"
                        value={formData.city}
                        options={cityOptions}
                        onChange={handleInputChange}
                        placeholder="Select city"
                        disabled={!formData.province}
                        error={fieldErrors.city}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Barangay <span className="required-asterisk">*</span></label>
                    <div ref={refs.barangay}>
                      <CustomSelect
                        name="barangay"
                        value={formData.barangay}
                        options={barangayOptions}
                        onChange={handleInputChange}
                        placeholder="Select barangay"
                        disabled={!formData.city}
                        error={fieldErrors.barangay}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Fire Station & Contact Information Section */}
              <h3 className="app-form-title" style={{ marginTop: '3.5rem' }}>Fire Station</h3>
              <p className="form-block-subtitle">The selected fire station will receive your application for processing</p>

              <div className="form-group full-width" style={{ marginBottom: '2.5rem' }}>
                <label className="form-label">Fire Station <span className="required-asterisk">*</span></label>
                <div ref={refs.fireStation}>
                  <CustomSelect
                    name="fireStation"
                    value={formData.fireStation}
                    options={stationOptions}
                    onChange={handleInputChange}
                    placeholder={formData.city ? "Select a fire station" : "Select a city to view stations"}
                    disabled={!formData.city}
                    error={fieldErrors.fireStation}
                  />
                </div>
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
                  <PezaModal 
                    onClose={() => setShowPezaModal(false)}
                    onConfirm={() => {
                      setFormData(prev => ({ ...prev, isPeza: true }));
                      setShowPezaModal(false);
                    }}
                  />
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
                        ref={refs.mobile}
                        type="text"
                        className={`form-input input-with-prefix ${fieldErrors.mobile ? 'input-error' : ''}`}
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
                  <button type="button" className="btn-draft" onClick={() => handleSubmitToFirebase('Draft')} disabled={isSubmitting}>
                    Save to draft
                  </button>

                  <button type="button" className="btn-submit" onClick={handleNextStep}>
                    Next Step
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </button>
                </div>
              </div>
            </>
          )}
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
                  <div
                    key={idx}
                    className="upload-req-card"
                    ref={(el) => reqRefs.current[idx] = el}
                  >
                    <div className="req-card-header">
                      <span className="req-item-name">{doc} <span className="required-asterisk">*</span></span>
                      {uploadedFiles[idx] && <span className="req-status-badge">Uploaded</span>}
                    </div>

                    {uploadedFiles[idx] ? (
                      <div className="req-uploaded-file-card">
                        <div className="uploaded-file-info">
                          <FileCheck size={24} color="#14b8a6" strokeWidth={2} />
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
                            <Eye size={18} strokeWidth={2} />
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
                            <X size={18} strokeWidth={2} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`req-drop-zone ${dragActiveId === idx ? 'drag-active' : ''} ${reqErrors[idx] ? 'input-error' : ''}`}
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
                              setReqErrors(prev => ({ ...prev, [idx]: false }));
                            } else {
                              alert('Please upload a PDF file.');
                            }
                          }
                        }}
                      >
                        <UploadCloud size={32} strokeWidth={1.5} className="drop-zone-icon" style={{ marginBottom: '1rem' }} />
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
                              setReqErrors(prev => ({ ...prev, [idx]: false }));
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
              <ArrowLeft size={18} strokeWidth={2} />
              Back
            </button>

            <div className="app-form-actions-right">
              <button type="button" className="btn-draft" onClick={() => handleSubmitToFirebase('Draft')} disabled={isSubmitting}>
                Save to draft
              </button>
              <button type="button" className="btn-submit" onClick={handleNextStep}>
                Next Step
                <ArrowRight size={18} strokeWidth={2} />
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
              <FileText size={28} color="#ef4444" strokeWidth={2} />
            </div>
            <div className="confirm-info-text">
              <h4>Application for {selectedCategoryTitle}</h4>
              <p>Type of Application</p>
            </div>
          </div>

          {/* Fire Station Card */}
          <div className="confirm-info-card">
            <div className="confirm-info-icon" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))' }}>
              <Home size={28} color="#ef4444" strokeWidth={2} />
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
                <span className="detail-value">{formData.address || '---'}, {formData.barangay || ''}, {formData.city || ''}, {formData.province || ''}, {formData.region || ''}</span>
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
              <div className="confirm-detail-item">
                <span className="detail-label">Type of Building</span>
                <span className="detail-value">{formData.buildingType || '---'}</span>
              </div>
              <div className="confirm-detail-item">
                <span className="detail-label">PEZA Establishment</span>
                <span className="detail-value">{formData.isPeza ? 'Yes' : 'No'}</span>
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
              <Info size={20} strokeWidth={2} />
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
              <ArrowLeft size={18} strokeWidth={2} />
              Back
            </button>

            <div className="app-form-actions-right">
              <button type="button" className="btn-draft" onClick={() => handleSubmitToFirebase('Draft')} disabled={isSubmitting}>
                Save to draft
              </button>
              <button type="button" className="btn-submit" onClick={() => handleSubmitToFirebase()} disabled={isSubmitting}>
                <Send size={18} strokeWidth={2} />
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <div className="success-modal-icon">
              <div className={`success-icon-circle ${successType === 'Error' ? 'error-icon' : ''}`}>
                {successType === 'Error' ? (
                  <XCircle size={48} color="#ef4444" strokeWidth={2.5} />
                ) : (
                  <CheckCircle size={48} color="#14b8a6" strokeWidth={2.5} />
                )}
              </div>
            </div>
            <h2 className="success-modal-title">
              {successType === 'Draft' ? 'Application Saved to Draft!' : 
               successType === 'Error' ? 'Submission Failed' : 'Application Submitted!'}
            </h2>
            <p className="success-modal-message">
              {successType === 'Draft' 
                ? 'Your application has been successfully saved to your drafts. Kindly check it on your drafts.' 
                : successType === 'Error'
                ? 'Something went wrong while saving your application. Please try again later.'
                : 'You have successfully submitted your application. Kindly check it on your ongoing applications.'}
            </p>
            {(successType === 'Submit' || successType === 'Draft') && submittedRef && (
              <div className="success-ref-box">
                <span className="success-ref-label">Reference Number:</span>
                <span className="success-ref-value">{submittedRef}</span>
              </div>
            )}
            <button className={`btn-success-close ${successType === 'Error' ? 'btn-error-retry' : ''}`} onClick={() => {
              setShowSuccessModal(false);
              if (successType !== 'Error') {
                navigate('/dashboard');
              }
            }}>
              {successType === 'Error' ? 'Try Again' : 'Go to Dashboard'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default SharedApplicationForm;
