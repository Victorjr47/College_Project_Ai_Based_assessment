import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AdminDashboard from './AdminDashboard';
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context';
import Signin_admin from './signin_admin';
import uploadquestions from './uploadquestions';
import Reports from './reports';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Signin_admin} />
        <Route path='/uploadquestions' Component={uploadquestions}/>
        <Route path='/reports' Component={Reports} />
        <Route path="/Admin_dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
