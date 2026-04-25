import React from 'react';
import { Navigate } from 'react-router-dom';
import { clearUserSessionSync, getUserSession } from '../../utils/userSession';

/**
 * A wrapper component that protects routes from unauthorized access.
 * It checks the restored user session before rendering protected pages.
 */
const ProtectedRoute = ({ children }) => {
  const session = getUserSession();

  if (!session) {
    clearUserSessionSync();
    return <Navigate to="/signin" replace />;
  }

  // User is logged in and session is valid, render the component
  return children;
};

export default ProtectedRoute;
