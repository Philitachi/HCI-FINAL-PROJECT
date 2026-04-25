import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import TopNavigationBar from './TopNavigationBar';
import { getUserSession } from '../../utils/userSession';

const PublicLayout = () => {
  if (Capacitor.isNativePlatform()) {
    return <Navigate to={getUserSession() ? '/dashboard' : '/signin'} replace />;
  }

  return (
    <>
      <TopNavigationBar />
      <Outlet />
    </>
  );
};

export default PublicLayout;
