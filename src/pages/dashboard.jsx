import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    navigate('/signin');
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <p>Welcome! You have successfully signed in.</p>
      
      <button 
        onClick={handleLogout} 
        style={{ marginTop: '20px', padding: '10px 20px', background: '#e11d48', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        Sign Out
      </button>
    </div>
  );
};

export default Dashboard;
