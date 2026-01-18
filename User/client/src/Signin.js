import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom'; // Import useNavigate
import { GoogleOAuthProvider } from '@react-oauth/google';
import './Signin.css';
import { useAuth } from './context';
import { doSignInWithGoogle } from './authfb';

export default function Signin() {
  const { userLoggedIn, handleSignIn, handleSignUp } = useAuth(); // Use handleSignIn and handleSignUp from context
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Signup states
  const [name, setName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Toggle functions
  const togglePassword = () => setShowPassword(!showPassword);
  const toggleSignupPassword = () => setShowSignupPassword(!showSignupPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await handleSignIn(email, password); // Call the sign-in function from context
        navigate('/dashboard'); // Redirect to dashboard
      } catch (error) {
        setErrorMessage('User not found');
      } finally {
        setIsSigningIn(false);
      }
    }
  };
  
  const onGoogleSignIn = (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      doSignInWithGoogle().catch((err) => {
        setIsSigningIn(false);
        setErrorMessage(err.message);
      });
    }
  };

  const onSignupSubmit = async (e) => {
    e.preventDefault();
    console.log('onSignupSubmit called');
    if (!name || !signupEmail || !signupPassword || !confirmPassword) {
      setErrorMessage('All fields are required');
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(signupPassword)) {
      setErrorMessage('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
      return;
    }
    if (signupPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    try {
      console.log('Calling handleSignUp with:', signupEmail, signupPassword, name);
      await handleSignUp(signupEmail, signupPassword, name);
      console.log('Signup successful');
      setShowSuccessPopup(true);
      setIsActive(false); // Switch to signin form after successful signup
      setEmail(signupEmail); // Pre-fill signin email
      setPassword(signupPassword); // Pre-fill signin password
      // Hide popup after 3 seconds
      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (error) {
      console.error('Signup error:', error);
      setErrorMessage(error.message);
    }
  };
  const [isActive, setIsActive] = useState(false);

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  return (
    <div className="whole">
        {showSuccessPopup && (
          <div style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '15px 30px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            fontFamily: 'Arial, sans-serif',
            fontSize: '16px',
            animation: 'slideDown 0.5s ease-out'
          }}>
            <span style={{
              fontSize: '24px',
              marginRight: '10px',
              color: '#fff'
            }}>✓</span>
            <span>Account created successfully!</span>
          </div>
        )}
        <div className={`container ${isActive ? "active" : ""}`} id="container">
          <div className={`form-container sign-up ${isActive ? "" : "hidden"}`}>
            <form onSubmit={onSignupSubmit}>
              <h1>Create Account</h1>
              <span>Or</span>
              <div style={{ position: 'relative' }}>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={{ paddingRight: '10px', paddingLeft: '30px' }} />
              </div>
              <div style={{ position: 'relative' }}>
                <input type="email" placeholder="Email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} style={{ paddingRight: '10px', paddingLeft: '30px' }} />
              </div>
              <div style={{ position: 'relative' }}>
                <input type={showSignupPassword ? 'text' : 'password'} placeholder="Password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} style={{ paddingRight: '10px', paddingLeft: '30px' }} />
                <span onClick={toggleSignupPassword} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                  {showSignupPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 12 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 12.0012 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4789 5 20.2682 7.94291 21.5424 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ paddingRight: '10px', paddingLeft: '30px' }} />
                <span onClick={toggleConfirmPassword} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                  {showConfirmPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 12 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 12.0012 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4789 5 20.2682 7.94291 21.5424 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
              </div>
              {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
              <button type="submit">Sign Up</button>
            </form>
          </div>
          <div className={`form-container sign-in ${isActive ? "hidden" : ""}`}>
            <form onSubmit={onSubmit}>
              <h1>Sign In</h1>
              <div style={{ position: 'relative' }}>
                <input type="email" placeholder="Email" id="username" value={email} onChange={(e) => setEmail(e.target.value)} style={{ paddingRight: '10px', paddingLeft: '30px' }} />
              </div>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} placeholder="Password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ paddingRight: '10px', paddingLeft: '30px' }} />
                <span onClick={togglePassword} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 12 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 12.0012 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4789 5 20.2682 7.94291 21.5424 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
              </div>
              {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
              <a href="#">Forgot Password?</a>
              <button type="submit">Sign In</button>
            </form>
          </div>
          <div className="toggle-container">
            <div className="toggle">
              <div className="toggle-panel toggle-left">
                <h1>Welcome Back!</h1>
                <p>Enter the personal details to use all of site features</p>
                <button onClick={handleLoginClick}>Sign In</button>
              </div>
              <div className="toggle-panel toggle-right">
                <h1>Hello, User!</h1>
                <p>Register with personal details to use all of site features</p>
                <button onClick={handleRegisterClick}>Sign Up</button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}