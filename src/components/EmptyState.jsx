import React from 'react';
import './EmptyState.css';

const EmptyState = () => {
  return (
    <div className="empty-state-container">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" className="empty-folder-icon" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
      </svg>
      <p>No data available</p>
    </div>
  );
};

export default EmptyState;
