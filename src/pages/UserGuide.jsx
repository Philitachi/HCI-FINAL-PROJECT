import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Archive,
  ArrowRight,
  BookOpenText,
  Building,
  CheckCircle,
  CreditCard,
  Download,
  FileCheck,
  FileText,
  HelpCircle,
  ListChecks,
  LogIn,
  MonitorSmartphone,
  Send,
  ShieldCheck,
  Smartphone,
  UploadCloud,
  UserPlus
} from 'lucide-react';
import { getUserSession } from '../utils/userSession';
import '../styles/UserGuide.css';

const guideSteps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Create and verify your account',
    text: 'Sign up with an active email address, then open the verification email before using the application workspace.'
  },
  {
    number: '02',
    icon: FileText,
    title: 'Choose the application type',
    text: 'Start a new application for evaluation, occupancy permit, certificate, or another fire safety clearance.'
  },
  {
    number: '03',
    icon: Building,
    title: 'Add your establishment details',
    text: 'Prepare the business name, address, occupancy information, and contact details that identify the establishment.'
  },
  {
    number: '04',
    icon: UploadCloud,
    title: 'Upload the required documents',
    text: 'Attach the files requested by the selected application type and review each upload before submitting.'
  },
  {
    number: '05',
    icon: Send,
    title: 'Submit and monitor progress',
    text: 'After submission, track the record from completeness checking through assessment, review, issuance, and completion.'
  },
  {
    number: '06',
    icon: CheckCircle,
    title: 'Download the final certificate',
    text: 'When the application is completed, keep a digital copy of the issued certificate or print it for compliance needs.'
  }
];

const applicationTypes = [
  {
    title: 'Fire Safety Evaluation Clearance',
    text: 'For construction, renovation, or modification work that needs fire safety evaluation before proceeding.'
  },
  {
    title: 'FSIC for Occupancy Permit',
    text: 'For establishments preparing occupancy-related documents after construction or completion requirements.'
  },
  {
    title: 'FSIC Certificate',
    text: 'For business permit or certificate-related requests that require fire safety inspection records.'
  },
  {
    title: 'Other Clearance',
    text: 'For additional fire safety clearance requests handled through the application workflow.'
  }
];

const statusFlow = [
  {
    title: 'Completeness Check',
    text: 'Your submitted files and basic details are reviewed for completeness.'
  },
  {
    title: 'Assessment',
    text: 'The application is assessed and may move into in-person payment at the office or further review steps.'
  },
  {
    title: 'Pending Review',
    text: 'The record is waiting for the next review action from the authorized office.'
  },
  {
    title: 'Issuance',
    text: 'The application is being prepared for final issuance once requirements are satisfied.'
  },
  {
    title: 'Completed',
    text: 'The application is finished and the certificate or final record is available.'
  }
];

const complaintGuideSteps = [
  {
    icon: FileText,
    title: 'Complainant information',
    text: 'Prepare your name, address, email, contact number, and gender before moving to the concern details.'
  },
  {
    icon: Building,
    title: 'Office and concern details',
    text: 'Select the region, fire station, official involved, and the nature of the complaint or concern.'
  },
  {
    icon: Send,
    title: 'Narration and consent',
    text: 'Write a clear narration of what happened, review the information, agree to the privacy consent, and submit.'
  }
];

const preparationItems = [
  'A verified email account for signing in and receiving account notices.',
  'Complete establishment information, including address and occupancy details.',
  'Readable digital copies of the documents required for your application type.',
  'Time to visit the office if fees need to be settled face-to-face.',
  'Access to the dashboard so you can check status changes and final documents.'
];

