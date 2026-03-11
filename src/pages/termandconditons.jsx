import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/termandconditions.css';
import logo from '../assets/Logo.svg';
import ExitButton from '../components/exitButton';

const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <div className="terms-container">
      {/* Background with Dark Gradient */}
      <div className="terms-background"></div>

      {/* Main Content Area */}
      <div className="terms-content-wrapper">
        {/* Header Section (Above the card) */}
        <div className="terms-header">
          <img src={logo} alt="Fire Safety Inspection System Logo" className="terms-logo" />
          <h1 className="terms-title">Fire Safety Inspection System</h1>
        </div>

        {/* Terms Card */}
        <div className="terms-card">
          <ExitButton />

          <h2 className="terms-card-title">Terms and Conditions</h2>

          <div className="terms-scroll-area">
            
            <p className="terms-intro-text">Welcome to Fire Safety Inspection System (FSIS)! These terms and conditions ("Terms") govern your use of the Fire Safety Inspection System (FSIS) website, which is owned and operated by the BFP. By accessing or using the Website, you agree to be bound by these Terms. Please read them carefully before using the Website.</p>
            
            <h3>1. Use of the Website</h3>
            <ul>
                <li>You may use the Website for lawful and authorized purposes only. You agree to use the Website in compliance with all applicable laws, regulations, and these Terms.</li>
                <li>You may not use the Website in a way that may disrupt or interfere with the operation or security of the Website, or that may harm, harass, or defraud other users of the Website.</li>
                <li>You may not use the Website to upload, post, or transmit any content that is unlawful, offensive, defamatory, obscene, or otherwise objectionable, or that infringes upon the intellectual property rights of others.</li>
            </ul>

            <h3>2. Intellectual Property</h3>
            <ul>
                <li>All content, logos, trademarks, and other intellectual property on the Website are owned or licensed by the Government and are protected by copyright, trademark, and other laws. You may not copy, reproduce, modify, distribute, or display any content from the Website without the prior written consent of the Government</li>
                <li>You may use the content on the Website for personal, non-commercial purposes only, and only as expressly authorized by the Government.</li>
            </ul>

            <h3>3. Disclaimer of Liability</h3>
            <ul>
                <li>The Government makes no representations or warranties of any kind, express or implied, regarding the accuracy, completeness, reliability, or suitability of the content on the Website. The Government does not guarantee the availability, functionality, or security of the Website.</li>
                <li>The Government shall not be liable for any damages or losses arising from your use of or reliance on the Website, including but not limited to direct, indirect, incidental, consequential, or punitive damages, even if the Government has been advised of the possibility of such damages.</li>
                <li>The Website may contain links to third-party websites or resources. The Government does not endorse or control these third-party websites or resources, and is not responsible for their content or availability.</li>
            </ul>

            <h3>4. Privacy</h3>
            <ul>
                <li>The Government may collect and use personal information from users of the Website in accordance with its privacy policy, which is incorporated into these Terms by reference. Please review the privacy policy for more information on how your personal information may be collected, used, and protected.</li>
            </ul>

            <h3>5. Changes to the Terms</h3>
            <ul>
                <li>The Government reserves the right to modify or update these Terms at any time without prior notice. Your continued use of the Website after any changes to the Terms constitutes your acceptance of the updated Terms.</li>
            </ul>

            <h3>6. Governing Law and Jurisdiction</h3>
            <ul>
                <li>These Terms shall be governed by and construed in accordance with the laws of [Government Jurisdiction]. Any dispute arising out of or relating to these Terms or the use of the Website shall be subject to the exclusive jurisdiction of the courts of [Government Jurisdiction].</li>
            </ul>

            <h3>7. Contact Us</h3>
            <ul>
                <li>If you have any questions or concerns about these Terms or the Website, please contact us at [Contact Email or Address].</li>
            </ul>

            <p className="terms-outro-text">By using the Fire Safety Inspection System (FSIS) website, you acknowledge that you have read, understood, and agreed to these Terms. If you do not agree to these Terms, please refrain from using the Website. Thank you for visiting the Fire Safety Inspection System (FSIS) website. It is our pleasure to serve you! Stay safe and informed! For more information about the services we offer, please review our privacy policy, disclaimers, and contact information.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
