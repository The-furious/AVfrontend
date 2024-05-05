import React from 'react';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const ScreenshotButton = ({ dicomImage }) => {
  const navigate = useNavigate();
  const takeScreenshot = async () => {
    const element = document.getElementById('layerGroup0');
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');

    const impressionText = prompt('Please enter your impression:');
    if (impressionText) {
      saveImpression(impressionText, imgData);
    } else {
      alert('Impression text is required.');
    }
  };

  const saveImpression = async (impressionText, imgData) => {
    try {
      console.log(dicomImage);
      const formData = new FormData();
      formData.append('imageId', dicomImage.imageId);
      formData.append('radiologistId', dicomImage.radiologistId);
      formData.append('impressionText', impressionText);
      
      // Create a blob from the base64 image data
      const blob = dataURItoBlob(imgData);
      formData.append('imageFile', blob, 'screenshot.png'); // Append the blob with filename
      
      const token = sessionStorage.getItem('jwtToken');
      const response = await axios.post('http://localhost:8090/annotations/add', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Impression saved:', response.data);
      navigate("/radiologist-consultancy-view/:radiologistName");
      

    } catch (error) {
      console.error('Error saving impression:', error);
      // Handle error, show error message to user, etc.
    }
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

  return <button onClick={takeScreenshot}>Save Screenshot</button>;
};


export default ScreenshotButton;
