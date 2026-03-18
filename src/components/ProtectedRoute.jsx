import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * A wrapper component that protects routes from unauthorized access.
 * It checks localStorage for a valid user session.
 */
const ProtectedRoute = ({ children }) => {
  const sessionData = localStorage.getItem('userSession');

  if (!sessionData) {
    // No session found, redirect to sign-in page
    return <Navigate to="/signin" replace />;
  }

  try {
    const session = JSON.parse(sessionData);
    const now = new Date().getTime();

    // Check if the session has expired
    if (now > session.expiresAt) {
      // Session expired, clear it and redirect
      localStorage.removeItem('userSession');
      return <Navigate to="/signin" replace />;
    }
  } catch (error) {
    // If JSON parsing fails (old/corrupt data), clear and redirect
    localStorage.removeItem('userSession');
    return <Navigate to="/signin" replace />;
  }

  // User is logged in and session is valid, render the component
  return children;
};

export default ProtectedRoute;
