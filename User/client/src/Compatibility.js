import React, { useEffect, useRef, useState } from "react";
import './Compatibility.css';

export default function Compatibility(){
    const videoRef = useRef(null);
    const audioContextRef = useRef(null);
    const audioAnalyzerRef = useRef(null);
    const audioDataArrayRef = useRef(new Uint8Array(256));
    const [webcamStatus, setWebcamStatus] = useState('Initializing webcam...');
    const [audioStatus, setAudioStatus] = useState('Initializing audio...');
    const [isWebcamWorking, setIsWebcamWorking] = useState(false);
    const [isAudioWorking, setIsAudioWorking] = useState(false);

    useEffect(() => {
        const setupMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                videoRef.current.srcObject = stream;

                // Initialize audio context and analyzer
                audioContextRef.current = new AudioContext();
                audioAnalyzerRef.current = audioContextRef.current.createAnalyser();
                const audioSource = audioContextRef.current.createMediaStreamSource(stream);
                audioSource.connect(audioAnalyzerRef.current);

                setWebcamStatus('Webcam is working');
                setIsWebcamWorking(true);
                setAudioStatus('Audio is working');
                setIsAudioWorking(true);

                // Start monitoring audio levels
                monitorAudioLevels();
            } catch (error) {
                console.error('Error accessing media devices:', error);
                setWebcamStatus('Webcam access denied or not available');
                setAudioStatus('Audio access denied or not available');
            }
        };

        setupMedia();

        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const monitorAudioLevels = () => {
        if (audioAnalyzerRef.current) {
            audioAnalyzerRef.current.getByteFrequencyData(audioDataArrayRef.current);
            const averageVolume = audioDataArrayRef.current.reduce((a, b) => a + b, 0) / audioDataArrayRef.current.length;
            if (averageVolume > 70) {
                setAudioStatus('Audio levels detected');
            } else {
                setAudioStatus('Audio levels low or silent');
            }
            requestAnimationFrame(monitorAudioLevels);
        }
    };

    return(
        <div className="Compatibility">
            <div className="contentcomp">
                <h1>System Compatibility Check</h1>
                <p>Ensure Your System Meets the Requirements</p>
                <div className="media-checks">
                    <div className="webcam-check">
                        <h3>Webcam Check</h3>
                        <video ref={videoRef} width="300" height="200" autoPlay muted />
                        <p>{webcamStatus}</p>
                    </div>
                    <div className="audio-check">
                        <h3>Audio Check</h3>
                        <p>{audioStatus}</p>
                        <p>Speak or make noise to test audio levels</p>
                    </div>
                </div>
                <div className="nav-btn">
                    <a href="/Dashboard">
                        <button className="L">
                            <img src={require("./left.png")} width={40}></img>
                        </button>
                    </a>
                    <a href="/Checkwindow">
                        <button className="L" disabled={!isWebcamWorking || !isAudioWorking}>
                            <img src={require("./right.png")} width={40}></img>
                        </button>
                    </a>
                </div>
            </div>
            <img src={require("./lap.png")}></img>
        </div>
    )
}
