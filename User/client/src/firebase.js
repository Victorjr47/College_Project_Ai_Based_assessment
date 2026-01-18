// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpXrhQk44m2w14H0KArSnceSTf-51ng7E",
  authDomain: "ai-assessment-platform-e2430.firebaseapp.com",
  projectId: "ai-assessment-platform-e2430",
  storageBucket: "ai-assessment-platform-e2430.firebasestorage.app",
  messagingSenderId: "749450567381",
  appId: "1:749450567381:web:db022637f13d04a7a38c5c",
  measurementId: "G-FSEN5N8N2N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth };
