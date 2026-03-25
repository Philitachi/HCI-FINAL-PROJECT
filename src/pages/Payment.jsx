import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavigationBar2 from '../components/TopNavigationBar2';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import '../styles/Payment.css';
import './Dashboard/dashboard.css';

const Payment = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('This year'); // Default selection
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const dropdownRef = useRef(null);
  
  // Mock data for payments (until real data is integrated)
  const allPayments = []; 
  const filteredPayments = allPayments; // Add filtering logic here if needed
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);

  const options = ['This year', 'Last Year', 'Search a range of dates'];

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleSelect = (option) => {
    setSelectedRange(option);
    setDropdownOpen(false);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    <div className="dashboard-container">
      <TopNavigationBar2 />
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-main-content payment-content">
          <div className="payment-header">
            <h1 className="payment-title">Payment History</h1>
            
            {/* Custom Dropdown */}
            <div className="payment-dropdown-container" ref={dropdownRef}>
              <div 
                className={`payment-dropdown-trigger ${dropdownOpen ? 'open' : ''}`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span>{selectedRange}</span>
                <svg className="payment-dropdown-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>

              {dropdownOpen && (
                <div className="payment-dropdown-menu">
                  {options.map((option) => (
                    <div 
                      key={option} 
                      className={`payment-dropdown-item ${selectedRange === option ? 'active' : ''}`}
                      onClick={() => handleSelect(option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Conditional Date Range Content */}
            {selectedRange === 'Search a range of dates' && (
              <div className="payment-date-range-container">
                <div className="payment-date-group">
                  <label className="payment-date-label">Start Date</label>
                  <input type="date" className="payment-date-input" required />
                </div>
                <div className="payment-date-group">
                  <label className="payment-date-label">End Date</label>
                  <input type="date" className="payment-date-input" required />
                </div>
                <button className="payment-search-btn">
                  Search Dates
                </button>
              </div>
            )}
          </div>
          
          <div className="payment-empty-container">
            <EmptyState />
          </div>

          <Pagination 
            totalItems={filteredPayments.length}
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

export default Payment;
