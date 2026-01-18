import React, { useEffect, useRef, useState } from 'react';
import * as blazeface from '@tensorflow-models/blazeface';
import { useNavigate } from 'react-router-dom'; // Hook for navigation
import '@tensorflow/tfjs'; // Import TensorFlow.js
import '@tensorflow/tfjs-backend-webgl'; // Import WebGL backend

const Aiproctor = () => {
  const videoRef = useRef(null);
  const modelRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioAnalyzerRef = useRef(null);
  const audioDataArrayRef = useRef(new Uint8Array(256));
  const navigate = useNavigate(); // Hook for navigation

  const [faceStatus, setFaceStatus] = useState('Initializing...');
  const [audioStatus, setAudioStatus] = useState('Audio levels are normal.');
  const [showWarning, setShowWarning] = useState(false); // State for warning visibility
  const noFaceStartTimeRef = useRef(null); // Timer for no face detection
  let animationFrameId; // Variable to store the animation frame ID

  useEffect(() => {
    const setupCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = stream;

      // Initialize audio context and analyzer
      audioContextRef.current = new AudioContext();
      audioAnalyzerRef.current = audioContextRef.current.createAnalyser();
      const audioSource = audioContextRef.current.createMediaStreamSource(stream);
      audioSource.connect(audioAnalyzerRef.current);
    };

    const loadModel = async () => {
      if (!modelRef.current) {
        modelRef.current = await blazeface.load();
      }
    };

    setupCamera();
    loadModel().then(() => {
      detectFaces();
      monitorAudioLevels();
    });

    // Add event listener for visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setShowWarning(true); // Show warning when tab is hidden
      } else {
        setShowWarning(false); // Hide warning when tab is visible
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      cancelAnimationFrame(animationFrameId); // Clean up the animation frame on unmount
      document.removeEventListener('visibilitychange', handleVisibilityChange); // Clean up the event listener
    };
  }, []);

  const detectFaces = async () => {
    if (videoRef.current && modelRef.current && videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
      const predictions = await modelRef.current.estimateFaces(videoRef.current, false);

      // Check if more than two faces are detected
      if (predictions.length >= 2) {
        // Clear the animation frame request
        cancelAnimationFrame(animationFrameId);

        // Navigate to the Thankyou page and terminate the test
        navigate('/Thankyou'); 
        return;
      }

      if (predictions.length > 0) {
        const face = predictions[0];
        const nose = face.landmarks[2];
        const leftEye = face.landmarks[1];
        const rightEye = face.landmarks[0];

        const eyeMidpointX = (leftEye[0] + rightEye[0]) / 2;
        const eyeMidpointY = (leftEye[1] + rightEye[1]) / 2;

        const horizontalThreshold = 20;
        const verticalThreshold = 50;

        let status = "Normal";

        if (nose[0] < eyeMidpointX - horizontalThreshold) {
          status = "Suspicious activity - Looking Right";
        } else if (nose[0] > eyeMidpointX + horizontalThreshold) {
          status = "Suspicious activity - Looking Left";
        } else if (nose[1] < eyeMidpointY - verticalThreshold) {
          status = "Suspicious activity - Looking Up";
        } else if (nose[1] > eyeMidpointY + verticalThreshold) {
          status = "Suspicious activity - Looking Down";
        }

        setFaceStatus(status);
        noFaceStartTimeRef.current = null; // Reset timer when face is detected
      } else {
        setFaceStatus("No face detected.");
        if (!noFaceStartTimeRef.current) {
          noFaceStartTimeRef.current = Date.now();
        } else if (Date.now() - noFaceStartTimeRef.current >= 3000) {
          // No face detected for 3 seconds, submit test
          navigate('/Thankyou');
        }
      }
    }

    animationFrameId = requestAnimationFrame(detectFaces);
  };

  const monitorAudioLevels = () => {
    try {
      audioAnalyzerRef.current.getByteFrequencyData(audioDataArrayRef.current);

      const averageVolume = audioDataArrayRef.current.reduce((a, b) => a + b, 0) / audioDataArrayRef.current.length;

      if (averageVolume > 65) {
        setAudioStatus("Audio levels are high.");
      } else {
        setAudioStatus("Audio levels are normal.");
      }

      requestAnimationFrame(monitorAudioLevels);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    monitorAudioLevels();
  }, []);

  return (
    <div>
      <video ref={videoRef} width="350" height="250" autoPlay muted />
      <p>Face Status: {faceStatus}</p>
      <p>Audio Status: {audioStatus}</p>
    </div>
  );
};

export default Aiproctor;