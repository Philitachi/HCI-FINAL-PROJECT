import React, { useState } from 'react';
import './Pagination.css';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ 
  totalItems = 0, 
  itemsPerPage = 10, 
  currentPage = 1, 
  onPageChange, 
  onItemsPerPageChange 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  
  // Safe page change handler
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      
      if (currentPage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  const rowsOptions = [5, 10, 15, 20];

  return (
    <div className="pagination-wrapper">
      <div className="rows-per-page">
        <span>Rows per page</span>
        <div className="rows-dropdown-container" style={{ position: 'relative' }}>
          <button className={`rows-dropdown ${showDropdown ? 'open' : ''}`} onClick={() => setShowDropdown(!showDropdown)}>
            {itemsPerPage}
            <ChevronDown size={14} strokeWidth={2} className="chevron-icon" />
          </button>
          {showDropdown && (
            <div className="rows-menu">
              {rowsOptions.map(option => (
                <button 
                  key={option}
                  className={`row-option ${itemsPerPage === option ? 'active' : ''}`}
                  onClick={() => {
                    onItemsPerPageChange(option);
                    setShowDropdown(false);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="pagination-controls">
        <button 
          className="page-btn nav-btn" 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
        >
          <ChevronLeft size={16} strokeWidth={2} />
        </button>
        
        {getPageNumbers().map((num, idx) => (
          num === '...' ? (
            <span key={`ellipsis-${idx}`} className="page-ellipsis">...</span>
          ) : (
            <button 
              key={`page-${num}`} 
              className={`page-btn ${currentPage === num ? 'active' : ''}`}
              onClick={() => handlePageChange(num)}
            >
              {num}
            </button>
          )
        ))}

        <button 
          className="page-btn nav-btn" 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
        >
          <ChevronRight size={16} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
