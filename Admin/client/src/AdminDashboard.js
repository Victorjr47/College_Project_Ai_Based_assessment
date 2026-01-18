import React from 'react';
import './AdminDashboard.css'; // Import the CSS file

const AdminDashboard = () => {

  return (
    <div className="admin-dashboard">
      <h1 className="welcome-message">Welcome Admin !!!</h1>
      <h2 className="choice">What do you like to do?</h2>
      <div className='design-dash'>
        <a href='/createassessment' className='link'>
          <img src={require('./Admin1.png')} width={180}/>
          <h4 className='title-heading'>Create Assessment</h4>
        </a>
        <a href='/uploadquestions' className='link'>
          <img src={require('./Admin2.png')} width={180}/>
          <h4 className='title-heading'>Upload Questions</h4>
        </a>
        <a href='/reports' className='link'>
          <img src={require('./Admin3.png')} width={180}/>
          <h4 className='title-heading'>Reports</h4>
        </a>
        <a href='/suspiciousactivities' className='link'>
          <img src={require('./Admin4.png')} width={180}/>
          <h4 className='title-heading'>Suspicious Activities</h4>
        </a>
      </div>
    </div>
  );
};

export default AdminDashboard;
