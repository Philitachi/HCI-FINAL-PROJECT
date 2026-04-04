import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Complaint.css';
import './Dashboard/dashboard.css';

const PublicComplaint = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    email: '',
    contactNum: '',
    gender: '',
    otherGender: '',
    officialInvolved: '',
    region: '',
    fireStation: '',
    directorate: '',
    nature: [],
    narration: '',
    consent: false
  });
  
  const [errors, setErrors] = useState({});

  const natureOptions = [
    "(A) Failure to set up the most current and updated Citizens Charter;",
    "(B) Violation of the Zero-Contact Policy;",
    "(C) Selling, offering to sell, or recommending specific brands of fire extinguishers and other fire safety equipment to any applicant or requesting party or business entity by the Bureau of Fire Protection or any of its official or employees;",
    "(D) Refusal to accept application or request with complete requirements being submitted by an applicant or requesting party without due cause;",
    "(E) Imposition of additional requirements other than those listed in the Citizen's Charter;",
    "(F) Imposition of additional costs not reflected in the Citizen's Charter;",
    "(G) Failure to give the applicant or requesting party a written notice on the disapproval of an application or request;",
    "(H) Failure to render government services within the prescribed processing time on any application or request without due cause;",
    "(I) Failure to attend to applicants or requesting parties who are within the premises of the office or agency concerned prior to the end of official working hours and during lunch break;",
    "(J) Failure or refusal to issue official receipts;",
    "Others"
  ];

  const fireStationsByRegion = {
    "REGION I (ILOCOS REGION)": [
      "Laoag City Fire Station", "Vigan City Fire Station", "San Fernando City Fire Station (La Union)", 
      "Dagupan City Fire Station", "Urdaneta City Fire Station", "Alaminos City Fire Station", 
      "Candon City Fire Station", "Batac City Fire Station", "Lingayen Fire Station", "Bauang Fire Station"
    ],
    "REGION II (CAGAYAN VALLEY)": [
      "Tuguegarao City Fire Station", "Cauayan City Fire Station", "Ilagan City Fire Station",
      "Santiago City Fire Station", "Bayombong Fire Station", "Solano Fire Station",
      "Aparri Fire Station", "Roxas Fire Station (Isabela)", "Cabarroguis Fire Station", "Basco Fire Station"
    ],
    "REGION III (CENTRAL LUZON)": [
      "Angeles City Fire Station", "San Fernando City Fire Station (Pampanga)", "Malolos City Fire Station",
      "Meycauayan City Fire Station", "Tarlac City Fire Station", "Cabanatuan City Fire Station",
      "Olongapo City Fire Station", "Balanga City Fire Station", "Palayan City Fire Station", "San Jose City Fire Station"
    ],
    "REGION IV-A (CALABARZON)": [
      "Antipolo City Fire Station", "Batangas City Fire Station", "Lucena City Fire Station",
      "Calamba City Fire Station", "Santa Rosa City Fire Station", "Dasmariñas City Fire Station",
      "Tagaytay City Fire Station", "Trece Martires City Fire Station", "San Pablo City Fire Station", "Lipa City Fire Station"
    ],
    "REGION IV-B (MIMAROPA)": [
      "Puerto Princesa City Fire Station", "Calapan City Fire Station", "Boac Fire Station",
      "Romblon Fire Station", "San Jose Fire Station (Occidental Mindoro)", "Odiongan Fire Station",
      "Coron Fire Station", "Roxas Fire Station (Palawan)", "Sablayan Fire Station", "Mamburao Fire Station"
    ],
    "REGION V (BICOL REGION)": [
      "Legazpi City Fire Station", "Naga City Fire Station", "Sorsogon City Fire Station",
      "Iriga City Fire Station", "Tabaco City Fire Station", "Ligao City Fire Station",
      "Masbate City Fire Station", "Virac Fire Station", "Daet Fire Station", "Pili Fire Station"
    ],
    "REGION VI (WESTERN VISAYAS)": [
      "Iloilo City Fire Station", "Bacolod City Fire Station", "Roxas City Fire Station",
      "Kalibo Fire Station", "San Jose de Buenavista Fire Station", "Passi City Fire Station",
      "Silay City Fire Station", "Bago City Fire Station", "Cadiz City Fire Station", "Kabankalan City Fire Station"
    ],
    "REGION VII (CENTRAL VISAYAS)": [
      "Cebu City Fire Station", "Mandaue City Fire Station", "Lapu-Lapu City Fire Station",
      "Dumaguete City Fire Station", "Tagbilaran City Fire Station", "Toledo City Fire Station",
      "Danao City Fire Station", "Bais City Fire Station", "Bayawan City Fire Station", "Siquijor Fire Station"
    ],
    "REGION VIII (EASTERN VISAYAS)": [
      "Tacloban City Fire Station", "Ormoc City Fire Station", "Calbayog City Fire Station",
      "Catbalogan City Fire Station", "Maasin City Fire Station", "Borongan City Fire Station",
      "Baybay City Fire Station", "Guiuan Fire Station", "Naval Fire Station", "Catarman Fire Station"
    ],
    "REGION IX (ZAMBOANGA PENINSULA)": [
      "Zamboanga City Fire Station", "Pagadian City Fire Station", "Dipolog City Fire Station",
      "Dapitan City Fire Station", "Isabela City Fire Station", "Ipil Fire Station",
      "Sindangan Fire Station", "Liloy Fire Station", "Molave Fire Station", "Margosatubig Fire Station"
    ],
    "REGION X (NORTHERN MINDANAO)": [
      "Cagayan de Oro City Fire Station", "Iligan City Fire Station", "Malaybalay City Fire Station",
      "Valencia City Fire Station", "Ozamiz City Fire Station", "Tangub City Fire Station",
      "Oroquieta City Fire Station", "Gingoog City Fire Station", "El Salvador City Fire Station", "Tubod Fire Station"
    ],
    "REGION XI (DAVAO REGION)": [
      "Davao City Fire District", "Tagum City Fire Station", "Digos City Fire Station",
      "Panabo City Fire Station", "Mati City Fire Station", "Island Garden City of Samal (IGACOS) Fire Station",
      "Bansalan Fire Station", "Malita Fire Station", "Nabunturan Fire Station", "Compostela Fire Station"
    ],
    "REGION XII (SOCCSKSARGEN)": [
      "General Santos City Fire Station", "Koronadal City Fire Station", "Kidapawan City Fire Station",
      "Tacurong City Fire Station", "Polomolok Fire Station", "Surallah Fire Station",
      "Isulan Fire Station", "Alabel Fire Station", "Malapatan Fire Station", "Midsayap Fire Station"
    ],
    "NATIONAL CAPITAL REGION (NCR)": [
      "Manila Fire District", "Quezon City Fire District", "Makati City Fire Station",
      "Pasig City Fire Station", "Taguig City Fire Station", "Caloocan City Fire Station",
      "Pasay City Fire Station", "Parañaque City Fire Station", "Valenzuela City Fire Station", "Marikina City Fire Station"
    ],
    "CORDILLERA ADMINISTRATIVE REGION (CAR)": [
      "Baguio City Fire Station", "La Trinidad Fire Station", "Bangued Fire Station",
      "Bontoc Fire Station", "Lagawe Fire Station", "Tabuk City Fire Station",
      "Kabayan Fire Station", "Itogon Fire Station", "Tuba Fire Station", "Bauko Fire Station"
    ],
    "BANGSAMORO AUTONOMOUS REGION IN MUSLIM MINDANAO (ARMM)": [
      "Marawi City Fire Station", "Jolo Fire Station", "Bongao Fire Station",
      "Lamitan City Fire Station", "Shariff Aguak Fire Station", "Datu Odin Sinsuat Fire Station",
      "Wao Fire Station", "Maluso Fire Station", "Panglima Sugala Fire Station", "Parang Fire Station"
    ],
    "REGION XIII (Caraga)": [
      "Butuan City Fire Station", "Surigao City Fire Station", "Bayugan City Fire Station",
      "Cabadbaran City Fire Station", "Tandag City Fire Station", "Bislig City Fire Station",
      "San Francisco Fire Station", "Trento Fire Station", "Prosperidad Fire Station", "Dapa Fire Station"
    ]
  };

  const regionList = Object.keys(fireStationsByRegion);

  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isFireStationOpen, setIsFireStationOpen] = useState(false);
  
  const regionRef = useRef(null);
  const stationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (regionRef.current && !regionRef.current.contains(event.target)) {
        setIsRegionOpen(false);
      }
      if (stationRef.current && !stationRef.current.contains(event.target)) {
        setIsFireStationOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && name === 'nature') {
      const updatedNature = checked 
        ? [...formData.nature, value] 
        : formData.nature.filter(n => n !== value);
      setFormData({ ...formData, nature: updatedNature });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      if (name === 'region') {
        setFormData({ ...formData, region: value, fireStation: '' });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    }
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.contactNum) newErrors.contactNum = 'Contact number is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    else if (formData.gender === 'Other' && !formData.otherGender) newErrors.otherGender = 'Please specify your gender';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.officialInvolved) newErrors.officialInvolved = 'Government Official Involved is required';
    if (!formData.region) newErrors.region = 'Region is required';
    if (!formData.fireStation) newErrors.fireStation = 'Fire Station is required';
    // Add other validations if needed
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if user accidentally triggered submit (e.g., via Enter key) on an earlier step
    if (step < 3) {
      handleNext();
      return;
    }

    if (!formData.consent) {
      setErrors({ consent: 'You must agree to the Data Privacy Statement to submit a complaint.' });
      return;
    }
    
    // Handle form submission logic here
    console.log("Form submitted", formData);
    alert("Complaint submitted successfully!");
    // Reset or redirect
  };

  return (
    <div className="public-complaint-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="public-complaint-body" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <main className="public-main-content" style={{ width: '100%', maxWidth: '1000px', padding: '8rem 2rem 3rem 2rem' }}>
          <div className="complaint-header">
            <h1 className="complaint-title">Complaint Form</h1>
            <p className="complaint-subtitle">Submit your complaint here</p>
          </div>

          <div className="complaint-content">
            <div className="complaint-card">
              
              {/* Progress Wizard */}
              <div className="complaint-steps">
                <div className={`step-indicator ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                  <div className="step-circle">{step > 1 ? '✓' : '1'}</div>
                  <div className="step-label">Information</div>
                  <div className="step-line"></div>
                </div>
                <div className={`step-indicator ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                  <div className="step-circle">{step > 2 ? '✓' : '2'}</div>
                  <div className="step-label">Details</div>
                  <div className="step-line"></div>
                </div>
                <div className={`step-indicator ${step === 3 ? 'active' : ''}`}>
                  <div className="step-circle">3</div>
                  <div className="step-label">Consent</div>
                  <div className="step-line"></div>
                </div>
              </div>

              {step === 1 && (
                <div className="info-banner">
                  <div className="info-banner-icon">i</div>
                  <div className="info-banner-text">
                    Kindly provide us with details about the incident you wish to complain. Our legal team will investigate your complaint and take the necessary action. Be part of the solution. BFP will handle your case with care and assist you the best way we can.
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* STEP 1: COMPLAINANT INFORMATION */}
                {step === 1 && (
                  <div className="step-content animate-fade-in">
                    <div className="form-section-title">Complainant Information</div>
                    
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Name <span className="required-asterisk">*</span></label>
                        <input 
                          type="text" 
                          className={`form-input ${errors.name ? 'error' : ''}`} 
                          placeholder="Enter your full name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                        {errors.name && <span className="error-message">{errors.name}</span>}
                      </div>
                      
                      <div className="form-group">
                        <label className="form-label">Address <span className="required-asterisk">*</span></label>
                        <input 
                          type="text" 
                          className={`form-input ${errors.address ? 'error' : ''}`} 
                          placeholder="Enter your address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                        />
                        {errors.address && <span className="error-message">{errors.address}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Email <span className="required-asterisk">*</span></label>
                        <input 
                          type="email" 
                          className={`form-input ${errors.email ? 'error' : ''}`} 
                          placeholder="Enter your email address"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Contact Number <span className="required-asterisk">*</span></label>
                        <input 
                          type="text" 
                          className={`form-input ${errors.contactNum ? 'error' : ''}`} 
                          placeholder="Enter your contact number"
                          name="contactNum"
                          value={formData.contactNum}
                          onChange={handleInputChange}
                        />
                        {errors.contactNum && <span className="error-message">{errors.contactNum}</span>}
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">Gender <span className="required-asterisk">*</span></label>
                        <div className="radio-group">
                          {['Male', 'Female', 'Prefer not to say', 'Other'].map((option) => (
                            <label key={option} className="checkbox-label" style={{ alignItems: 'center' }}>
                              <input 
                                type="radio" 
                                name="gender" 
                                value={option}
                                checked={formData.gender === option}
                                onChange={handleInputChange}
                                className="checkbox-input"
                              />
                              {option}
                            </label>
                          ))}
                        </div>
                        {errors.gender && <span className="error-message">{errors.gender}</span>}
                        
                        {formData.gender === 'Other' && (
                          <div style={{ marginTop: '1rem', maxWidth: '300px' }} className="animate-fade-in">
                            <input 
                              type="text" 
                              name="otherGender" 
                              className={`form-input ${errors.otherGender ? 'error' : ''}`}
                              placeholder="Please specify"
                              value={formData.otherGender}
                              onChange={handleInputChange}
                            />
                            {errors.otherGender && <span className="error-message" style={{ display: 'block' }}>{errors.otherGender}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: DETAILS OF COMPLAINT */}
                {step === 2 && (
                  <div className="step-content animate-fade-in">
                    <div className="form-section-title">Details of Complaint</div>
                    
                    <div className="form-grid">
                      <div className="form-group full-width">
                        <label className="form-label">Government Official Involved <span className="required-asterisk">*</span></label>
                        <input 
                          type="text" 
                          className={`form-input ${errors.officialInvolved ? 'error' : ''}`} 
                          placeholder="Enter Government Official Involved"
                          name="officialInvolved"
                          value={formData.officialInvolved}
                          onChange={handleInputChange}
                        />
                        {errors.officialInvolved && <span className="error-message">{errors.officialInvolved}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Region <span className="required-asterisk">*</span></label>
                        <div className="custom-select-container" ref={regionRef}>
                          <div 
                            className={`custom-select-trigger ${errors.region ? 'error' : ''} ${isRegionOpen ? 'open' : ''}`}
                            onClick={() => setIsRegionOpen(!isRegionOpen)}
                          >
                            {formData.region || "Select Region"}
                            <div className="custom-select-arrow"></div>
                          </div>
                          {isRegionOpen && (
                            <ul className="custom-options-list">
                              {regionList.map((region) => (
                                <li 
                                  key={region} 
                                  className={`custom-option ${formData.region === region ? 'selected' : ''}`}
                                  onClick={() => {
                                    setFormData({ ...formData, region, fireStation: '' });
                                    setIsRegionOpen(false);
                                  }}
                                >
                                  {region}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        {errors.region && <span className="error-message">{errors.region}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Fire Station <span className="required-asterisk">*</span></label>
                        <div className="custom-select-container" ref={stationRef}>
                          <div 
                            className={`custom-select-trigger ${!formData.region ? 'disabled' : ''} ${errors.fireStation ? 'error' : ''} ${isFireStationOpen ? 'open' : ''}`}
                            onClick={() => {
                              if (formData.region) setIsFireStationOpen(!isFireStationOpen);
                            }}
                          >
                            {formData.fireStation || (formData.region ? "Select Fire Station" : "Select Region First")}
                            <div className="custom-select-arrow"></div>
                          </div>
                          {isFireStationOpen && (
                            <ul className="custom-options-list">
                              {fireStationsByRegion[formData.region]?.map((station) => (
                                <li 
                                  key={station} 
                                  className={`custom-option ${formData.fireStation === station ? 'selected' : ''}`}
                                  onClick={() => {
                                    setFormData({ ...formData, fireStation: station });
                                    setIsFireStationOpen(false);
                                  }}
                                >
                                  {station}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        {errors.fireStation && <span className="error-message">{errors.fireStation}</span>}
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">Directorate / Division / Unit</label>
                        <textarea 
                          className="form-textarea" 
                          placeholder="Specify the directorate, division, or unit"
                          name="directorate"
                          value={formData.directorate}
                          onChange={handleInputChange}
                          style={{ minHeight: '80px' }}
                        ></textarea>
                      </div>

                      <div className="form-group full-width">
                        <label className="form-label">Nature of Complaint: (Please check all that applies)</label>
                        <div className="checkbox-group">
                          {natureOptions.map((option, idx) => (
                            <label key={idx} className="checkbox-label">
                              <input 
                                type="checkbox"
                                name="nature"
                                value={option}
                                checked={formData.nature.includes(option)}
                                onChange={handleInputChange}
                                className="checkbox-input"
                              />
                              {option}
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="form-group full-width" style={{ marginTop: '1rem' }}>
                        <label className="form-label">NARRATION OF FACTS: Please state the events leading to the filing of this complaint</label>
                        <textarea 
                          className="form-textarea"
                          placeholder="Type your narrative here..."
                          name="narration"
                          value={formData.narration}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: DATA PRIVACY CONSENT */}
                {step === 3 && (
                  <div className="step-content animate-fade-in">
                    <div className="form-section-title">Data Privacy Consent</div>
                    
                    <div className="privacy-consent-card">
                      <label className="checkbox-label" style={{ alignItems: 'flex-start' }}>
                        <input 
                          type="checkbox"
                          name="consent"
                          checked={formData.consent}
                          onChange={handleInputChange}
                          className={`checkbox-input ${errors.consent ? 'error' : ''}`}
                          style={{ marginTop: '4px' }}
                        />
                        <span>
                          I have read and understood the foregoing Data Privacy Statement and express my consent for Bureau of Fire Protection to collect, record, organize, update or modify, retrieve, use, consolidate, block, erase or destruct my personal data as part of my information. I affirm my right to be informed, object to processing, access and rectify, suspend or withdraw my personal data, and be indemnified in case of damage pursuant to the provisions of Republic Act No. 10173 or Data Privacy Act 2012. <span className="required-asterisk">*</span>
                        </span>
                      </label>
                      {errors.consent && <span className="error-message" style={{ display: 'block', marginTop: '1rem', marginLeft: '2rem' }}>{errors.consent}</span>}
                    </div>
                  </div>
                )}

                <div className="form-actions">
                  {step > 1 && (
                    <button type="button" className="btn-back" onClick={handleBack}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                      Back
                    </button>
                  )}
                  
                  {step < 3 ? (
                    <button type="button" className="btn-next" onClick={handleNext}>
                      Next Step
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </button>
                  ) : (
                    <button type="submit" className="btn-submit" disabled={!formData.consent}>
                      Submit Complaint
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PublicComplaint;
