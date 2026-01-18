import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react';

const MediaContext = createContext();

export function useMedia() {
  return useContext(MediaContext);
}

export function MediaProvider({ children }) {
  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioAnalyzerRef = useRef(null);
  const audioDataArrayRef = useRef(new Uint8Array(256));
  const [webcamStatus, setWebcamStatus] = useState('Initializing webcam...');
  const [audioStatus, setAudioStatus] = useState('Initializing audio...');
  const [isWebcamWorking, setIsWebcamWorking] = useState(false);
  const [isAudioWorking, setIsAudioWorking] = useState(false);

  const setupMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

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
  }, []);

  const monitorAudioLevels = () => {
    if (audioAnalyzerRef.current) {
      audioAnalyzerRef.current.getByteFrequencyData(audioDataArrayRef.current);
      const averageVolume = audioDataArrayRef.current.reduce((a, b) => a + b, 0) / audioDataArrayRef.current.length;
      if (averageVolume > 10) {
        setAudioStatus('Audio levels detected');
      } else {
        setAudioStatus('Audio levels low or silent');
      }
      requestAnimationFrame(monitorAudioLevels);
    }
  };

  useEffect(() => {
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

  const stopMedia = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setWebcamStatus('Webcam stopped');
    setAudioStatus('Audio stopped');
    setIsWebcamWorking(false);
    setIsAudioWorking(false);
  }, []);

  const value = {
    webcamStatus,
    audioStatus,
    videoRef,
    setupMedia,
    stopMedia,
    isWebcamWorking,
    isAudioWorking,
  };

  return (
    <MediaContext.Provider value={value}>
      {children}
    </MediaContext.Provider>
  );
}
