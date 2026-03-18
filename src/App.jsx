import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import TermsAndConditions from './pages/termandconditons';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import EmailVerification from './pages/emailVerification';
import EmailVerified from './pages/emailVerified';
import Dashboard from './pages/dashboard';
import ResetPassword from './pages/ResetPassword';
import CreateNewPassword from './pages/CreateNewPassword';
import PasswordResetSuccess from './pages/PasswordResetSuccess';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/about" element={<HomePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/email-verified" element={<EmailVerified />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/create-new-password" element={<CreateNewPassword />} />
        <Route path="/password-reset-success" element={<PasswordResetSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;