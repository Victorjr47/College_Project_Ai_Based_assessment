import React, { useContext, useState, useEffect } from "react";
import { auth } from "./firebase"; // Import your Firebase configuration
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Import Firestore functions

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser , setCurrentUser ] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isEmailUser, setIsEmailUser] = useState(true);
  const [isGoogleUser , setIsGoogleuser ] = useState(false);
  const [loading, setLoading ]=  useState(false);



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser (user);
        setUserLoggedIn(true); // Set to true when user is authenticated
      } else {
        setCurrentUser (null);
        setUserLoggedIn(false); // Ensure userLoggedIn is false when there's no user
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleSignIn = async (email, password) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      setUserLoggedIn(true); // Set userLoggedIn to true only after successful sign-in
    } catch (error) {
      console.error("Error signing in:", error);
      throw error; // Throw the original Firebase error to preserve error.code
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUserLoggedIn(false); // Reset userLoggedIn state
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSignUp = async (email, password, username) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Set the display name
      await updateProfile(userCredential.user, {
        displayName: username
      });
      // Optionally, send email verification
      // await sendEmailVerification(auth.currentUser);
    } catch (error) {
      console.error("Error signing up:", error);
      throw new Error(error.message || 'Failed to create account. Please try again.');
    }
  };

  const value = {
    userLoggedIn,
    currentUser ,
    handleSignIn,
    handleSignOut,
    handleSignUp,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}