import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import Sidebar from '../components/Sidebar';
import TopNavigationBar2 from '../components/TopNavigationBar2';
import './Settings.css';
import './Dashboard/dashboard.css';
import { persistUserSession } from '../utils/userSession';

const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
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

  if (loading) {
    return (
      <div className="dashboard-container">
        <TopNavigationBar2 />
        <div className="dashboard-body">
          <Sidebar />
          <main className="dashboard-main-content">
            <div className="loading-container">
              <div className="loader"></div>
              <p>Loading settings...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container settings-full-page">
      <TopNavigationBar2 />
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
