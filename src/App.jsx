import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { hydrateUserSession } from './utils/userSession';
import GlobalLoader from './components/GlobalLoader';

// Scrolls to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Moves keyboard/screen-reader focus into the new page after route navigation.
function RouteFocusManager() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const focusTimer = window.setTimeout(() => {
      if (document.querySelector('[aria-modal="true"]')) return;

      const target =
        document.querySelector('main [data-route-focus="true"]') ||
        document.querySelector('main h1') ||
        document.querySelector('main h2') ||
        document.querySelector('main');

      if (!(target instanceof HTMLElement)) return;

      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1');
        target.dataset.routeFocusTabindexAdded = 'true';
      }

      target.classList.add('route-focus-target');

      try {
        target.focus({ preventScroll: true });
      } catch {
        target.focus();
      }
    }, 80);

    return () => window.clearTimeout(focusTimer);
  }, [pathname, search]);

  return null;
}

import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import TermsAndConditions from './pages/termandconditons';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import EmailVerification from './pages/emailVerification';
import EmailVerified from './pages/emailVerified';
import Dashboard from './pages/Dashboard/dashboard';
import Settings from './pages/Settings';
import OngoingApplicationsAll from './pages/myapplication/OngoingApplications-All';
import OngoingApplicationsCompletenessCheck from './pages/myapplication/OngoingApplications-completenesscheck';
import OngoingApplicationsAssessment from './pages/myapplication/OngoingApplications-assessment';
import OngoingApplicationsPending from './pages/myapplication/OngoingApplications-pending';
import OngoingApplicationsIssuance from './pages/myapplication/OngoingApplications-issuance';
import CompletedApplications from './pages/myapplication/CompletedApplications';
import Payment from './pages/Payment';
import CancelledApplications from './pages/myapplication/CancelledApplications';
import FullDetails from './pages/FullDetails';
import ResetPassword from './pages/ResetPassword';
import CreateNewPassword from './pages/CreateNewPassword';
import PasswordResetSuccess from './pages/PasswordResetSuccess';
import ProtectedRoute from './components/ProtectedRoute';
import Requirements from './pages/Requirements';
import Complaint from './pages/Complaint';
import PublicComplaint from './pages/PublicComplaint';
import PublicLayout from './components/PublicLayout';
import ApplicationEvaluation from './pages/newapplication/ApplicationEvaluation';
import ApplicationOccupancy from './pages/newapplication/ApplicationOccupancy';
import ApplicationCertificate from './pages/newapplication/ApplicationCertificate';
import ApplicationClearance from './pages/newapplication/ApplicationClearance';
import Renewals from './pages/Renewals';
import FAQs from './pages/FAQs';
import Drafts from './pages/Drafts';
import Establishment from './pages/Establishment';

function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initializeApp = async () => {
      await hydrateUserSession();

      const theme = localStorage.getItem('theme');
      if (theme === 'light') {
        document.documentElement.classList.add('light-mode');
      } else {
        document.documentElement.classList.remove('light-mode');
      }

      // Initialize Font Style
      const font = localStorage.getItem('fontFamily') || 'Outfit';
      document.documentElement.setAttribute('data-font', font);

      // Initialize Font Size
      const fontSize = localStorage.getItem('fontSize') || 'medium';
      document.documentElement.setAttribute('data-font-size', fontSize);

      if (isMounted) {
        setIsAppReady(true);
      }
    };

    void initializeApp();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isAppReady) {
    return null;
  }

  return (
    <Router>
      <GlobalLoader />
      <ScrollToTop />
      <RouteFocusManager />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<HomePage />} />
          <Route path="/submit-complaint" element={<PublicComplaint />} />
        </Route>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/terms" element={<TermsAndConditions />} />
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
        <Route 
          path="/payment" 
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/applications" 
          element={
            <ProtectedRoute>
              <OngoingApplicationsAll />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/applications/all" 
          element={
            <ProtectedRoute>
              <OngoingApplicationsAll />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/applications/completeness" 
          element={
            <ProtectedRoute>
              <OngoingApplicationsCompletenessCheck />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/applications/assessment" 
          element={
            <ProtectedRoute>
              <OngoingApplicationsAssessment />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/applications/pending" 
          element={
            <ProtectedRoute>
              <OngoingApplicationsPending />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/applications/issuance" 
          element={
            <ProtectedRoute>
              <OngoingApplicationsIssuance />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/applications/completed" 
          element={
            <ProtectedRoute>
              <CompletedApplications />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/applications/completed/:filter" 
          element={
            <ProtectedRoute>
              <CompletedApplications />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/applications/:id" 
          element={
            <ProtectedRoute>
              <FullDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/applications/cancelled" 
          element={
            <ProtectedRoute>
              <CancelledApplications />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/renewals" 
          element={
            <ProtectedRoute>
              <Renewals />
            </ProtectedRoute>
          } 
        />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/create-new-password" element={<CreateNewPassword />} />
        <Route path="/password-reset-success" element={<PasswordResetSuccess />} />
        <Route 
          path="/faqs" 
          element={
            <ProtectedRoute>
              <FAQs />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/drafts" 
          element={
            <ProtectedRoute>
              <Drafts />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/establishment" 
          element={
            <ProtectedRoute>
              <Establishment />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/requirements" 
          element={
            <ProtectedRoute>
              <Requirements />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/complaint" 
          element={
            <ProtectedRoute>
              <Complaint />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/new-application/evaluation" 
          element={
            <ProtectedRoute>
              <ApplicationEvaluation />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/new-application/occupancy" 
          element={
            <ProtectedRoute>
              <ApplicationOccupancy />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/new-application/certificate" 
          element={
            <ProtectedRoute>
              <ApplicationCertificate />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/new-application/clearance" 
          element={
            <ProtectedRoute>
              <ApplicationClearance />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
