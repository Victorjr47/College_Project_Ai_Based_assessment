import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import { useAuth } from './context';

export default function Signup(){
    const { userLoggedIn, handleSignUp } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    useEffect(() => {
        if (userLoggedIn) {
            navigate('/dashboard');
        }
    }, [userLoggedIn, navigate]);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isSigningUp) {
            setIsSigningUp(true);
            try {
                await handleSignUp(email, password, username);
                setShowSuccessPopup(true);
                setTimeout(() => {
                    setShowSuccessPopup(false);
                    navigate('/signin');
                }, 3000);
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setIsSigningUp(false);
            }
        }
    };

    return(
        <div className="Signin">
            {showSuccessPopup && (
                <div className="success-popup">
                    <div className="popup-content">
                        <span className="tick-mark">✓</span>
                        <p>Account created successfully!</p>
                    </div>
                </div>
            )}
            <h1 className="Greet">Join Our Community</h1>
            <p>Create an account to unlock exclusive features and benefits tailored for you.</p>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={onSubmit}>
                <label className="lbl">Email Address</label>
                <br/>
                <input type="email" placeholder="Enter your email address" className="email-input" value={email} onChange={(e) => setEmail(e.target.value)} required></input>
                <br/>
                <br/>
                <label className="lbl">Choose a username</label>
                <br/>
                <input type="text" placeholder="Pick a unique username" className="email-input" value={username} onChange={(e) => setUsername(e.target.value)} required></input>
                <br/>
                <br/>
                <label className="lbl">Create a Password</label>
                <br/>
                <input type="password" placeholder="Enter your password" className="password-input" value={password} onChange={(e) => setPassword(e.target.value)} required></input>
                <br/>
                <br/>
                <button type="submit" className="Submit-btn" disabled={isSigningUp}>Continue to Signup</button>
            </form>
            <h4 className="h4-signup">Sign in with google account</h4>
        </div>
    )
}
