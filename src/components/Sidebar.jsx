import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Sidebar.css';
import { LayoutGrid, FolderPlus, FileText, RefreshCw, Building, CreditCard, FileCheck, AlertCircle, Archive, HelpCircle, Menu, ChevronRight } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const sidebarRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const savedScrollPos = sessionStorage.getItem('sidebarScrollPos');
    if (sidebarRef.current && savedScrollPos) {
      sidebarRef.current.scrollTop = parseInt(savedScrollPos, 10);
    }
  }, []);

  const handleScroll = (e) => {
    sessionStorage.setItem('sidebarScrollPos', e.target.scrollTop);
  };
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  const [openMenus, setOpenMenus] = useState(() => {
    const saved = localStorage.getItem('sidebarOpenMenus');
    let initial = saved ? JSON.parse(saved) : {};
    if (location.pathname.startsWith('/new-application')) {
      initial['New Application'] = true;
    }
    return initial;
  });

  // Determine which sidebar item is currently active
  const getActiveSidebarItem = (pathname) => {
    const items = ['/dashboard', '/new-application', '/applications', '/renewals', '/establishment', '/payment', '/requirements', '/complaint', '/drafts', '/faqs'];
    return items.find(p => pathname === p || pathname.startsWith(p + '/')) || null;
  };

  const currentActiveItem = getActiveSidebarItem(location.pathname);
  const [shouldAnimate, setShouldAnimate] = useState(() => {
    const prev = sessionStorage.getItem('prevSidebarItem');
    return prev !== currentActiveItem;
  });

  const [shouldAnimateSub, setShouldAnimateSub] = useState(() => {
    const prevPath = sessionStorage.getItem('prevPathname');
    return prevPath !== location.pathname;
  });

  useEffect(() => {
    sessionStorage.setItem('prevSidebarItem', currentActiveItem);
  }, [currentActiveItem]);

  useEffect(() => {
    sessionStorage.setItem('prevPathname', location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    localStorage.setItem('sidebarOpenMenus', JSON.stringify(openMenus));
  }, [openMenus]);

  useEffect(() => {
    if (location.pathname.startsWith('/new-application')) {
      setOpenMenus(prev => {
        if (prev['New Application']) return prev;
        return { ...prev, 'New Application': true };
      });
    }
  }, [location.pathname]);

  // Listen for mobile sidebar toggle from TopNavigationBar2
  useEffect(() => {
    const handleToggle = () => setMobileOpen(prev => !prev);
    window.addEventListener('toggleMobileSidebar', handleToggle);
    return () => window.removeEventListener('toggleMobileSidebar', handleToggle);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const toggleMenu = (name, e) => {
    if (e) e.preventDefault();
    if (isCollapsed) {
      setIsCollapsed(false);
      setOpenMenus(prev => ({ ...prev, [name]: true }));
    } else {
      setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
    }
  };

  const menuGroups = [
    {
      label: null,  // No label for the first group
      items: [
        {
          name: 'Dashboard',
          path: '/dashboard',
          iconColor: '#3b82f6',
          icon: <LayoutGrid size={22} strokeWidth={1.75} />
        },
      ]
    },
    {
      label: 'APPLICATIONS',
      items: [
        {
          name: 'New Application',
          path: '/new-application',
          isAccordion: true,
          iconColor: '#ec4899',
          icon: <FolderPlus size={22} strokeWidth={1.75} />,
          children: [
            { name: 'Apply for evaluation', path: '/new-application/evaluation' },
            { name: 'Apply for occupancy permit', path: '/new-application/occupancy' },
            { name: 'Apply for certificate', path: '/new-application/certificate' },
            { name: 'Apply for other clearance', path: '/new-application/clearance' }
          ]
        },
        {
          name: 'My Applications',
          path: '/applications',
          iconColor: '#10b981',
          icon: <FileText size={22} strokeWidth={1.75} />
        },
        {
          name: 'Drafts',
          path: '/drafts',
          iconColor: '#94a3b8',
          icon: <Archive size={22} strokeWidth={1.75} />
        },
        {
          name: 'Renewals',
          path: '/renewals',
          iconColor: '#f59e0b',
          icon: <RefreshCw size={22} strokeWidth={1.75} />
        },
      ]
    },
    {
      label: 'RECORDS',
      items: [
        {
          name: 'Establishment',
          path: '/establishment',
          iconColor: '#8b5cf6',
          icon: <Building size={22} strokeWidth={1.75} />
        },
        {
          name: 'Payment',
          path: '/payment',
          iconColor: '#14b8a6',
          icon: <CreditCard size={22} strokeWidth={1.75} />
        },
        {
          name: 'Requirements',
          path: '/requirements',
          iconColor: '#f43f5e',
          icon: <FileCheck size={22} strokeWidth={1.75} />
        },
      ]
    },
    {
      label: 'SUPPORT',
      items: [
        {
          name: 'Submit a Complaint',
          path: '/complaint',
          iconColor: '#ef4444',
          icon: <AlertCircle size={22} strokeWidth={1.75} />
        },
        {
          name: 'FAQs',
          path: '/faqs',
          iconColor: '#a855f7',
          icon: <HelpCircle size={22} strokeWidth={1.75} />
        },
      ]
    }
  ];

  return (
    <>
      {/* Mobile backdrop overlay */}
      {mobileOpen && <div className="sidebar-mobile-overlay" onClick={() => setMobileOpen(false)}></div>}
      <aside 
        className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
        ref={sidebarRef}
        onScroll={handleScroll}
      >
      <div className="sidebar-header" onClick={() => setIsCollapsed(!isCollapsed)}>
        <Menu size={24} strokeWidth={2} className="toggle-sidebar-icon" />
      </div>
      <nav className="sidebar-nav">
        {menuGroups.map((group, groupIdx) => (
          <div key={group.label || 'main'} className="sidebar-group">
            {group.label && (
              <>
                <div className="sidebar-group-divider" />
                <div className="sidebar-group-label">
                  <span>{group.label}</span>
                </div>
              </>
            )}
            {group.items.map((item) => (
              <div key={item.name} className="sidebar-item-container">
                {item.isAccordion ? (
                  <>
                    <div 
                      className={`sidebar-link ${location.pathname.startsWith(item.path) ? 'active' : ''} ${openMenus[item.name] ? 'open' : ''} ${location.pathname.startsWith(item.path) && shouldAnimate ? 'animate' : ''}`}
                      onClick={(e) => toggleMenu(item.name, e)}
                      style={{ cursor: 'pointer' }}
                      title={isCollapsed ? item.name : ''}
                    >
                      <span className="sidebar-icon" style={{ color: item.iconColor }}>{item.icon}</span>
                      <span className="sidebar-text">{item.name}</span>
                      {!isCollapsed && (
                        <span className="sidebar-accordion-arrow">
                          <ChevronRight size={16} strokeWidth={2} style={{ transform: openMenus[item.name] ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                        </span>
                      )}
                    </div>
                    <div className={`sidebar-submenu ${openMenus[item.name] && !isCollapsed ? 'open' : ''}`}>
                      {item.children.map(child => {
                        const isActive = location.pathname === child.path || location.pathname.startsWith(child.path + '/');
                        return (
                          <Link
                            key={child.name}
                            to={child.path}
                            className={`sidebar-sublink ${isActive ? 'active' : ''} ${isActive && shouldAnimateSub ? 'animate' : ''}`}
                          >
                            {child.name}
                          </Link>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={`sidebar-link ${location.pathname === item.path || location.pathname.startsWith(item.path + '/') ? 'active' : ''} ${(location.pathname === item.path || location.pathname.startsWith(item.path + '/')) && shouldAnimate ? 'animate' : ''}`}
                    title={isCollapsed ? item.name : ''}
                  >
                    <span className="sidebar-icon" style={{ color: item.iconColor }}>{item.icon}</span>
                    <span className="sidebar-text">{item.name}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        ))}
      </nav>
    </aside>
    </>
  );
};

export default Sidebar;
