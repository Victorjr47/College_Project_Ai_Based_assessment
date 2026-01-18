import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom'; // Import useNavigate
import './signin_admin.css';
import { useAuth } from './context';
import { doSignInWithGoogle } from './authfb';

export default function Signin_admin() {
  const { userLoggedIn, handleSignIn } = useAuth(); // Use handleSignIn from context
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    if (userLoggedIn) {
      navigate('/Admin_dashboard'); // Redirect to dashboard
    }
  }, [userLoggedIn, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await handleSignIn(email, password); // Call the sign-in function from context
        navigate('/Admin_dashboard'); // Redirect to dashboard
      } catch (error) {
        setErrorMessage(error.message); // Set the error message to be displayed
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
  const [isActive, setIsActive] = useState(false);

  const handleRegisterClick = () => {
    setIsActive(true);
  };

  const handleLoginClick = () => {
    setIsActive(false);
  };

  return (
    <div className="whole">
        <div className={`container ${isActive ? "active" : ""}`} id="container">
          <div className={`form-container sign-up ${isActive ? "" : "hidden"}`}>
            <form>
              <h1>Create Account</h1>
              <span>Or</span>
              <input type="text" placeholder="Name" />
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <input type="password" placeholder="Confirm Password" />
              <button type="submit">Sign Up</button>
            </form>
          </div>
          <div className={`form-container sign-in ${isActive ? "hidden" : ""}`}>
            <form onSubmit={onSubmit}>
              <h1>Sign In</h1>
              <span>Or</span>
              <input type="email" placeholder="Email" id="username" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
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
                <h1>Hello, Admin!</h1>
                <p>Login with your provided credentials to continue</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}