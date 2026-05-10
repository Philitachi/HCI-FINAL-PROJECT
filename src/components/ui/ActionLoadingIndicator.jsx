import React from 'react';
import { Loader2 } from 'lucide-react';
import './ActionLoadingIndicator.css';

const ActionLoadingIndicator = ({ label = 'Loading...', size = 18 }) => (
  <span className="action-loading-indicator" role="status" aria-live="polite">
    <Loader2 size={size} className="action-loading-icon" aria-hidden="true" />
    <span>{label}</span>
  </span>
);

export default ActionLoadingIndicator;
