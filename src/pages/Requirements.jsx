import React from 'react';
import Sidebar from '../components/Sidebar';
import TopNavigationBar2 from '../components/TopNavigationBar2';
import { FileText, CheckCircle } from 'lucide-react';
import './Dashboard/dashboard.css';
import '../styles/Requirements.css';

const Requirements = () => {
  const sections = [
    {
      title: "Fire Safety Evaluation Clearance",
      items: [
        "Architectural documents",
        "Civil/structural documents",
        "Electrical documents",
        "Mechanical documents",
        "Photocopies of valid licenses of involved professional",
        "Electronics documents",
        "Fire protection plan",
        "1 set of estimated cost of the building to be constructed / renovated / modified as reflected in the bill of materials including labor cost signed and sealed by the designer / contractor and duly notarized",
        "Fire safety compliant report"
      ]
    },
    {
      title: "FSIC - Occupancy Permit",
      items: [
        "Copy of application form for certificate of occupancy from office of the building official",
        "Assessment of fees from obo",
        "Photocopy of certificate of completion",
        "As-built plan (if necessary)"
      ]
    },
    {
      title: "FSIC - Business Permit (New)",
      items: [
        "Fees assessment bill from the business permit and licensing office",
        "Copy of fire insurance (if any)",
        "Affidavit of no alteration to building (for new business with valid fsic issued for occupancy)"
      ]
    }
  ];

  return (
    <div className="dashboard-container">
      <TopNavigationBar2 />
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-main-content">
          <div className="requirements-header">
            <h1 className="requirements-title">Application Requirements</h1>
            <p className="requirements-subtitle">Review the required documents for each type of fire safety application</p>
          </div>

          <div className="requirements-grid">
            {sections.map((section, index) => (
              <div key={index} className="requirement-card">
                <div className="requirement-card-header">
                  <div className="requirement-icon">
                    <FileText size={22} strokeWidth={2} />
                  </div>
                  <h2 className="requirement-card-title">{section.title}</h2>
                </div>

                <ul className="requirement-list">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="requirement-item">
                      <div className="check-icon">
                        <CheckCircle size={16} fill="#0d9488" color="white" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Requirements;
