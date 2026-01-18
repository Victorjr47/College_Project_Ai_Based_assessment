// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANm_WIjQEvhPU6DbfO1o-FcRk-bfMUa34",
  authDomain: "assessment-admin-3d5aa.firebaseapp.com",
  projectId: "assessment-admin-3d5aa",
  storageBucket: "assessment-admin-3d5aa.appspot.com",
  messagingSenderId: "1016765671808",
  appId: "1:1016765671808:web:07ea0330c2eb357d4a7965",
  measurementId: "G-38KS82QSZ0"
};

// Initialize Firebase


const adminapp = initializeApp(firebaseConfig);
const auth = getAuth(adminapp);
const analytics = getAnalytics(adminapp);

export { adminapp, auth };