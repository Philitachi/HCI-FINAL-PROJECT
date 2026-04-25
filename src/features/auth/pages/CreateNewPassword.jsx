import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { hashPassword, generateSalt } from '../../../utils/crypto';
import illustrationDark from '../../../assets/Createnewpassword.svg';
import illustrationLight from '../../../assets/Createnewpassword.svg';
import '../styles/CreateNewPassword.css';
import { Loader2 } from 'lucide-react';

const CreateNewPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Guard clause: If someone tries to visit this page directly without passing verification state
  const state = location.state;
  const verifiedUserDocId = state?.verifiedUserDocId;
  const verifiedUserData = state?.verifiedUserData;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Validate passwords
  const isPasswordValid = newPassword.length >= 8 && /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) && /[0-9]/.test(newPassword);
  const doPasswordsMatch = newPassword !== '' && newPassword === confirmPassword;

  const getPasswordHintText = () => {
    const missing = [];
    if (newPassword.length < 8) missing.push("at least 8 characters");
    if (!/\d/.test(newPassword)) missing.push("a number");
    if (!/[A-Z]/.test(newPassword)) missing.push("an uppercase letter");
    if (!/[a-z]/.test(newPassword)) missing.push("a lowercase letter");

    if (missing.length === 0) return "";

    if (missing.length === 1) {
      return `Password should contain ${missing[0]}.`;
    }
    if (missing.length === 2) {
      return `Password should contain ${missing[0]} and ${missing[1]}.`;
    }
    
    const last = missing.pop();
    return `Password should contain ${missing.join(', ')}, and ${last}.`;
  };

  const hintText = getPasswordHintText();
  const showHint = newPassword.length > 0 && hintText !== "";

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      setError(hintText || 'Please enter a valid password.');
      return;
    }
    if (!doPasswordsMatch) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 1. Generate a NEW salt for the new password
      const newSalt = generateSalt(24);

      // 2. Hash the new password with the new salt
      const hashedPass = await hashPassword(newPassword, newSalt);

      // 3. Update the password and salt in Firestore and clear the reset code
      await updateDoc(doc(db, 'users', verifiedUserDocId), {
        password: hashedPass,
        salt: newSalt,
        resetCode: null,
        resetCodeExpiresAt: null
      });

      // 3. Move to success screen
      navigate('/password-reset-success', { replace: true });
    } catch (err) {
      console.error('Password reset error:', err);
      setError('An error occurred while resetting the password.');
    } finally {
      setIsLoading(false);
    }
  };

  // If accessed directly without proper state, bounce back to reset-password
  if (!verifiedUserDocId) {
    return <Navigate to="/reset-password" replace />;
  }

  return (
    <div className="create-password-page-container">
      <div className="create-password-box">
        <div className="illustration-wrapper-create">
          <img 
            src={illustrationDark} 
            alt="Create New Password" 
            className="create-password-icon dark-img" 
          />
          <img 
            src={illustrationLight} 
            alt="Create New Password" 
            className="create-password-icon light-img" 
          />
        </div>

        <h1 className="create-password-title">Create New Password</h1>
        <p className="create-password-description">
          Please enter your new password below. Ensure it is strong and easy to remember.
        </p>

        {error && <div className="create-password-error">{error}</div>}

        <form onSubmit={handleResetPassword} className="create-password-form">
          <div className="create-input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="New Password"
              className="create-input-field"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setError('');
              }}
              required
            />
            <button 
              type="button" 
              className="create-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              )}
            </button>
          </div>
          {showHint && (
            <div className="create-password-hint">{hintText}</div>
          )}

          <div className="create-input-group">
            <input
              type={showPasswordConfirm ? 'text' : 'password'}
              placeholder="Confirm Password"
              className={`create-input-field ${confirmPassword.length > 0 ? (doPasswordsMatch ? 'match-success' : 'match-error') : ''}`}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError('');
              }}
              required
            />
            <button 
              type="button" 
              className="create-password-toggle"
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              aria-label={showPasswordConfirm ? "Hide password" : "Show password"}
            >
              {showPasswordConfirm ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              )}
            </button>
          </div>
          {confirmPassword.length > 0 && !doPasswordsMatch && (
            <div className="create-password-hint">
              {newPassword.length === 0 ? 'Please provide a password first' : 'Passwords do not match'}
            </div>
          )}

          <button 
            type="submit" 
            className="create-btn-primary" 
            disabled={isLoading || !isPasswordValid || !doPasswordsMatch}
          >
            {isLoading ? <><Loader2 size={18} className="btn-spinner" /> Resetting...</> : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNewPassword;
