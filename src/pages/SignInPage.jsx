import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import emailjs from '@emailjs/browser';
import '../styles/SignInPage.css';
import logo from '../assets/Logo.svg';
import ExitButton from '../components/exitButton';
import { hashPassword } from '../utils/crypto';
import { getUserSession, persistUserSession } from '../utils/userSession';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

const SignInPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (getUserSession()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. Query Firestore for the user with this email
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('No account found with this email. Please sign up.');
        setIsLoading(false);
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // 2. Hash the entered password with salt and compare with the one in Firestore
      // Legacy users might not have a salt, so we default to empty string
      const userSalt = userData.salt || '';
      const hashedAttempt = await hashPassword(password, userSalt);
      
      if (userData.password !== hashedAttempt) {
        setError('Invalid email or password. Please try again.');
        setIsLoading(false);
        return;
      }

      // 3. Password matches! Check email verification status
      if (userData.emailVerified) {
        // Email is verified → set local session with expiration (24 hours - standard)
        const sessionData = {
          isAuthenticated: true,
          email: userData.email,
          firstName: userData.firstName || '',
          lastName: userData.lastName || ''
        };
        await persistUserSession(sessionData);
        navigate('/dashboard');
      } else {
        // Email is NOT verified → send a new code and go to verification page
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const codeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

        // Update code in Firestore
        await updateDoc(doc(db, 'users', userDoc.id), {
          verificationCode: verificationCode,
          codeExpiresAt: codeExpiresAt.toISOString()
        });

        // Send code via EmailJS
        await emailjs.send(
          'service_1sel32g',
          'template_d5x199o',
          {
            to_email: userData.email,
            verification_code: verificationCode,
            to_name: userData.firstName || 'User',
          },
          'TkdpHziryGZ1SETq9'
        );

        navigate(`/verify-email?email=${encodeURIComponent(userData.email)}`);
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      setError('An error occurred during sign-in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-background"></div>
      <div className="signin-content">
        <div className="signin-header">
          <img src={logo} alt="Logo" className="signin-logo" />
          <h1 className="signin-title"><span className="signin-title-accent">Fire Safety</span> Inspection System</h1>
          <p className="signin-subtitle">Bureau of Fire Protection</p>
        </div>

        <div className="signin-card">
          <ExitButton to="/" />

          <h2 className="card-title">Welcome Back</h2>
          <p className="card-subtitle">
            Enter your credentials to access your<br />dashboard
          </p>

          <form className="signin-form" onSubmit={handleSignIn}>
            {error && (
              <div className="form-top-error">{error}</div>
            )}

            {/* Email Input */}
            <div className="input-wrapper">
              <span className="input-icon">
                <User size={20} color="currentColor" />
              </span>
              <input 
                type="email" 
                placeholder="Email Address" 
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="input-wrapper">
              <span className="input-icon">
                <Lock size={20} color="currentColor" />
              </span>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={20} color="currentColor" />
                ) : (
                  <Eye size={20} color="currentColor" />
                )}
              </button>
            </div>

            <button type="submit" className="signin-btn-submit" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="card-footer">
            <a href="#" className="link-forgot" onClick={(e) => { e.preventDefault(); navigate('/forgot-password'); }}>Forgot Password?</a>
            <p className="signup-prompt">
              Don't have an account? <a href="#" className="link-create" onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>Create one <span className="arrow">→</span></a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
