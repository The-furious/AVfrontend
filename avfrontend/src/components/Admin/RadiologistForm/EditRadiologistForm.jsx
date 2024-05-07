import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { useNavigate, useParams } from 'react-router-dom';

function EditRadiologistForm({radiologistId,onCloseEditForm}) {
  const navigate = useNavigate();
 // Get radiologistId from the URL params
  // State variables for form fields and popup visibility
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    contactNumber: '',
    profilePhotoUrl:'',
    address: '',
    specialization: '',
    licenseNumber: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  // Fetch radiologist details based on the ID from the URL
  useEffect(() => {
    const fetchRadiologist = async () => {
      try {
        const response = await axios.get(`http://localhost:8090/radiologist/get/${radiologistId}`);
        const radiologistData = response.data; // Assuming the response is an object containing radiologist details
        setFormData({
          ...radiologistData, // Spread the existing radiologist data
          // Overwrite only the required fields
          email: radiologistData.email || '',
          contactNumber: radiologistData.contactNumber || '',
          address: radiologistData.address || ''
        });
        console.log(radiologistData);
      } catch (error) {
        console.error('Error fetching radiologist:', error);
        // Handle error appropriately
      }
    };

    fetchRadiologist();
  }, [radiologistId]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('jwtToken');
      let response;
      // Assuming you're sending the form data to update the radiologist
      response = await axios.put(`http://localhost:8090/radiologist/update/${radiologistId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate(`/admin-dashboard/:admin/`);
      console.log('Form submitted:', response.data);
      setShowPopup(true); 
      
      onCloseEditForm();
      onCloseEditForm();
      setErrorMessage('');
      
      // Show success alert
      Swal.fire({
        title: 'Success!',
        text: 'Doctor details updated successfully!',
        icon: 'success',
        confirmButtonText: 'Ok'
      });
    } catch (error) {
      console.error('Error submitting form:', error.response);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('An error occurred while submitting the form. Please try again later.');
      }
      // Display error message with SweetAlert
      Swal.fire({
        title: 'Error!',
        text: 'Error updating radiologist.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      onCloseEditForm();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="container">
      <h1>Edit Radiologist Details</h1>
      <form onSubmit={handleSubmit}>
        {/* Email field */}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        {/* Contact number field */}
        <div className="form-group">
          <label htmlFor="contactNumber">Contact Number:</label>
          <input
            type="text"
            id="contactNumber"
            className="form-control"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            required
          />
        </div>
        {/* Address field */}
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            className="form-control"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        {/* Add other form fields similarly */}
        <button type="submit" className="btn btn-primary">Update</button>
      </form>
      {/* Error message */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {/* Popup */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Radiologist details updated successfully!</h2>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditRadiologistForm;
