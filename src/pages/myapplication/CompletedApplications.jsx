import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import Sidebar from '../../components/Sidebar';
import TopNavigationBar2 from '../../components/TopNavigationBar2';
import MyApplicationsNav from '../../components/MyApplicationsNav';
import Pagination from '../../components/Pagination';
import EmptyState from '../../components/EmptyState';
import useDebugLoadingGate from '../../hooks/useDebugLoadingGate';
import { ApplicationsListSkeleton } from '../../components/PageSkeletons';
import './CompletedApplications.css';
import '../Dashboard/dashboard.css';

const toComparableDate = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value.toDate === 'function') {
    return value.toDate();
  }

  return value instanceof Date ? value : null;
};

const getCompletedReferenceDate = (data) => (
  toComparableDate(data.updatedAt) || toComparableDate(data.createdAt)
);

const getStartOfDay = (date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

const getDaysAgo = (date, days) => {
  const result = getStartOfDay(date);
  result.setDate(result.getDate() - days);
  return result;
};

const getMonthsAgo = (date, months) => {
  const result = getStartOfDay(date);
  const dayOfMonth = result.getDate();
  result.setDate(1);
  result.setMonth(result.getMonth() - months);

  const lastDayOfTargetMonth = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(dayOfMonth, lastDayOfTargetMonth));
  return result;
};

