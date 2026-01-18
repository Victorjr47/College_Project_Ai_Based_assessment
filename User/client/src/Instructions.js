import React from "react";
import './Instructions.css';

export default function Instructions(){
    return(
        <div className="Instructions">
            <div className="contentinst">
                <h1>Instructions To Be Noted:</h1>
                <p>Disable all the Desktop Notifications throught the assessment</p>
                <ol>
                    <li>Ensure webcam is functional and well connected.You will be monitored via webcam during the assessment</li>
                    <li>Conduct assessment fairly. Please note that toggling between screens will be considered malpractice </li>
                    <li>Keep your browser open.</li>
                    <li>Speak only when requested to do so.</li>
                    <li>Avoid allowing anyone else in the room which will automatically terminate the test.</li>
                    <li>Don't utilize third-party resources.</li>
                </ol>
                <div className="nav-btn">
                    <a href="/Checkwindow">
                        <button className="L"> 
                            <img src={require("./left.png")} width={40}></img>
                        </button>
                    </a>
                    <a href="/Testwindow">
                        <button className="L">
                            <img src={require("./right.png")} width={40}/>
                        </button>
                    </a>
                </div>
            </div>
            <img src={require("./lap.png")}></img>
        </div>
    )
}