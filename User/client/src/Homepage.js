import React, { useEffect, useState } from "react";
import './Homepage.css';

export default function Homepage(){
    return(
        <div className="container1">
            <div className="Header">
                <ul className="items">
                    <li className="s">
                        <a href="/Home">Home</a>
                    </li>
                    <li className="s"><a href="/features">Features</a></li>
                    <li className="s"><a href="/Support">Support</a></li>
                    <li className="s"><a href="/Contact">Contact</a></li>
                    <li className="s" id="SignIn"><a href="/signin">Sign In</a></li>
                    <li className="btn1"><a href="/signin_admin">Login As Admin</a></li>
                </ul>
                <h1 className="heading">Welcome to AccessEase,Your Portal to Assessment and Performance Tracking </h1>
                <p className="paragraph">Join us for a seamless, secure login experience tailored for you.</p>
                <ul className="items2">
                    <li className="m"><a href="/more">Discover More</a></li>
                    <li className="btn2"><a href="/signin">Get Started</a></li>
                </ul>
            </div>
        </div>
    )
}