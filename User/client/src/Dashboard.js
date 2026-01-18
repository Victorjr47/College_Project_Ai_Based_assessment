import React from "react";
import './Dashboard.css';
import { useAuth } from './context';

export default function Dashboard(){
    const { currentUser } = useAuth();
    const candidatename = currentUser?.displayName || "User";
    return(
        <div className="Dashboard">
            <img src={require("./m_image.png")} className="Dash-image"></img>
            <div className="Dash-content">
                <h1>Welcome Back, {candidatename}! Ready to conquer your assessments? </h1>
                <p>Dive into your personalized dashboard to start or review your assessments. Track your progress and view past reports to prepare for future success.</p>
                <a href="/Compatibility">
                    <button className="Start-btn">Start Your Assessment</button>
                </a>
                <br/>
                <a href="/reports">
                    <button className="Reports-btn">View Past Reports</button>
                </a>
                <p>Your journey towards excellence begins here!</p>
            </div>
        </div>
    )
}