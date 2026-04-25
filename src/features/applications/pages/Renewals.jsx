import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/layout/Sidebar';
import TopNavigationBar2 from '../../../components/layout/TopNavigationBar2';
import Pagination from '../../../components/ui/Pagination';
import EmptyState from '../../../components/ui/EmptyState';
import { ApplicationsListSkeleton } from '../../../components/ui/PageSkeletons';
import useApplications from '../hooks/useApplications';
import { Search, FileText } from 'lucide-react';
import '../styles/Renewals.css';
import '../../dashboard/styles/dashboard.css';

const Renewals = () => {
  const { applications, loading } = useApplications('Renewal'); // Fetching applications with status 'Renewal'
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredRenewals = applications.filter(app =>
    app.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset to first page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRenewals = filteredRenewals.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="dashboard-container">
      <TopNavigationBar2 />
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-main-content renewals-content">
          <div className="renewals-header">
            <h1 className="renewals-title">Renewals</h1>
            <div className="renewals-search-bar">
              <div className="renewals-search-wrapper">
                <Search className="renewals-search-icon" size={20} strokeWidth={2} />
                <input 
                  type="text" 
                  placeholder="Search list by establishment name" 
                  className="renewals-search-input" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {loading ? (
            <ApplicationsListSkeleton count={4} showAction={false} />
          ) : currentRenewals.length > 0 ? (
            <div className="applications-list">
              {currentRenewals.map((app) => (
                <div key={app.id} className="app-list-card">
                  {/* Reuse the same card structure as OngoingApplications */}
                  <div className="app-icon-container">
                    <div className="app-icon-circle">
                      <FileText size={24} color="#1c64f2" strokeWidth={2} />
                    </div>
                  </div>

                  <div className="app-card-content">
                    <div className="app-title-row">
                      <h3 className="app-title">{app.title}</h3>
                      <div className="status-badge blue">
                        {app.status}
                      </div>
                    </div>
                    <div className="app-details-col">
                      <div className="app-detail-text">{app.type}</div>
                      <div className="app-detail-text">{app.location}</div>
                      <div className="app-bottom-info">
                        <span className="app-date-time">{app.date} {app.time}</span>
                        <span className="app-ref-bottom">{app.refNo}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="renewals-empty-container">
              <EmptyState />
            </div>
          )}

          <Pagination 
            totalItems={filteredRenewals.length}
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

export default Renewals;
