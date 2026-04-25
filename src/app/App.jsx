import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { hydrateUserSession } from '../utils/userSession';
import GlobalLoader from '../components/feedback/GlobalLoader';

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

import HomePage from '../features/public/pages/HomePage';
import SignInPage from '../features/auth/pages/SignInPage';
import SignUpPage from '../features/auth/pages/SignUpPage';
import TermsAndConditions from '../features/auth/pages/TermsAndConditions';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
import EmailVerification from '../features/auth/pages/EmailVerification';
import EmailVerified from '../features/auth/pages/EmailVerified';
import Dashboard from '../features/dashboard/pages/Dashboard';
import Settings from '../features/settings/pages/Settings';
import OngoingApplicationsAll from '../features/applications/my/OngoingApplications-All';
import OngoingApplicationsCompletenessCheck from '../features/applications/my/OngoingApplications-completenesscheck';
import OngoingApplicationsAssessment from '../features/applications/my/OngoingApplications-assessment';
import OngoingApplicationsPending from '../features/applications/my/OngoingApplications-pending';
import OngoingApplicationsIssuance from '../features/applications/my/OngoingApplications-issuance';
import CompletedApplications from '../features/applications/my/CompletedApplications';
import Payment from '../features/payments/pages/Payment';
import CancelledApplications from '../features/applications/my/CancelledApplications';
import FullDetails from '../features/applications/pages/FullDetails';
import ResetPassword from '../features/auth/pages/ResetPassword';
import CreateNewPassword from '../features/auth/pages/CreateNewPassword';
import PasswordResetSuccess from '../features/auth/pages/PasswordResetSuccess';
import ProtectedRoute from '../components/routing/ProtectedRoute';
import Requirements from '../features/applications/pages/Requirements';
import Complaint from '../features/complaints/pages/Complaint';
import PublicComplaint from '../features/complaints/pages/PublicComplaint';
import UserGuide from '../features/user-guide/pages/UserGuide';
import PublicLayout from '../components/layout/PublicLayout';
import ApplicationEvaluation from '../features/applications/new/ApplicationEvaluation';
import ApplicationOccupancy from '../features/applications/new/ApplicationOccupancy';
import ApplicationCertificate from '../features/applications/new/ApplicationCertificate';
import ApplicationClearance from '../features/applications/new/ApplicationClearance';
import Renewals from '../features/applications/pages/Renewals';
import FAQs from '../features/faqs/pages/FAQs';
import Drafts from '../features/applications/pages/Drafts';
import Establishment from '../features/applications/pages/Establishment';

function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initializeApp = async () => {
      await hydrateUserSession();

      const theme = localStorage.getItem('theme');
      if (theme === 'dark') {
        document.documentElement.classList.remove('light-mode');
      } else {
        document.documentElement.classList.add('light-mode');
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
          <Route path="/user-guide" element={<UserGuide />} />
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
