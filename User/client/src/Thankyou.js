import React, { useEffect } from "react";
import { useMedia } from './MediaContext';
import './Thankyou.css';

export default function Thankyou(){
    const { stopMedia } = useMedia();

    useEffect(() => {
        stopMedia();
    }, []);
    return(
        <div className="Thankyou">
            <img src={require("./submitted.webp")} width={300} height={300} className="imagethank" alt="Submission successful"/>
            <h1 className="content">Thank you! your Test has been Submitted. We are processing your application.</h1>
            <div className="button-container">
                <a href="/Dashboard">
                    <button className="DB-btn">Return to Dashboard</button>
                </a>
                <a href="/">
                    <button className="logout-btn">Logout</button>
                </a>
            </div>
        </div>
    )
}