const UserGuide = () => {
  const navigate = useNavigate();
  const hasActiveSession = Boolean(getUserSession());
  const signInTarget = hasActiveSession ? '/dashboard' : '/signin';
  const apkDownloadPath = `${import.meta.env.BASE_URL}fsis-mobile-app.apk`;

  return (
    <main className="user-guide-page">
      <section className="user-guide-hero">
        <div className="user-guide-container user-guide-hero-grid">
          <div className="user-guide-hero-copy">
            <span className="user-guide-eyebrow">
              <BookOpenText size={18} strokeWidth={2} />
              User Guide
            </span>
            <h1 data-route-focus="true">How to use FSIS from sign up to certificate</h1>
            <p>
              A complete public walkthrough for preparing requirements, submitting a fire safety application,
              tracking its status, sending complaints or concerns, and installing the Android APK.
            </p>

            <div className="user-guide-actions">
              <button className="user-guide-primary-btn" onClick={() => navigate(signInTarget)}>
                <LogIn size={20} strokeWidth={2} />
                {hasActiveSession ? 'Open Dashboard' : 'Sign In to Start'}
              </button>
              <a className="user-guide-secondary-btn" href={apkDownloadPath} download="fsis-mobile-app.apk">
                <Download size={20} strokeWidth={2} />
                Download Android APK
              </a>
            </div>
          </div>

          <div className="user-guide-preview" aria-label="FSIS application flow preview">
            <div className="user-guide-preview-header">
              <MonitorSmartphone size={24} strokeWidth={2} />
              <span>Application Flow</span>
            </div>
            <div className="user-guide-preview-list">
              <div className="user-guide-preview-row">
                <span>Account</span>
                <strong>Verified</strong>
              </div>
              <div className="user-guide-preview-row">
                <span>Documents</span>
                <strong>Uploaded</strong>
              </div>
              <div className="user-guide-preview-row">
                <span>Review</span>
                <strong>In progress</strong>
              </div>
              <div className="user-guide-preview-row">
                <span>Certificate</span>
                <strong>Ready when completed</strong>
              </div>
              <div className="user-guide-preview-row">
                <span>Concerns</span>
                <strong>Public and in-app</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="user-guide-section">
        <div className="user-guide-container">
          <div className="user-guide-section-header">
            <span className="user-guide-kicker">Start Here</span>
            <h2>What to prepare before applying</h2>
            <p>
              A smooth application starts with accurate information and clear document files.
            </p>
          </div>

          <div className="user-guide-prepare-grid">
            <div className="user-guide-prepare-panel">
              <ListChecks size={30} strokeWidth={2} />
              <h3>Preparation checklist</h3>
              <ul>
                {preparationItems.map((item) => (
                  <li key={item}>
                    <CheckCircle size={18} strokeWidth={2} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="user-guide-info-panel">
              <ShieldCheck size={30} strokeWidth={2} />
              <h3>Before submission</h3>
              <p>
                Review names, addresses, document labels, and uploaded files carefully. Saved drafts can help
                you pause while preparing documents, but submitted applications move into the review workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="user-guide-section user-guide-section-alt">
        <div className="user-guide-container">
          <div className="user-guide-section-header">
            <span className="user-guide-kicker">Walkthrough</span>
            <h2>The complete application flow</h2>
            <p>
              Follow these steps in order when using the web app or the Android APK.
            </p>
          </div>

          <div className="user-guide-step-grid">
            {guideSteps.map((step) => {
              const Icon = step.icon;
              return (
                <article className="user-guide-step-card" key={step.number}>
                  <div className="user-guide-step-top">
                    <span>{step.number}</span>
                    <Icon size={24} strokeWidth={2} />
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="user-guide-section">
        <div className="user-guide-container">
          <div className="user-guide-section-header">
            <span className="user-guide-kicker">Application Types</span>
            <h2>Choose the request that matches your purpose</h2>
            <p>
              The New Application menu separates the main fire safety request types.
            </p>
          </div>

          <div className="user-guide-type-grid">
            {applicationTypes.map((type, index) => (
              <article className="user-guide-type-card" key={type.title}>
                <span className="user-guide-type-index">{String(index + 1).padStart(2, '0')}</span>
                <h3>{type.title}</h3>
                <p>{type.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="user-guide-section user-guide-section-alt">
        <div className="user-guide-container">
          <div className="user-guide-section-header">
            <span className="user-guide-kicker">Status Tracking</span>
            <h2>Understand what each status means</h2>
            <p>
              The My Applications page groups records by their current stage.
            </p>
          </div>

          <div className="user-guide-status-list">
            {statusFlow.map((status, index) => (
              <article className="user-guide-status-item" key={status.title}>
                <div className="user-guide-status-marker">{index + 1}</div>
                <div>
                  <h3>{status.title}</h3>
                  <p>{status.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="user-guide-section">
        <div className="user-guide-container">
          <div className="user-guide-section-header">
            <span className="user-guide-kicker">Complaint Guide</span>
            <h2>How to submit a complaint or concern</h2>
            <p>
              The complaint form is available from the public landing page and from inside the signed-in app.
            </p>
          </div>

          <div className="user-guide-complaint-grid">
            <div className="user-guide-complaint-panel">
              <div className="user-guide-complaint-ribbon">
                <HelpCircle size={22} strokeWidth={2} />
                <span>Concerns can be sent through FSIS</span>
              </div>
              <div className="user-guide-complaint-notice">
                <h3>Use this when you need to report a service concern</h3>
                <p>
                  Open Submit a Complaint from the public navigation if you are not signed in, or use the Complaint
                  page inside the app when you are already in your workspace.
                </p>
              </div>
              <div className="user-guide-complaint-access">
                <div>
                  <strong>Public access</strong>
                  <span>Available before signing in from the landing page.</span>
                </div>
                <div>
                  <strong>Inside the app</strong>
                  <span>Available after signing in from the app navigation.</span>
                </div>
              </div>
              <button className="user-guide-primary-btn" onClick={() => navigate('/submit-complaint')}>
                <FileText size={20} strokeWidth={2} />
                Open Complaint Page
                <ArrowRight size={18} strokeWidth={2} />
              </button>
            </div>

            <div className="user-guide-complaint-steps">
              {complaintGuideSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <article className="user-guide-complaint-step" key={step.title}>
                    <div className="user-guide-step-top">
                      <span>{step.title}</span>
                      <Icon size={24} strokeWidth={2} />
                    </div>
                    <p>{step.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="user-guide-section user-guide-section-alt">
        <div className="user-guide-container user-guide-support-grid">
          <div className="user-guide-section-header user-guide-support-header">
            <span className="user-guide-kicker">After Submission</span>
            <h2>Where to go next inside the app</h2>
            <p>
              Once signed in, these app areas help you keep the application moving.
            </p>
          </div>

          <div className="user-guide-support-list">
            <article>
              <Archive size={24} strokeWidth={2} />
              <h3>Drafts</h3>
              <p>Continue applications you saved before submitting.</p>
            </article>
            <article>
              <CreditCard size={24} strokeWidth={2} />
              <h3>Payment</h3>
              <p>View payment records only. Fees are settled face-to-face through the office.</p>
            </article>
            <article>
              <FileCheck size={24} strokeWidth={2} />
              <h3>Requirements</h3>
              <p>Review document lists for the available application types.</p>
            </article>
            <article>
              <HelpCircle size={24} strokeWidth={2} />
              <h3>FAQs</h3>
              <p>Find quick answers for common questions while using your dashboard.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="user-guide-android-section">
        <div className="user-guide-container user-guide-android-panel">
          <div>
            <span className="user-guide-kicker">Android APK</span>
            <h2>Install FSIS on Android</h2>
            <p>
              The downloadable app is currently for Android. Use the APK button from the landing page or this guide,
              then open the installed app and sign in with your FSIS account.
            </p>
          </div>
          <a className="user-guide-primary-link" href={apkDownloadPath} download="fsis-mobile-app.apk">
            <Smartphone size={20} strokeWidth={2} />
            Download Android APK
            <ArrowRight size={18} strokeWidth={2} />
          </a>
        </div>
      </section>
    </main>
  );
};

export default UserGuide;
