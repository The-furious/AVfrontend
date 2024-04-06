import React, { useState } from 'react';
import axios from 'axios';
import './ImageUpload.css';

function ImageUploadForm() {
  const [consultationId, setConsultationId] = useState('');
  const [testType, setTestType] = useState('');
  const [remarks, setRemarks] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [validationError, setValidationError] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleImageChange = (event) => {
    const newImages = Array.from(event.target.files);
    setSelectedImages(newImages);
    setValidationError(null); // Clear any previous validation errors
  };

  // const handleImageChange = (event) => {
  //   const newImages = Array.from(event.target.files);
  //   const acceptedImages = newImages.filter((image) => {
  //     const extension = image.name.split('.').pop().toLowerCase();
  //     return extension === 'dcm' || extension === 'dicom' || image.type.includes('image/dicom');
  //   });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('consultationId', consultationId);
    formData.append('testType', testType);
    formData.append('remarks', remarks);

    for (let i = 0; i < selectedImages.length; i++) {
      formData.append('images', selectedImages[i]);
    }

    try {
      const response = await axios.post('http://localhost:8090/lab/upload', formData);
      console.log('Server response:', response.data);
      setShowSuccessMessage(true);
      setConsultationId('');
      setTestType('');
      setRemarks('');
      setSelectedImages([]);
    } catch (error) {
      console.error('Error while uploading images:', error);
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
  };

  return (
    <div className="image-uploader">
      <h2>Upload Image</h2>
      <form className="image-upload-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="consultationId">Consultation Id:</label>
          <input
            type="text"
            id="consultationId"
            value={consultationId}
            onChange={(e) => setConsultationId(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="testType">Test Type:</label>
          <input
            type="text"
            id="testType"
            value={testType}
            onChange={(e) => setTestType(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="remarks">Remarks:</label>
          <textarea
            id="remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="images">Select Images:</label>
          <input
            type="file"
            id="images"
            multiple
            onChange={handleImageChange}
            required
          />
          {validationError && <p className="error-message">{validationError}</p>}
        </div>
        <button type="submit">Upload Images</button>
      </form>

      {showSuccessMessage && (
        <div className="success-message">
          <p>Images uploaded successfully!</p>
          <button onClick={handleCloseSuccessMessage}>Close</button>
        </div>
      )}
    </div>
  );
}

export default ImageUploadForm;