const CompletedApplications = () => {
  const navigate = useNavigate();
  const { filter } = useParams();
  const activeSubTab = filter || 'range';
  const [allApplications, setAllApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const showLoading = useDebugLoadingGate(loading);

  // Range date picker state
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedType, setSelectedType] = useState('All Types');
  const [isTypeMenuOpen, setIsTypeMenuOpen] = useState(false);
  const typeMenuRef = useRef(null);

  const occupancyOptions = ['All Types', 'Residential', 'Commercial', 'Industrial', 'Institutional', 'Assembly', 'Educational', 'Storage', 'Mixed Occupancy'];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (typeMenuRef.current && !typeMenuRef.current.contains(event.target)) {
        setIsTypeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('userSession') || '{}');
    const userEmail = session.email;

    if (!userEmail) {
      setAllApplications([]);
      setLoading(false);
      return;
    }

    const applicationsRef = collection(db, 'applications');
    const q = query(applicationsRef, where('userEmail', '==', userEmail));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs
        .map(doc => {
          const data = doc.data();
          const referenceDate = getCompletedReferenceDate(data);
          let dateStr = '';
          let timeStr = '';

          if (referenceDate) {
            dateStr = referenceDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
            timeStr = referenceDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
          }

          const locationParts = [data.fireStation, data.barangay, data.city].filter(Boolean);
          const location = locationParts.join(', ') || data.address || '---';

          return {
            id: doc.id,
            title: data.establishmentName || '---',
            date: dateStr,
            time: timeStr,
            type: data.applicationType || '---',
            location: location,
            status: data.status || '',
            refNo: data.referenceNumber || '---',
            occupancyType: data.occupancyType || '---',
            referenceDate,
            rawData: data
          };
        })
        .filter(app => app.status.trim().toLowerCase() === 'completed')
        .sort((a, b) => {
          const dateA = a.referenceDate || new Date(0);
          const dateB = b.referenceDate || new Date(0);
          return dateB - dateA;
        });

      setAllApplications(apps);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching completed applications:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter applications based on active sub-tab
  const dateFilteredApplications = useMemo(() => {
    const now = new Date();

    switch (activeSubTab) {
      case 'month': {
        // This month
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return allApplications.filter(app => app.referenceDate && app.referenceDate >= startOfMonth);
      }
      case 'lastmonth': {
        // Last month
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        return allApplications.filter(app => app.referenceDate && app.referenceDate >= startOfLastMonth && app.referenceDate <= endOfLastMonth);
      }
      case 'year': {
        // This year
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        return allApplications.filter(app => app.referenceDate && app.referenceDate >= startOfYear);
      }
      case '30days': {
        const thirtyDaysAgo = getDaysAgo(now, 30);
        return allApplications.filter(app => app.referenceDate && app.referenceDate >= thirtyDaysAgo);
      }
      case '90days': {
        const ninetyDaysAgo = getDaysAgo(now, 90);
        return allApplications.filter(app => app.referenceDate && app.referenceDate >= ninetyDaysAgo);
      }
      case '6months': {
        const sixMonthsAgo = getMonthsAgo(now, 6);
        return allApplications.filter(app => app.referenceDate && app.referenceDate >= sixMonthsAgo);
      }
      case 'range': {
        // Custom date range
        if (!dateFrom && !dateTo) return allApplications;
        return allApplications.filter(app => {
          if (!app.referenceDate) return false;
          const appDate = app.referenceDate;
          
          if (dateFrom) {
            const [y, m, d] = dateFrom.split('-').map(Number);
            const fromDate = new Date(y, m - 1, d, 0, 0, 0, 0);
            if (appDate < fromDate) return false;
          }
          
          if (dateTo) {
            const [y, m, d] = dateTo.split('-').map(Number);
            const toDate = new Date(y, m - 1, d, 23, 59, 59, 999);
            if (appDate > toDate) return false;
          }
          
          return true;
        });
      }
      default:
        return allApplications;
    }
  }, [allApplications, activeSubTab, dateFrom, dateTo]);

  // Apply search and occupancy type filter
  const filteredApplications = useMemo(() => {
    return dateFilteredApplications.filter(app => {
      const matchesSearch = app.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'All Types' || app.occupancyType === selectedType;
      return matchesSearch && matchesType;
    });
  }, [dateFilteredApplications, searchQuery, selectedType]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedType, activeSubTab, dateFrom, dateTo]);

  // Apply pagination
  const currentApplications = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredApplications.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredApplications, currentPage, itemsPerPage]);

  return (
    <div className="dashboard-container">
      <TopNavigationBar2 />
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-main-content applications-content">
          <MyApplicationsNav activeMainTab="completed" activeSubTab={activeSubTab}>
            {/* Date Range Picker - shown only on 'range' tab */}
            {activeSubTab === 'range' && (
              <div className="date-range-picker-bar">
                <div className="date-range-field">
                  <label className="date-range-label">Start Date</label>
                  <div className="date-input-wrapper">
                    <svg className="calendar-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <input
                      type={dateFrom ? "date" : "text"}
                      placeholder="mm/dd/yyyy"
                      className="date-range-input"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      onFocus={(e) => (e.target.type = "date")}
                      onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                    />
                  </div>
                </div>
                <span className="date-range-separator">—</span>
                <div className="date-range-field">
                  <label className="date-range-label">End Date</label>
                  <div className="date-input-wrapper">
                    <svg className="calendar-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <input
                      type={dateTo ? "date" : "text"}
                      placeholder="mm/dd/yyyy"
                      className="date-range-input"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      onFocus={(e) => (e.target.type = "date")}
                      onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                    />
                  </div>
                </div>
                {(dateFrom || dateTo) && (
                  <button className="date-range-clear" onClick={() => { setDateFrom(''); setDateTo(''); }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Clear
                  </button>
                )}
              </div>
            )}

            <div className="search-filter-bar">
              <div className="search-wrapper">
                <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input 
                  type="text" 
                  placeholder="Search list by establishment name" 
                  className="search-input" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="type-filter-wrapper" ref={typeMenuRef}>
                <button 
                  className={`type-filter-btn ${isTypeMenuOpen ? 'open' : ''}`}
                  onClick={() => setIsTypeMenuOpen(!isTypeMenuOpen)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                  </svg>
                  {selectedType}
                  <svg className="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                {isTypeMenuOpen && (
                  <div className="type-filter-menu">
                    {occupancyOptions.map((option) => (
                      <div 
                        key={option} 
                        className={`type-filter-item ${selectedType === option ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedType(option);
                          setIsTypeMenuOpen(false);
                        }}
                      >
                        {option === 'All Types' ? 'All Types' : `${option} Occupancy`}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </MyApplicationsNav>

          {showLoading ? (
            <ApplicationsListSkeleton count={4} />
          ) : currentApplications.length > 0 ? (
            <div className="applications-list">
              {currentApplications.map((app) => (
                <div key={app.id} className="app-list-card">
                  <div className="app-icon-container">
                    <div className="app-icon-circle">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </div>
                  </div>

                  <div className="app-card-content">
                    <div className="app-title-row">
                      <h3 className="app-title">{app.title}</h3>
                      <div className="status-badge green">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        Completed
                      </div>
                    </div>

                    <div className="app-details-col">
                      <div className="app-detail-text">
                        <svg className="detail-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        {app.type}
                      </div>

                      <div className="app-detail-text">
                        <svg className="detail-icon outline" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {app.location}
                      </div>

                      <div className="app-bottom-info">
                        <span className="app-date-time">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          {app.date} {app.time}
                        </span>
                        <span className="app-ref-bottom">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                          </svg>
                          {app.refNo}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="app-card-actions">
                    <button className="btn-continue" onClick={() => navigate(`/applications/${app.id}`)}>Access full details</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState />
          )}

          <Pagination 
            totalItems={filteredApplications.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </main>
      </div>
    </div>
  );
};

export default CompletedApplications;
