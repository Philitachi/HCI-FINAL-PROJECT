import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNavigationBar from './TopNavigationBar';

const PublicLayout = () => {
  return (
    <>
      <TopNavigationBar />
      <Outlet />
    </>
  );
};

export default PublicLayout;
