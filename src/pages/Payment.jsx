import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopNavigationBar2 from '../components/TopNavigationBar2';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import { ChevronDown } from 'lucide-react';
import '../styles/Payment.css';
import './Dashboard/dashboard.css';

const Payment = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('This year'); // Default selection
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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
                <ChevronDown className="payment-dropdown-arrow" size={20} strokeWidth={2.5} />
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
                  <div className="date-input-wrapper">
                    <svg className="calendar-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <input 
                      type={startDate ? "date" : "text"} 
                      placeholder="mm/dd/yyyy"
                      className="payment-date-input" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      onFocus={(e) => (e.target.type = "date")}
                      onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                      required 
                    />
                  </div>
                </div>
                <div className="payment-date-group">
                  <label className="payment-date-label">End Date</label>
                  <div className="date-input-wrapper">
                    <svg className="calendar-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <input 
                      type={endDate ? "date" : "text"} 
                      placeholder="mm/dd/yyyy"
                      className="payment-date-input" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      onFocus={(e) => (e.target.type = "date")}
                      onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                      required 
                    />
                  </div>
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
