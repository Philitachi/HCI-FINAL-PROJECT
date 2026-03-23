import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavigationBar2 from '../components/TopNavigationBar2';
import Pagination from '../components/Pagination';
import '../styles/Establishment.css';
import './Dashboard/dashboard.css';

const Establishment = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopTab, setActiveTopTab] = useState('already-applied');

  const filters = ['All', 'Residential', 'Commercial', 'Industrial', 'Institutional', 'Assembly', 'Educational'];

  const establishments = [
    {
      id: "EST-2026-0101",
      name: "Sunrise Residences Tower A",
      occupancyType: "Residential",
      location: "45 Mahogany Lane, Brgy. San Jose",
      fireStation: "BUTUAN CITY FIRE STN / AMPAYON / LIBERTAD SUB STN",
      date: "Mar 21, 2026"
    },
    {
      id: "EST-2026-0102",
      name: "Palm Vista Condominiums",
      occupancyType: "Residential",
      location: "220 Coconut Drive, Brgy. Doongan",
      fireStation: "BUTUAN CITY FIRE STN / DOONGAN SUB STN",
      date: "Mar 18, 2026"
    },
    {
      id: "EST-2026-0201",
      name: "Metro Central Mall",
      occupancyType: "Commercial",
      location: "88 Commerce Ave, Downtown District",
      fireStation: "BUTUAN CITY FIRE STN / CENTRAL SUB STN",
      date: "Mar 15, 2026"
    },
    {
      id: "EST-2026-0202",
      name: "Coastal Roasters Café",
      occupancyType: "Commercial",
      location: "124 Harbor Blvd, West District",
      fireStation: "BUTUAN CITY FIRE STN / WEST SUB STN",
      date: "Mar 12, 2026"
    },
    {
      id: "EST-2026-0301",
      name: "Vertex Manufacturing Plant",
      occupancyType: "Industrial",
      location: "500 Industrial Pkwy, South Zone",
      fireStation: "BUTUAN CITY FIRE STN / SOUTH INDUSTRIAL SUB STN",
      date: "Mar 10, 2026"
    },
    {
      id: "EST-2026-0302",
      name: "Nexus Logistics Warehouse",
      occupancyType: "Industrial",
      location: "200 Freight Road, South Zone",
      fireStation: "BUTUAN CITY FIRE STN / SOUTH INDUSTRIAL SUB STN",
      date: "Mar 08, 2026"
    },
    {
      id: "EST-2026-0401",
      name: "St. Luke's Medical Center",
      occupancyType: "Institutional",
      location: "12 Health Blvd, Upper East",
      fireStation: "BUTUAN CITY FIRE STN / EAST SUB STN",
      date: "Mar 05, 2026"
    },
    {
      id: "EST-2026-0402",
      name: "City Government Complex",
      occupancyType: "Institutional",
      location: "1 Civic Center, Brgy. Rizal",
      fireStation: "BUTUAN CITY FIRE STN / CENTRAL SUB STN",
      date: "Feb 28, 2026"
    },
    {
      id: "EST-2026-0501",
      name: "Grand Convention Center",
      occupancyType: "Assembly",
      location: "75 Events Road, Central District",
      fireStation: "BUTUAN CITY FIRE STN / CENTRAL SUB STN",
      date: "Feb 25, 2026"
    },
    {
      id: "EST-2026-0502",
      name: "Riverside Sports Arena",
      occupancyType: "Assembly",
      location: "300 Stadium Way, North District",
      fireStation: "BUTUAN CITY FIRE STN / NORTH SUB STN",
      date: "Feb 20, 2026"
    },
    {
      id: "EST-2026-0601",
      name: "Philippine Science Academy",
      occupancyType: "Educational",
      location: "90 Academic Lane, Brgy. Limaha",
      fireStation: "BUTUAN CITY FIRE STN / AMPAYON / LIBERTAD SUB STN",
      date: "Feb 15, 2026"
    },
    {
      id: "EST-2026-0602",
      name: "Caraga State University Annex",
      occupancyType: "Educational",
      location: "Ampayon, Butuan City",
      fireStation: "BUTUAN CITY FIRE STN / AMPAYON / LIBERTAD SUB STN",
      date: "Feb 10, 2026"
    }
  ];

  const filteredEstablishments = establishments.filter((est) => {
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Newly Tagged
            </button>
            <button
              className={`est-top-tab already-applied ${activeTopTab === 'already-applied' ? 'active' : ''}`}
              onClick={() => setActiveTopTab('already-applied')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18"></path>
                <path d="M5 21V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14"></path>
                <path d="M9 9h6"></path>
                <path d="M9 13h6"></path>
              </svg>
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
          </div>

          <div className="establishment-list">
            {filteredEstablishments.map((est) => (
              <div key={est.id} className="est-list-card">
                <div className="est-icon-container">
                  <div className="est-icon-circle" style={{ backgroundColor: `${occupancyIconColors[est.occupancyType]}15` }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={occupancyIconColors[est.occupancyType]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 21h18"></path>
                      <path d="M5 21V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14"></path>
                      <path d="M9 9h6"></path>
                      <path d="M9 13h6"></path>
                      <path d="M9 17h6"></path>
                    </svg>
                  </div>
                </div>

                <div className="est-card-content">
                  <div className="est-title-row">
                    <h3 className="est-card-title">{est.name}</h3>
                  </div>

                  <div className="est-details-col">
                    <div className="est-detail-text">
                      <svg className="detail-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 21h18"></path>
                        <path d="M5 21V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14"></path>
                        <path d="M9 9h6"></path>
                        <path d="M9 13h6"></path>
                      </svg>
                      {est.occupancyType} Occupancy
                    </div>

                    <div className="est-detail-text">
                      <svg className="detail-icon outline" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      {est.fireStation}
                    </div>

                    <div className="est-bottom-info">
                      <span className="est-date-time">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        {est.date}
                      </span>
                      <span className="est-ref-bottom">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        {est.id}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="est-card-actions">
                  <span className="est-no-action">
                    No action required
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Pagination />
        </main>
      </div>
    </div>
  );
};

export default Establishment;
