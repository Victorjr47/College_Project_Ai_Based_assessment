import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';
import { useNavigate } from 'react-router-dom'; // Hook for navigation

const Aiproctor = () => {
  const videoRef = useRef(null);
  const modelRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioAnalyzerRef = useRef(null);
  const audioDataArrayRef = useRef(new Uint8Array(256));
  const navigate = useNavigate(); // Hook for navigation

  const [faceStatus, setFaceStatus] = useState('Initializing...');
  const [audioStatus, setAudioStatus] = useState('Audio levels are normal.');
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

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      cancelAnimationFrame(animationFrameId); // Clean up the animation frame on unmount
    };
  }, []);

  const detectFaces = async () => {
    if (videoRef.current && modelRef.current) {
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
        const verticalThreshold = 25;

        let status = "Normal";

        if (nose[0] < eyeMidpointX - horizontalThreshold) {
          status = "Suspicious activity - Looking Left";
        } else if (nose[0] > eyeMidpointX + horizontalThreshold) {
          status = "Suspicious activity - Looking Right";
        } else if (nose[1] < eyeMidpointY - verticalThreshold) {
          status = "Suspicious activity - Looking Up";
        } else if (nose[1] > eyeMidpointY + verticalThreshold) {
          status = "Suspicious activity - Looking Down";
        }

        setFaceStatus(status);
      } else {
        setFaceStatus("No face detected.");
      }
    }

    animationFrameId = requestAnimationFrame(detectFaces); // Store the animation frame ID
  };

  const monitorAudioLevels = () => {
    try {
      audioAnalyzerRef.current.getByteFrequencyData(audioDataArrayRef.current);

      const averageVolume = audioDataArrayRef.current.reduce((a, b) => a + b, 0) / audioDataArrayRef.current.length;

      if (averageVolume > 60) {
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
      <p>Audio Status: {audioStatus}</ p>
    </div>
  );
};

export default Aiproctor;