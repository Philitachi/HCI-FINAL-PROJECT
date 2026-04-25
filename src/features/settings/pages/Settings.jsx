import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../../services/firebase';
import TopNavigationBar2 from '../../../components/layout/TopNavigationBar2';
import '../styles/Settings.css';
import '../../dashboard/styles/dashboard.css';
import { persistUserSession } from '../../../utils/userSession';
import useDebugLoadingGate, { DEBUG_SKELETON_STORAGE_KEY } from '../../../hooks/useDebugLoadingGate';
import { SettingsSkeleton } from '../../../components/ui/PageSkeletons';

const SHOW_DEBUG_TOGGLE = import.meta.env.DEV;

const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const showLoading = useDebugLoadingGate(loading);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [debugSkeletonsEnabled, setDebugSkeletonsEnabled] = useState(() => {
    if (!SHOW_DEBUG_TOGGLE || typeof window === 'undefined') {
      return false;
    }

    return window.localStorage.getItem(DEBUG_SKELETON_STORAGE_KEY) !== 'off';
  });
  const [fontPreference, setFontPreference] = useState(
    localStorage.getItem('fontFamily') || 'Outfit'
  );
  const [fontSizePreference, setFontSizePreference] = useState(
    localStorage.getItem('fontSize') || 'medium'
  );
  
  const [fontDropdownOpen, setFontDropdownOpen] = useState(false);
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState(false);
  const [fontDropUp, setFontDropUp] = useState(false);
  const [sizeDropUp, setSizeDropUp] = useState(false);
  
  const dropdownRef = useRef(null);
  const sizeDropdownRef = useRef(null);

  // Close custom dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setFontDropdownOpen(false);
      }
      if (sizeDropdownRef.current && !sizeDropdownRef.current.contains(event.target)) {
        setSizeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check available space below when dropdowns open
  useEffect(() => {
    if (fontDropdownOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setFontDropUp(window.innerHeight - rect.bottom < 200);
    }
  }, [fontDropdownOpen]);

  useEffect(() => {
    if (sizeDropdownOpen && sizeDropdownRef.current) {
      const rect = sizeDropdownRef.current.getBoundingClientRect();
      setSizeDropUp(window.innerHeight - rect.bottom < 200);
    }
  }, [sizeDropdownOpen]);

  const fontOptions = [
    { value: 'Outfit', label: 'Outfit (Default)' },
    { value: 'Inter', label: 'Inter (Clean & Modern)' },
    { value: 'Roboto', label: 'Roboto (Android Standard)' },
    { value: 'Nunito', label: 'Nunito (Friendly & Balanced)' }
  ];

  const sizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium (Default)' },
    { value: 'large', label: 'Large' }
  ];
  
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profilePicture: ''
  });

  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const sessionData = localStorage.getItem('userSession');
        if (!sessionData) {
          navigate('/signin');
          return;
        }
        const session = JSON.parse(sessionData);
        const email = session.email;

        // Fetch from Firestore
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          const data = docSnap.data();
          const info = {
            id: docSnap.id,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phone: (data.phone || '').replace('+63', ''),
            profilePicture: data.profileImage || data.profilePicture || ''
          };
          setUserData(info);
          setEditData({
            firstName: info.firstName,
            lastName: info.lastName,
            phone: info.phone
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setErrorMessage('Failed to load user information.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const userRef = doc(db, 'users', userData.id);
      await updateDoc(userRef, {
        firstName: editData.firstName,
        lastName: editData.lastName,
        phone: `+63${editData.phone}`,
        updatedAt: new Date()
      });

      setUserData(prev => ({
        ...prev,
        firstName: editData.firstName,
        lastName: editData.lastName,
        phone: editData.phone
      }));

      // Update session storage
      const session = JSON.parse(localStorage.getItem('userSession') || '{}');
      session.firstName = editData.firstName;
      session.lastName = editData.lastName;
      await persistUserSession(session);

      // Dispatch custom event to notify other components (like TopNavigationBar)
      window.dispatchEvent(new Event('userProfileUpdated'));

      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload an image file.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('Image size should be less than 2MB.');
      return;
    }

    if (!userData.id) {
      setErrorMessage('User session invalid. Please sign in again.');
      return;
    }

    setSaving(true);
    setErrorMessage('');
    console.log('Starting upload for user:', userData.id);

    try {
      const storageRef = ref(storage, `profile_pictures/${userData.id}`);
      
      // Use a timeout to prevent absolute infinite hang
      const uploadWithTimeout = () => {
        return new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Upload timed out after 30 seconds. Please check your connection.'));
          }, 30000);

          uploadBytes(storageRef, file)
            .then(snapshot => {
              clearTimeout(timeout);
              resolve(snapshot);
            })
            .catch(err => {
              clearTimeout(timeout);
              reject(err);
            });
        });
      };

      await uploadWithTimeout();
      console.log('Upload successful, getting download URL...');
      const downloadURL = await getDownloadURL(storageRef);

      const userRef = doc(db, 'users', userData.id);
      await updateDoc(userRef, {
        profileImage: downloadURL,
        updatedAt: new Date()
      });

      setUserData(prev => ({ ...prev, profilePicture: downloadURL }));
      setSuccessMessage('Profile picture updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Upload error details:', error);
      setErrorMessage(error.message || 'Failed to upload image. Please check your connection or storage rules.');
    } finally {
      setSaving(false);
    }
  };

  const handleFontChange = (e) => {
    const selectedFont = e.target.value;
    setFontPreference(selectedFont);
    localStorage.setItem('fontFamily', selectedFont);
    document.documentElement.setAttribute('data-font', selectedFont);
    setSuccessMessage(`Font changed to ${selectedFont}`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSizeChange = (e) => {
    const selectedSize = e.target.value;
    setFontSizePreference(selectedSize);
    localStorage.setItem('fontSize', selectedSize);
    document.documentElement.setAttribute('data-font-size', selectedSize);
    setSuccessMessage(`Text size changed to ${selectedSize}`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDebugSkeletonToggle = () => {
    const nextValue = !debugSkeletonsEnabled;
    setDebugSkeletonsEnabled(nextValue);
    window.localStorage.setItem(DEBUG_SKELETON_STORAGE_KEY, nextValue ? 'on' : 'off');
    setSuccessMessage(
      nextValue
        ? 'Skeleton debug enabled. Refresh this page or open another data page to test it.'
        : 'Skeleton debug disabled. Refresh this page or open another data page to confirm normal loading.',
    );
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDeleteProfilePicture = async () => {
    if (!window.confirm('Are you sure you want to remove your profile picture?')) return;
    
    setSaving(true);
    try {
      // Delete from Storage
      const storageRef = ref(storage, `profile_pictures/${userData.id}`);
      // Note: We ignore error if file doesn't exist in storage anymore
      try {
        await deleteObject(storageRef);
      } catch (err) {
        console.warn('File might not exist in storage:', err);
      }

      // Update Firestore
      const userRef = doc(db, 'users', userData.id);
      await updateDoc(userRef, {
        profileImage: '',
        updatedAt: new Date()
      });

      setUserData(prev => ({ ...prev, profilePicture: '' }));
      setSuccessMessage('Profile picture removed.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting image:', error);
      setErrorMessage('Failed to delete profile picture.');
    } finally {
      setSaving(false);
    }
  };

  if (showLoading) {
    return (
      <div className="dashboard-container settings-full-page">
        <TopNavigationBar2 hideHamburger={true} />
        <main className="settings-main-container">
          <SettingsSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container settings-full-page">
      <TopNavigationBar2 hideHamburger={true} />
      <main className="settings-main-container">
        <div className="settings-content">
          <div className="settings-nav-header">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back
            </button>
          </div>
          
          <div className="settings-header">
            <h1 className="settings-title">Account Settings</h1>
            <p className="settings-subtitle">Manage your personal information and profile preferences.</p>
          </div>

          <div className="settings-grid">
            {/* Profile Picture Card */}
            <div className="settings-card profile-card">
              <div className="profile-image-container">
                {userData.profilePicture ? (
                  <img src={userData.profilePicture} alt={`Profile picture of ${userData.firstName} ${userData.lastName}`} className="profile-preview" />
                ) : (
                  <div className="profile-placeholder">
                    {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
                  </div>
                )}
                <button 
                  className="edit-pfp-btn" 
                  onClick={() => fileInputRef.current.click()}
                  disabled={saving}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                  </svg>
                </button>
                {userData.profilePicture && (
                  <button 
                    className="delete-pfp-btn" 
                    onClick={handleDeleteProfilePicture}
                    disabled={saving}
                    title="Remove profile picture"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>
              <div className="profile-info">
                <h3>{userData.firstName} {userData.lastName}</h3>
                <p>{userData.email}</p>
              </div>
            </div>

            <div className="settings-right-column" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Information Card */}
              <div className="settings-card info-card">
              <h2 className="card-title">Personal Information</h2>
              
              {successMessage && <div className="alert success">{successMessage}</div>}
              {errorMessage && <div className="alert error">{errorMessage}</div>}

              <form className="settings-form" onSubmit={handleSave}>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={editData.firstName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={editData.lastName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    value={userData.email}
                    disabled
                    className="disabled-input"
                  />
                  <span className="input-hint">Email address cannot be changed.</span>
                </div>

                <div className="form-group">
                  <label>Mobile Number</label>
                  <div className="phone-input-wrapper">
                    <span className="prefix">+63</span>
                    <input 
                      type="tel" 
                      name="phone"
                      value={editData.phone}
                      onChange={handleInputChange}
                      required
                      maxLength="10"
                      placeholder="9XXXXXXXXX"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="save-btn" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>

            {/* Display Preferences Card */}
            <div className="settings-card info-card" style={{ marginTop: 0 }}>
              <h2 className="card-title">Display Preferences</h2>
              <div className="settings-form">
                <div className="form-group">
                  <label>Font Style</label>
                  <div className="custom-dropdown-container" ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
                    <div 
                      className="custom-dropdown-header"
                      role="combobox"
                      aria-expanded={fontDropdownOpen}
                      tabIndex={0}
                      onClick={() => setFontDropdownOpen(!fontDropdownOpen)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setFontDropdownOpen(!fontDropdownOpen);
                        } else if (e.key === 'ArrowDown') {
                          e.preventDefault();
                          if (!fontDropdownOpen) {
                            setFontDropdownOpen(true);
                          }
                          setTimeout(() => {
                            const items = dropdownRef.current?.querySelectorAll('.custom-dropdown-item');
                            if (items && items.length > 0) items[0].focus();
                          }, 0);
                        } else if (e.key === 'Escape' && fontDropdownOpen) {
                          setFontDropdownOpen(false);
                        }
                      }}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: 'var(--sidebar-bg-color, #0f172a)',
                        border: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
                        borderRadius: '8px',
                        padding: '0.75rem 1rem',
                        color: 'var(--text-primary-color, #ffffff)',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                        userSelect: 'none'
                      }}
                    >
                      <span style={{ paddingRight: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {fontOptions.find(opt => opt.value === fontPreference)?.label || 'Outfit (Default)'}
                      </span>
                      <svg 
                        width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        style={{
                          transform: fontDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          color: '#9ca3af',
                          flexShrink: 0,
                          marginRight: '0.5rem' /* Padding to keep it off the edge */
                        }}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                    
                    {fontDropdownOpen && (
                      <div className="custom-dropdown-list" style={{
                        position: 'absolute',
                        ...(fontDropUp ? { bottom: '100%', top: 'auto', marginBottom: '0.5rem' } : { top: '100%', marginTop: '0.5rem' }),
                        left: 0,
                        width: '100%',
                        backgroundColor: 'var(--sidebar-bg-color, #0f172a)',
                        border: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
                        borderRadius: '8px',
                        zIndex: 50,
                        maxHeight: '140px',
                        overflowY: 'auto',
                        boxShadow: fontDropUp ? '0 -10px 25px -5px rgba(0, 0, 0, 0.3)' : '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                      }}>
                        {fontOptions.map((opt) => (
                          <div 
                            key={opt.value}
                            role="option"
                            aria-selected={fontPreference === opt.value}
                            tabIndex={0}
                            onClick={() => {
                              handleFontChange({ target: { value: opt.value } });
                              setFontDropdownOpen(false);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleFontChange({ target: { value: opt.value } });
                                setFontDropdownOpen(false);
                                dropdownRef.current?.querySelector('.custom-dropdown-header')?.focus();
                              } else if (e.key === 'ArrowDown') {
                                e.preventDefault();
                                const items = Array.from(dropdownRef.current?.querySelectorAll('.custom-dropdown-item') || []);
                                const currentIndex = items.indexOf(e.currentTarget);
                                if (currentIndex >= 0 && currentIndex < items.length - 1) {
                                  items[currentIndex + 1].focus();
                                }
                              } else if (e.key === 'ArrowUp') {
                                e.preventDefault();
                                const items = Array.from(dropdownRef.current?.querySelectorAll('.custom-dropdown-item') || []);
                                const currentIndex = items.indexOf(e.currentTarget);
                                if (currentIndex > 0) {
                                  items[currentIndex - 1].focus();
                                } else {
                                  dropdownRef.current?.querySelector('.custom-dropdown-header')?.focus();
                                }
                              } else if (e.key === 'Escape') {
                                setFontDropdownOpen(false);
                                dropdownRef.current?.querySelector('.custom-dropdown-header')?.focus();
                              }
                            }}
                            className="custom-dropdown-item"
                            style={{
                              padding: '0.75rem 1rem',
                              cursor: 'pointer',
                              color: fontPreference === opt.value ? 'var(--accent-color, #3b82f6)' : 'var(--text-primary-color, #ffffff)',
                              backgroundColor: fontPreference === opt.value ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                              transition: 'background-color 0.2s',
                              borderBottom: '1px solid rgba(255,255,255,0.03)'
                            }}
                          >
                            {opt.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="input-hint">Changes text style globally across the app immediately.</span>
                </div>

                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label>Font Size</label>
                  <div className="custom-dropdown-container" ref={sizeDropdownRef} style={{ position: 'relative', width: '100%' }}>
                    <div 
                      className="custom-dropdown-header"
                      role="combobox"
                      aria-expanded={sizeDropdownOpen}
                      tabIndex={0}
                      onClick={() => setSizeDropdownOpen(!sizeDropdownOpen)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSizeDropdownOpen(!sizeDropdownOpen);
                        } else if (e.key === 'ArrowDown') {
                          e.preventDefault();
                          if (!sizeDropdownOpen) {
                            setSizeDropdownOpen(true);
                          }
                          setTimeout(() => {
                            const items = sizeDropdownRef.current?.querySelectorAll('.custom-dropdown-item');
                            if (items && items.length > 0) items[0].focus();
                          }, 0);
                        } else if (e.key === 'Escape' && sizeDropdownOpen) {
                          setSizeDropdownOpen(false);
                        }
                      }}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: 'var(--sidebar-bg-color, #0f172a)',
                        border: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
                        borderRadius: '8px',
                        padding: '0.75rem 1rem',
                        color: 'var(--text-primary-color, #ffffff)',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                        userSelect: 'none'
                      }}
                    >
                      <span style={{ paddingRight: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {sizeOptions.find(opt => opt.value === fontSizePreference)?.label || 'Medium (Default)'}
                      </span>
                      <svg 
                        width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        style={{
                          transform: sizeDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          color: '#9ca3af',
                          flexShrink: 0,
                          marginRight: '0.5rem'
                        }}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                    
                    {sizeDropdownOpen && (
                      <div className="custom-dropdown-list" style={{
                        position: 'absolute',
                        ...(sizeDropUp ? { bottom: '100%', top: 'auto', marginBottom: '0.5rem' } : { top: '100%', marginTop: '0.5rem' }),
                        left: 0,
                        width: '100%',
                        backgroundColor: 'var(--sidebar-bg-color, #0f172a)',
                        border: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
                        borderRadius: '8px',
                        zIndex: 50,
                        maxHeight: '140px',
                        overflowY: 'auto',
                        boxShadow: sizeDropUp ? '0 -10px 25px -5px rgba(0, 0, 0, 0.3)' : '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                      }}>
                        {sizeOptions.map((opt) => (
                          <div 
                            key={opt.value}
                            role="option"
                            aria-selected={fontSizePreference === opt.value}
                            tabIndex={0}
                            onClick={() => {
                              handleSizeChange({ target: { value: opt.value } });
                              setSizeDropdownOpen(false);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleSizeChange({ target: { value: opt.value } });
                                setSizeDropdownOpen(false);
                                sizeDropdownRef.current?.querySelector('.custom-dropdown-header')?.focus();
                              } else if (e.key === 'ArrowDown') {
                                e.preventDefault();
                                const items = Array.from(sizeDropdownRef.current?.querySelectorAll('.custom-dropdown-item') || []);
                                const currentIndex = items.indexOf(e.currentTarget);
                                if (currentIndex >= 0 && currentIndex < items.length - 1) {
                                  items[currentIndex + 1].focus();
                                }
                              } else if (e.key === 'ArrowUp') {
                                e.preventDefault();
                                const items = Array.from(sizeDropdownRef.current?.querySelectorAll('.custom-dropdown-item') || []);
                                const currentIndex = items.indexOf(e.currentTarget);
                                if (currentIndex > 0) {
                                  items[currentIndex - 1].focus();
                                } else {
                                  sizeDropdownRef.current?.querySelector('.custom-dropdown-header')?.focus();
                                }
                              } else if (e.key === 'Escape') {
                                setSizeDropdownOpen(false);
                                sizeDropdownRef.current?.querySelector('.custom-dropdown-header')?.focus();
                              }
                            }}
                            className="custom-dropdown-item"
                            style={{
                              padding: '0.75rem 1rem',
                              cursor: 'pointer',
                              color: fontSizePreference === opt.value ? 'var(--accent-color, #3b82f6)' : 'var(--text-primary-color, #ffffff)',
                              backgroundColor: fontSizePreference === opt.value ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                              transition: 'background-color 0.2s',
                              borderBottom: '1px solid rgba(255,255,255,0.03)'
                            }}
                          >
                            {opt.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="input-hint">Scales the interface for easier reading or denser information.</span>
                </div>
              </div>
              </div>
            </div>

            {SHOW_DEBUG_TOGGLE && (
              <div className="settings-card info-card settings-dev-card" style={{ marginTop: 0 }}>
                <div className="settings-dev-header">
                  <div>
                    <h2 className="card-title">Developer Testing</h2>
                    <p className="settings-dev-copy">
                      Keep skeleton loaders visible longer while testing in local development.
                    </p>
                  </div>
                  <button
                    type="button"
                    className={`settings-debug-toggle ${debugSkeletonsEnabled ? 'active' : ''}`}
                    onClick={handleDebugSkeletonToggle}
                    aria-pressed={debugSkeletonsEnabled}
                  >
                    <span className="settings-debug-toggle-track">
                      <span className="settings-debug-toggle-thumb" />
                    </span>
                    <span className="settings-debug-toggle-label">
                      {debugSkeletonsEnabled ? 'On' : 'Off'}
                    </span>
                  </button>
                </div>
                <p className="settings-dev-hint">
                  This is dev-only and will not appear on your deployed app. Refresh the current page, or open another
                  loading page, after changing it.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
