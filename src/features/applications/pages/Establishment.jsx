import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import Sidebar from '../../../components/layout/Sidebar';
import TopNavigationBar2 from '../../../components/layout/TopNavigationBar2';
import Pagination from '../../../components/ui/Pagination';
import EmptyState from '../../../components/ui/EmptyState';
import useDebugLoadingGate from '../../../hooks/useDebugLoadingGate';
import { EstablishmentListSkeleton } from '../../../components/ui/PageSkeletons';
import { Plus, Building, Search, MapPin, Calendar, FileText, ChevronRight } from 'lucide-react';
import '../styles/Establishment.css';
import '../../dashboard/styles/dashboard.css';

const Establishment = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopTab, setActiveTopTab] = useState('already-applied');
  const [allApps, setAllApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const showLoading = useDebugLoadingGate(loading);

  const filters = ['All', 'Residential', 'Commercial', 'Industrial', 'Institutional', 'Assembly', 'Educational'];

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('userSession') || '{}');
    const userEmail = session.email;

    if (!userEmail) {
      setAllApps([]);
      setLoading(false);
      return;
    }

    const applicationsRef = collection(db, 'applications');
    const q = query(applicationsRef, where('userEmail', '==', userEmail));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        let dateStr = '';
        if (data.createdAt) {
          const date = data.createdAt.toDate();
          dateStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
        }

        return {
          id: docSnap.id,
          name: data.establishmentName || '---',
          occupancyType: data.occupancyType || '---',
          fireStation: data.fireStation || data.address || '---',
          date: dateStr,
          refNo: data.referenceNumber || '---',
          status: (data.status || '').trim().toLowerCase(),
        };
      });

      setAllApps(apps);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching establishments:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Split into tabs
  const draftStatuses = ['draft'];
  const newlyTagged = allApps.filter(app => 
    draftStatuses.includes(app.status) && 
    app.name && app.name !== '---' && 
    app.occupancyType && app.occupancyType !== '---'
  );
  const alreadyApplied = allApps.filter(app => !draftStatuses.includes(app.status));

  const currentList = activeTopTab === 'newly-tagged' ? newlyTagged : alreadyApplied;

  // Apply occupancy filter and search
  const filteredEstablishments = currentList.filter((est) => {
    const matchesFilter = activeFilter === 'All' || est.occupancyType === activeFilter;
    const matchesSearch = est.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const occupancyIconColors = {
    Residential: '#3b82f6',
    Commercial: '#f59e0b',
    Industrial: '#ef4444',
    Institutional: '#8b5cf6',
    Assembly: '#ec4899',
    Educational: '#14b8a6'
  };

  return (
    <div className="dashboard-container">
      <TopNavigationBar2 />
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-main-content establishment-content">
          <div className="est-top-tabs">
            <button
              className={`est-top-tab newly-tagged ${activeTopTab === 'newly-tagged' ? 'active' : ''}`}
              onClick={() => setActiveTopTab('newly-tagged')}
            >
              <Plus size={16} strokeWidth={2} />
              Newly Tagged
            </button>
            <button
              className={`est-top-tab already-applied ${activeTopTab === 'already-applied' ? 'active' : ''}`}
              onClick={() => setActiveTopTab('already-applied')}
            >
              <Building size={16} strokeWidth={2} />
              Already Applied
            </button>
          </div>

          <div className="establishment-header">
            <h1 className="establishment-title">
              {activeTopTab === 'newly-tagged' ? 'Tagged Establishments' : 'Applied Establishments'}
            </h1>
            <p className="establishment-subtitle">
              {activeTopTab === 'newly-tagged'
                ? 'Establishments tagged from your saved drafts that have not yet been submitted.'
                : 'View and manage all your registered establishments by occupancy type.'}
            </p>
          </div>

          <div className="establishment-filter-bar">
            {filters.map((filter) => (
              <button
                key={filter}
                className={`establishment-filter-tab ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="search-filter-bar">
            <div className="search-wrapper">
              <Search size={20} strokeWidth={2} className="search-icon" />
              <input
                type="text"
                placeholder="Search list by establishment name"
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {showLoading ? (
            <EstablishmentListSkeleton count={4} />
          ) : filteredEstablishments.length > 0 ? (
            <div className="establishment-list">
              {filteredEstablishments.map((est) => {
                const iconColor = occupancyIconColors[est.occupancyType] || '#64748b';
                return (
                  <div key={est.id} className="est-list-card">
                    <div className="est-icon-container">
                      <div className="est-icon-circle" style={{ backgroundColor: `${iconColor}15` }}>
                        <Building size={24} stroke={iconColor} strokeWidth={2} />
                      </div>
                    </div>

                    <div className="est-card-content">
                      <div className="est-title-row">
                        <h3 className="est-card-title">{est.name}</h3>
                      </div>

                      <div className="est-details-col">
                        <div className="est-detail-text">
                          <Building size={16} strokeWidth={2} className="detail-icon" />
                          {est.occupancyType} Occupancy
                        </div>

                        <div className="est-detail-text">
                          <MapPin size={16} strokeWidth={2} className="detail-icon outline" />
                          {est.fireStation}
                        </div>

                        <div className="est-bottom-info">
                          <span className="est-date-time">
                            <Calendar size={14} strokeWidth={2} />
                            {est.date || '---'}
                          </span>
                          <span className="est-ref-bottom">
                            <FileText size={14} strokeWidth={2} />
                            {est.refNo}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="est-card-actions">
                      <span className="est-no-action">
                        No action required
                        <ChevronRight size={16} strokeWidth={2} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState />
          )}

          <Pagination />
        </main>
      </div>
    </div>
  );
};

export default Establishment;
