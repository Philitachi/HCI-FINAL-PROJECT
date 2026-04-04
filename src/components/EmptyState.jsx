import React from 'react';
import './EmptyState.css';
import { FolderOpen } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="empty-state-container">
      <FolderOpen size={64} className="empty-folder-icon" />
      <p>No data available</p>
    </div>
  );
};

export default EmptyState;
