import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from './context';

const WebcamComponent = () => {
  const { currentUser } = useAuth();
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/webcamjs/1.0.26/webcam.min.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        window.Webcam.set({
          width: 400,
          height: 300,
          image_format: 'png',
        });

        window.Webcam.attach(webcamRef.current);
      };
    };

    loadScript();

    // Clean up script on component unmount
    return () => {
      if (window.Webcam) {
        window.Webcam.reset();
      }
    };
  }, []);

  const capture = () => {
    window.Webcam.snap((data_uri) => {
      setImage(data_uri);
      // Save image immediately upon capture
      uploadImage(data_uri);
    });
  };

  const uploadImage = (data_uri) => {
    const username = currentUser?.displayName || 'default_user';
    console.log('Uploading image for username:', username);
    console.log('Current user:', currentUser);
    const formData = new FormData();
    const blob = dataURItoBlob(data_uri);
    formData.append('image', blob, 'captured_image.png');
    formData.append('username', username);

    fetch('http://localhost:3001/api/upload-image', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => console.log('Image uploaded:', data))
      .catch((error) => console.error('Error uploading image:', error));
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div className='disp'>
      <div className='abc'>
        <div ref={webcamRef} className='vid'>
          <video className='video' autoPlay>Video Stream Not Available.</video>
        </div>
        <button onClick={capture} className='capimg'>Capture Image</button>
      </div>
      {image && (
        <div id='results'>
          <img src={image} alt="Captured" />
        </div>
      )}
    </div>
  );
};

export default WebcamComponent;