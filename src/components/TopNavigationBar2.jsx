import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import logo from '../assets/Logo.svg';
import './TopNavigationBar2.css';
import '../styles/ConfirmModal.css';

const TopNavigationBar2 = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') !== 'light';
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [userInitial, setUserInitial] = useState(() => {
    try {
      const sessionData = localStorage.getItem('userSession');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        const first = session.firstName ? session.firstName.charAt(0).toUpperCase() : '';
        const last = session.lastName ? session.lastName.charAt(0).toUpperCase() : '';
        return first + last || 'U';
      }
    } catch (e) {}
    return 'U';
  });

  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [visibleNotifsCount, setVisibleNotifsCount] = useState(10);
  
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If clicking outside the notification ref, close it
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
      // If clicking outside the user menu ref, close it
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const fetchUserInitial = async () => {
      try {
        const sessionData = localStorage.getItem('userSession');
        if (sessionData) {
          const session = JSON.parse(sessionData);
          if (session.email) {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', session.email));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              const userData = querySnapshot.docs[0].data();
              if (userData.firstName) {
                const first = userData.firstName.charAt(0).toUpperCase();
                const last = (userData.lastName || '').charAt(0).toUpperCase();
                setUserInitial(first + last);
                
                // Silently patch the session if missing
                if (!session.firstName || !session.lastName) {
                  session.firstName = userData.firstName;
                  session.lastName = userData.lastName;
                  localStorage.setItem('userSession', JSON.stringify(session));
                }
              } else {
                setUserInitial('U');
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user initial:', error);
      }
    };
    fetchUserInitial();

    // Listen for profile updates from Settings page
    const handleProfileUpdate = () => {
      try {
        const sessionData = localStorage.getItem('userSession');
        if (sessionData) {
          const session = JSON.parse(sessionData);
          const first = session.firstName ? session.firstName.charAt(0).toUpperCase() : '';
          const last = session.lastName ? session.lastName.charAt(0).toUpperCase() : '';
          setUserInitial(first + last || 'U');
        }
      } catch (e) {}
    };

    window.addEventListener('userProfileUpdated', handleProfileUpdate);
    
    // Real-time notifications listener
    let unsubscribeNotifs;
    const sessionData3 = localStorage.getItem('userSession');
    
    // Ref to store previous statuses to detect CHANGES
    const previousStatuses = { current: {} };

    if (sessionData3) {
      const session = JSON.parse(sessionData3);
      if (session.email) {
        // Load initial state from localStorage
        const emailSafe = session.email.replace(/[@.]/g, '_');
        const notifsKey = `notifs_${emailSafe}`;
        const countKey = `notifs_count_${emailSafe}`;
        const statusKey = `notifs_status_${emailSafe}`;

        try {
          const savedNotifs = JSON.parse(localStorage.getItem(notifsKey) || '[]');
          const savedCount = parseInt(localStorage.getItem(countKey) || '0', 10);
          const savedStatuses = JSON.parse(localStorage.getItem(statusKey) || '{}');
          
          setNotifications(savedNotifs);
          setUnreadCount(savedCount);
          previousStatuses.current = savedStatuses;
        } catch (e) {
          console.error("Error loading notifications from local storage", e);
        }

        const appsRef = collection(db, 'applications');
        const q = query(appsRef, where('userEmail', '==', session.email));

        unsubscribeNotifs = onSnapshot(q, (snapshot) => {
          const validStatuses = ['completeness check', 'assessment', 'pending review', 'declined', 'approved'];
          const currentApps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
          const newNotifs = [];
          const currentStatusMap = { ...previousStatuses.current };
          let changed = false;

          currentApps.forEach(app => {
            const appId = app.id;
            const currentStatus = (app.status || '').toLowerCase().trim();
            const prevStatus = previousStatuses.current[appId];

            // If status changed to a valid notification status
            // Exclude it if prevStatus is undefined (i.e. brand new application or empty cache)
            if (prevStatus && currentStatus !== prevStatus && validStatuses.includes(currentStatus)) {
              newNotifs.push({
                id: appId + '_' + Date.now(), // Unique key for react
                appId: appId,
                status: app.status,
                establishmentName: app.establishmentName,
                referenceNumber: app.referenceNumber,
                notifDate: Date.now()
              });
            }
            
            if (prevStatus !== currentStatus) {
              changed = true;
            }
            
            // Update tracking
            currentStatusMap[appId] = currentStatus;
          });

          if (changed) {
            previousStatuses.current = currentStatusMap;
            localStorage.setItem(statusKey, JSON.stringify(currentStatusMap));
          }

          if (newNotifs.length > 0) {
            setNotifications(prev => {
              const updated = [...newNotifs, ...prev]
                .sort((a, b) => b.notifDate - a.notifDate)
                .slice(0, 50); // Keep max 50 for history
              localStorage.setItem(notifsKey, JSON.stringify(updated));
              return updated;
            });
            setUnreadCount(prev => {
              const newCount = prev + newNotifs.length;
              localStorage.setItem(countKey, newCount.toString());
              return newCount;
            });
          }
        });
      }
    }

    return () => {
      window.removeEventListener('userProfileUpdated', handleProfileUpdate);
      if (unsubscribeNotifs) unsubscribeNotifs();
    };
  }, []);

  const handleNotifClick = () => {
    setNotifOpen(!notifOpen);
    setDropdownOpen(false);
    if (!notifOpen) {
      setVisibleNotifsCount(10); // Reset to 10 when opening
    }
    if (!notifOpen && unreadCount > 0) {
      setUnreadCount(0);
      try {
        const sessionData = localStorage.getItem('userSession');
        if (sessionData) {
          const session = JSON.parse(sessionData);
          if (session.email) {
            const emailSafe = session.email.replace(/[@.]/g, '_');
            localStorage.setItem(`notifs_count_${emailSafe}`, '0');
          }
        }
      } catch (e) {}
    }
  };

  const handleNotifItemClick = (notif) => {
    // Mark as read individually
    const updatedNotifs = notifications.map(n => 
      n.id === notif.id ? { ...n, isRead: true } : n
    );
    setNotifications(updatedNotifs);
    
    // Save to localStorage
    try {
      const sessionData = localStorage.getItem('userSession');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        if (session.email) {
          const emailSafe = session.email.replace(/[@.]/g, '_');
          localStorage.setItem(`notifs_${emailSafe}`, JSON.stringify(updatedNotifs));
        }
      }
    } catch (e) {}

    setNotifOpen(false);
    const status = (notif.status || '').toLowerCase();
    
    switch(status) {
      case 'completeness check':
        navigate('/applications/completeness');
        break;
      case 'assessment':
        navigate('/applications/assessment');
        break;
      case 'pending review':
        navigate('/applications/pending');
        break;
      case 'approved':
      case 'issuance':
        navigate('/applications/issuance');
        break;
      case 'declined':
      case 'cancelled':
        navigate('/applications/cancelled');
        break;
      case 'completed':
        navigate('/applications/completed');
        break;
      default:
        navigate('/applications/all');
    }
  };

  const handleLogoutClick = () => {
    setDropdownOpen(false);
    setShowSignOutModal(true);
  };

  const confirmSignOut = () => {
    localStorage.removeItem('userSession');
    navigate('/signin');
  };

  return (
    <header className="topnav2-header">
      <div className="topnav2-brand">
        <img src={logo} alt="Fire Safety Inspection System Logo" className="topnav2-logo" />
        <span className="topnav2-title">Fire Safety Inspection System</span>
      </div>
      <div className="topnav2-right">
        <button className="topnav2-theme-toggle" aria-label="Toggle dark mode" onClick={() => setIsDarkMode(!isDarkMode)}>
          <svg 
            className="sun-icon" 
            style={{ transform: isDarkMode ? 'rotate(-90deg) scale(0)' : 'rotate(0) scale(1)', opacity: isDarkMode ? 0 : 1 }}
            width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg 
            className="moon-icon"
            style={{ transform: isDarkMode ? 'rotate(0) scale(1)' : 'rotate(90deg) scale(0)', opacity: isDarkMode ? 1 : 0 }}
            width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>

        <button 
          ref={notifRef}
          className={`topnav2-notification-btn ${notifOpen ? 'active' : ''} ${unreadCount > 0 ? 'has-unread' : ''}`} 
          aria-label="Notifications"
          onClick={handleNotifClick}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="bell-icon">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}

          {notifOpen && (
            <div className="notif-dropdown" onClick={(e) => e.stopPropagation()}>
              <div className="notif-dropdown-header">
                <h3>Notifications</h3>
                {unreadCount > 0 && <span className="unread-label">{unreadCount} new</span>}
              </div>
              <div className="notif-list">
                {notifications.length > 0 ? (
                  <>
                    {notifications.slice(0, visibleNotifsCount).map(notif => (
                      <div key={notif.id} className={`notif-item ${notif.isRead ? 'read' : 'unread'}`} onClick={() => handleNotifItemClick(notif)}>
                        <div className={`notif-status-indicator ${(notif.status || '').toLowerCase().replace(' ', '-')}`}></div>
                        <div className="notif-info">
                          <div className="notif-title">
                            <span className="notif-status">{(notif.status || '').toUpperCase()}</span>
                            <span className="notif-time">
                              {notif.notifDate ? new Date(notif.notifDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                          </div>
                          <p className="notif-establishment">{notif.establishmentName}</p>
                          <p className="notif-ref">{notif.referenceNumber}</p>
                          {(notif.status || '').toLowerCase() === 'declined' && (
                            <p className="notif-declined-msg">Please check your email for full details on why your application was declined.</p>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="notif-pagination">
                      {visibleNotifsCount > 10 && (
                        <button 
                          className="notif-show-more-btn" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setVisibleNotifsCount(prev => Math.max(10, prev - 10));
                          }}
                        >
                          See less
                        </button>
                      )}
                      {visibleNotifsCount < notifications.length && (
                        <button 
                          className="notif-show-more-btn" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setVisibleNotifsCount(prev => prev + 10);
                          }}
                        >
                          See more
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="notif-empty">
                    <p>No notifications yet</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </button>

        <div className="topnav2-user-profile" ref={userMenuRef} onClick={() => setDropdownOpen(!dropdownOpen)}>
          <div className="topnav2-avatar">{userInitial}</div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`topnav2-chevron-icon ${dropdownOpen ? 'open' : ''}`}>
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
          
          {dropdownOpen && (
            <div className="topnav2-user-dropdown">
              <button className="topnav2-dropdown-item" onClick={() => { setDropdownOpen(false); navigate('/settings'); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                Settings
              </button>
              <button className="topnav2-dropdown-item" onClick={handleLogoutClick}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {showSignOutModal && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-modal">
            <div className="delete-confirm-icon">
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                background: 'rgba(239, 68, 68, 0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#ef4444'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </div>
            </div>
            <h2 className="delete-confirm-title">Sign Out Confirmation</h2>
            <p className="delete-confirm-text">
              Are you sure you want to sign out?
            </p>
            <div className="delete-confirm-actions">
              <button className="btn-confirm-no" onClick={() => setShowSignOutModal(false)}>
                No, Stay
              </button>
              <button className="btn-confirm-yes" onClick={confirmSignOut}>
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default TopNavigationBar2;
