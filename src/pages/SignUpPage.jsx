import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignUpPage.css';
import logo from '../assets/Logo.svg';
import ExitButton from '../components/exitButton';

const SignUpPage = () => {
  const navigate = useNavigate();
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    passwordConfirmation: ''
  });
  const [password, setPassword] = useState('');
  
  // Interaction State
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});

  // Refs for focusing
  const refs = {
    firstName: useRef(null),
    lastName: useRef(null),
    email: useRef(null),
    phone: useRef(null),
    password: useRef(null),
    passwordConfirmation: useRef(null)
  };

  const isPasswordValid = password.length >= 8 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);

  const isPasswordConfirmationValid = password.length > 0 && formData.passwordConfirmation === password;
  const isPasswordConfirmationInvalid = formData.passwordConfirmation.length > 0 && formData.passwordConfirmation !== password;

  // Simple email validation: non-empty, no spaces, contains '@', domain ending in something like .com/.org/etc
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  const isPhoneValid = /^\d+$/.test(formData.phone) && formData.phone.length === 10;
  const isPhoneInvalidDigits = formData.phone.length > 0 && !/^\d+$/.test(formData.phone);
  const isPhoneInvalidLength = formData.phone.length > 0 && /^\d+$/.test(formData.phone) && formData.phone.length !== 10;

  const getPasswordHintText = () => {
    const missing = [];
    if (password.length < 8) missing.push("at least 8 characters");
    if (!/\d/.test(password)) missing.push("a number");
    if (!/[A-Z]/.test(password)) missing.push("an uppercase letter");
    if (!/[a-z]/.test(password)) missing.push("a lowercase letter");

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
  const showHint = password.length > 0 && hintText !== "";

  // Helper for highlighting fields
  const getFieldClass = (fieldName) => {
    const value = fieldName === 'password' ? password : formData[fieldName];
    const isTouched = touchedFields[fieldName];
    const isInvalid = (hasSubmitted || isTouched) && !value;
    const isValid = value && value.length > 0;
    
    if (fieldName === 'password') {
      let pwClass = 'form-input';
      if (isInvalid) {
        pwClass += ' input-error';
        if (isPasswordFocused) pwClass += ' focus-error';
      } else if (isPasswordFocused && password.length === 0) {
        pwClass += ' input-success';
      } else if (password.length > 0 || hasSubmitted) {
        pwClass += isPasswordValid ? ' input-success' : ' input-error';
        if (!isPasswordValid && isPasswordFocused) pwClass += ' focus-error';
      }
      return pwClass;
    }

    if (fieldName === 'passwordConfirmation') {
      let pcClass = 'form-input';
      if (isInvalid) {
        pcClass += ' input-error';
      } else if (formData.passwordConfirmation.length > 0) {
        pcClass += isPasswordConfirmationValid ? ' input-success' : ' input-error';
      }
      return pcClass;
    }

    if (fieldName === 'email') {
      let emailClass = 'form-input';
      if (isInvalid) {
        emailClass += ' input-error';
      } else if (formData.email.length > 0) {
        emailClass += isEmailValid ? ' input-success' : ' input-error';
      }
      return emailClass;
    }

    if (fieldName === 'phone') {
      let phoneClass = 'form-input phone-input';
      if (isInvalid) {
        phoneClass += ' input-error';
      } else if (formData.phone.length > 0) {
        phoneClass += isPhoneValid ? ' input-success' : ' input-error';
      }
      return phoneClass;
    }

    let className = 'form-input';
    if (fieldName === 'phone') className += ' phone-input';
    
    if (isInvalid) {
      className += ' input-error';
    } else if (isValid) {
      className += ' input-success';
    }
    
    return className;
  };

  const handleInputChange = (e, fieldName) => {
    let value = e.target.value;
    
    // Enforce max length of 11 digits for phone before stripping
    if (fieldName === 'phone') {
      if (value.length > 11) return;
    }

    setFormData({ ...formData, [fieldName]: value });
    setTouchedFields({ ...touchedFields, [fieldName]: true });
    
    // Automatically touch previous fields if skipping ahead
    const fieldOrder = ['firstName', 'lastName', 'email', 'phone', 'password', 'passwordConfirmation'];
    const currentIndex = fieldOrder.indexOf(fieldName);
    const newTouched = { ...touchedFields, [fieldName]: true };
    for (let i = 0; i < currentIndex; i++) {
        newTouched[fieldOrder[i]] = true;
    }
    setTouchedFields(newTouched);
  };

  const handlePhoneBlur = () => {
    let phoneVal = formData.phone;
    if (phoneVal.startsWith('0')) {
      phoneVal = phoneVal.substring(1);
      setFormData({ ...formData, phone: phoneVal });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    
    // Check all fields
    const fieldOrder = ['firstName', 'lastName', 'email', 'phone', 'password', 'passwordConfirmation'];
    const newTouched = {};
    fieldOrder.forEach(field => newTouched[field] = true);
    setTouchedFields(newTouched);
    
    // Find first invalid field and focus it
    for (const field of fieldOrder) {
      const value = field === 'password' ? password : formData[field];
      let isValid = !!value;
      if (field === 'password') isValid = isPasswordValid;
      if (field === 'passwordConfirmation') isValid = isPasswordConfirmationValid;
      if (field === 'email') isValid = isEmailValid;
      if (field === 'phone') isValid = isPhoneValid;
      
      if (!isValid) {
        refs[field].current?.focus();
        return; // Stop here if invalid
      }
    }
    
    // If we reach here, form is valid
    console.log("Form submitted successfully");
  };

  const isFieldInvalid = (fieldName) => {
    const value = fieldName === 'password' ? password : formData[fieldName];
    const isTouched = touchedFields[fieldName];
    return (hasSubmitted || isTouched) && !value;
  };

  const showTopError = hasSubmitted && Object.keys(refs).some(field => isFieldInvalid(field));

  return (
    <div className="signup-container">
      {/* Background with Dark Gradient */}
      <div className="signup-background"></div>

      {/* Main Content Area */}
      <div className="signup-content">
        {/* Header Section (Above the card) */}
        <div className="signup-header">
          <img src={logo} alt="Fire Safety Inspection System Logo" className="signup-logo" />
          <h1 className="signup-title">Fire Safety Inspection System</h1>
        </div>

        {/* Signup Card */}
        <div className="signup-card">
          <ExitButton to="/" />

          <h2 className="card-title-left">Create Account</h2>
          <p className="card-subtitle-left">
            Please complete the registration form
          </p>

          <form className="signup-form" onSubmit={handleSubmit} noValidate>
            {showTopError && (
              <div className="form-top-error">
                Please fill up all the required fields
              </div>
            )}
            
            <div className="form-grid">
              {/* Row 1 */}
              <div className="input-group-vertical">
                <div className="input-container">
                  <input 
                    type="text" 
                    placeholder=" " 
                    className={getFieldClass('firstName')}
                    title="Please fill out this field."
                    value={formData.firstName}
                    onChange={(e) => handleInputChange(e, 'firstName')}
                    ref={refs.firstName}
                    required
                  />
                  <label className="floating-label">First Name</label>
                </div>
                {isFieldInvalid('firstName') && (
                  <p className="field-error-text">This field is required</p>
                )}
              </div>
              <div className="input-group-vertical">
                <div className="input-container">
                  <input 
                    type="text" 
                    placeholder=" " 
                    className={getFieldClass('lastName')}
                    title="Please fill out this field."
                    value={formData.lastName}
                    onChange={(e) => handleInputChange(e, 'lastName')}
                    ref={refs.lastName}
                    required
                  />
                  <label className="floating-label">Last Name</label>
                </div>
                {isFieldInvalid('lastName') && (
                  <p className="field-error-text">This field is required</p>
                )}
              </div>

              {/* Row 2 */}
              <div className="input-group-vertical">
                <div className="input-container">
                  <input 
                    type="email" 
                    placeholder=" " 
                    className={getFieldClass('email')}
                    title="Please fill out this field."
                    value={formData.email}
                    onChange={(e) => handleInputChange(e, 'email')}
                    ref={refs.email}
                    required
                  />
                  <label className="floating-label">Email Address</label>
                </div>
                {isFieldInvalid('email') && formData.email.length === 0 && (
                  <p className="field-error-text">This field is required</p>
                )}
                {formData.email.length > 0 && !isEmailValid && (
                  <p className="field-error-text">Please provide a valid email address</p>
                )}
              </div>
              <div className="input-group-vertical">
                <div className="input-group-with-prefix">
                  <span className="phone-prefix">+63</span>
                  <input 
                    type="tel" 
                    placeholder=" " 
                    className={getFieldClass('phone')}
                    title="Please fill out this field."
                    value={formData.phone}
                    onChange={(e) => handleInputChange(e, 'phone')}
                    onBlur={handlePhoneBlur}
                    ref={refs.phone}
                    required
                  />
                  <label className="floating-label phone-label">Mobile Number</label>
                </div>
                {isFieldInvalid('phone') && formData.phone.length === 0 && (
                  <p className="field-error-text">This field is required</p>
                )}
                {isPhoneInvalidDigits && (
                  <p className="field-error-text">Please enter digits only</p>
                )}
                {isPhoneInvalidLength && (
                  <p className="field-error-text">Mobile number must be 10 digits after +63</p>
                )}
              </div>

              {/* Row 3 */}
              <div className="input-group-vertical">
                <div className="input-container">
                  <input 
                    type="password" 
                    placeholder=" " 
                    className={getFieldClass('password')}
                    title="Please fill out this field."
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      handleInputChange(e, 'password');
                    }}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    ref={refs.password}
                    required
                  />
                  <label className="floating-label">Password</label>
                </div>
                {showHint && (
                  <p className="password-hint hint-error">
                    {hintText}
                  </p>
                )}
                {isFieldInvalid('password') && !showHint && (
                  <p className="field-error-text">This field is required</p>
                )}
              </div>
              <div className="input-group-vertical">
                <div className="input-container">
                  <input 
                    type="password" 
                    placeholder=" " 
                    className={getFieldClass('passwordConfirmation')}
                    title="Please fill out this field."
                    value={formData.passwordConfirmation}
                    onChange={(e) => handleInputChange(e, 'passwordConfirmation')}
                    ref={refs.passwordConfirmation}
                    required
                  />
                  <label className="floating-label">Password Confirmation</label>
                </div>
                {isFieldInvalid('passwordConfirmation') && formData.passwordConfirmation.length === 0 && (
                  <p className="field-error-text">This field is required</p>
                )}
                {formData.passwordConfirmation.length > 0 && !isPasswordConfirmationValid && (
                  <p className="field-error-text">
                    {password.length === 0 ? 'Please provide a password first' : 'Passwords do not match'}
                  </p>
                )}
              </div>
            </div>

            <p className="terms-text">
              By clicking Sign Up, you agree to our <a href="#" className="link-terms" onClick={(e) => { e.preventDefault(); navigate('/terms'); }}>Terms and Conditions</a>. 
              You may receive Email Notifications from us<br/>and can opt out any time.
            </p>

            <div className="submit-container">
              <button type="submit" className="btn-signup-submit">Sign Up</button>
            </div>
          </form>

          <div className="card-footer-signup">
            <p className="signin-prompt">
              Already have an account? <a href="#" className="link-signin" onClick={(e) => { e.preventDefault(); navigate('/signin'); }}>Sign In <span className="arrow">→</span></a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
