import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import logo from '../assets/Logo.svg';
import './TopNavigationBar2.css';
import { Menu, Sun, Moon, Bell, ChevronDown, Settings, LogOut } from 'lucide-react';
import '../styles/ConfirmModal.css';
import { clearUserSession, persistUserSession } from '../utils/userSession';

const TopNavigationBar2 = ({ hideHamburger = false }) => {
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
                  await persistUserSession(session);
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

        let isFirstSnapshot = Object.keys(previousStatuses.current).length === 0;

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

            if (isFirstSnapshot) {
              // On first load with empty cache, generate notifications from existing data
              if (validStatuses.includes(currentStatus)) {
                let notifDate = Date.now();
                if (app.updatedAt && app.updatedAt.toDate) {
                  notifDate = app.updatedAt.toDate().getTime();
                } else if (app.createdAt && app.createdAt.toDate) {
                  notifDate = app.createdAt.toDate().getTime();
                }
                newNotifs.push({
                  id: appId + '_' + notifDate,
                  appId: appId,
                  status: app.status,
                  establishmentName: app.establishmentName,
                  referenceNumber: app.referenceNumber,
                  notifDate: notifDate,
                  isRead: true // Mark initial ones as read
                });
              }
            } else {
              // On subsequent snapshots, only create a notification if status actually changed
              if (prevStatus && currentStatus !== prevStatus && validStatuses.includes(currentStatus)) {
                newNotifs.push({
                  id: appId + '_' + Date.now(),
                  appId: appId,
                  status: app.status,
                  establishmentName: app.establishmentName,
                  referenceNumber: app.referenceNumber,
                  notifDate: Date.now()
                });
              }
            }
            
            if (prevStatus !== currentStatus) {
              changed = true;
            }
            
            // Update tracking
            currentStatusMap[appId] = currentStatus;
          });

          // Always update statuses after first snapshot
          if (changed || isFirstSnapshot) {
            previousStatuses.current = currentStatusMap;
            localStorage.setItem(statusKey, JSON.stringify(currentStatusMap));
          }

          if (newNotifs.length > 0) {
            if (isFirstSnapshot) {
              // On first load, replace saved notifications with fresh data
              const sorted = newNotifs
                .sort((a, b) => b.notifDate - a.notifDate)
                .slice(0, 50);
              setNotifications(sorted);
              localStorage.setItem(notifsKey, JSON.stringify(sorted));
              // Don't bump unread for initial historical load
            } else {
              setNotifications(prev => {
                const updated = [...newNotifs, ...prev]
                  .sort((a, b) => b.notifDate - a.notifDate)
                  .slice(0, 50);
                localStorage.setItem(notifsKey, JSON.stringify(updated));
                return updated;
              });
              setUnreadCount(prev => {
                const newCount = prev + newNotifs.length;
                localStorage.setItem(countKey, newCount.toString());
                return newCount;
              });
            }
          }

          isFirstSnapshot = false;
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

  const confirmSignOut = async () => {
    await clearUserSession();
    navigate('/signin');
  };

  return (
    <header className="topnav2-header">
      <div className="topnav2-left">
        {!hideHamburger && (
          <button className="topnav2-hamburger" aria-label="Toggle sidebar" onClick={() => window.dispatchEvent(new CustomEvent('toggleMobileSidebar'))}>
            <Menu size={22} strokeWidth={2} />
          </button>
        )}
        <div className="topnav2-brand">
          <img src={logo} alt="Fire Safety Inspection System Logo" className="topnav2-logo" />
          <span className="topnav2-title">
            <span className="topnav2-title-accent">Fire Safety</span> Inspection System
          </span>
        </div>
      </div>
      <div className="topnav2-right">
        <button className="topnav2-theme-toggle" aria-label="Toggle dark mode" onClick={() => setIsDarkMode(!isDarkMode)}>
          <Sun className="sun-icon" size={20} strokeWidth={2} style={{ transform: isDarkMode ? 'rotate(-90deg) scale(0)' : 'rotate(0) scale(1)', opacity: isDarkMode ? 0 : 1 }} />
          <Moon className="moon-icon" size={20} strokeWidth={2} style={{ transform: isDarkMode ? 'rotate(0) scale(1)' : 'rotate(90deg) scale(0)', opacity: isDarkMode ? 1 : 0 }} />
        </button>

        <button 
          ref={notifRef}
          className={`topnav2-notification-btn ${notifOpen ? 'active' : ''} ${unreadCount > 0 ? 'has-unread' : ''}`} 
          aria-label="Notifications"
          onClick={handleNotifClick}
        >
          <Bell className="bell-icon" size={20} strokeWidth={2} />
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
          <ChevronDown className={`topnav2-chevron-icon ${dropdownOpen ? 'open' : ''}`} size={16} strokeWidth={2} />
          
          {dropdownOpen && (
            <div className="topnav2-user-dropdown">
              <button className="topnav2-dropdown-item" onClick={() => { setDropdownOpen(false); navigate('/settings'); }}>
                <Settings size={16} strokeWidth={2} />
                Settings
              </button>
              <button className="topnav2-dropdown-item" onClick={handleLogoutClick}>
                <LogOut size={16} strokeWidth={2} />
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
                  <LogOut size={32} strokeWidth={2} />
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
