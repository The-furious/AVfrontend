import React, { useState } from 'react';
import './ImageUpload.css'
function ImageUploadForm() {
  const [consultationId, setConsultationId] = useState('');
  const [testType, setTestType] = useState('');
  const [remarks, setRemarks] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [validationError, setValidationError] = useState(null);

  const handleImageChange = (event) => {
    const newImages = Array.from(event.target.files);
    const acceptedImages = newImages.filter((image) => {
      const extension = image.name.split('.').pop().toLowerCase();
      return extension === 'dcm' || extension === 'dicom' || image.type.includes('image/dicom');
    });

    setSelectedImages(acceptedImages);
    setValidationError(
      newImages.length !== acceptedImages.length ? 'Invalid file format. Only DICOM (.dcm or .dicom) files allowed.' : null
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Check for validation error before submission
    if (validationError) {
      return;
    }
    const formData = new FormData();
    formData.append('consultationId', consultationId);
    formData.append('testType', testType);
    formData.append('remarks', remarks);

    for (let i = 0; i < selectedImages.length; i++) {
      formData.append('images', selectedImages[i]);
    }

    // Implement logic to send the formData to your backend API
    console.log('Form data:', formData);

    // Reset the form after submission
    setConsultationId('');
    setTestType('');
    setRemarks('');
    setSelectedImages([]);
  };

  return (
    <div className="image-uploder">
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
        <label htmlFor="images">Select Images (DICOM only):</label>
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
    </div>
  );
}

export default ImageUploadForm;