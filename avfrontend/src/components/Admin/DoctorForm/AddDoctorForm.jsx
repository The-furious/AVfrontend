import React, { useState } from 'react';
import './AddDoctorForm.css'; // Import CSS file
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

function AddDoctorForm() {
  // State variables for form fields and popup visibility
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  const isAdminLoggedIn = sessionStorage.getItem('isAdminLoggedIn') === 'true';
  const AdminId = sessionStorage.getItem('AdminId');
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare the data object to send

    if (
      !userName ||
      !password ||
      // !userFirstName ||
      // !userLastName ||
      !name ||
      !email ||
      !contactNumber ||
      !address ||
      // !specialty ||
      !registrationNumber
    ) {
      setErrorMessage('Please fill in all required fields.');
      return; // Stop form submission
    }
    const formData = {
     username: userName,
    password:password,
     name: name,
      email:email,
      // profilePhotoUrl,
     contactNumber: contactNumber,
      address:address,
      speciality:specialty,
      registrationNumber:registrationNumber,
    };

    try {
      // Send a POST request to the server with the JWT token
      const token = sessionStorage.getItem('jwtToken');
      const response = await axios.post('http://localhost:8090/admin/createDoctor', formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the JWT token to the Authorization header
        },
      });

      console.log('Form submitted:', response.data);

      // Show the popup
      setShowPopup(true);
      setErrorMessage('');

      setUserName('');
      setPassword('');
      setUserFirstName('');
      setUserLastName('');
      setName('');
      setEmail('');
      setContactNumber('');
      setAddress('');
      setSpecialty('');
      setRegistrationNumber('');
    } catch (error) {
      console.error('Error submitting form:', error.response);
      // Handle error scenarios (e.g., show an error message to the user)
      if (error.response && error.response.status === 403) {
        // JWT token expired, clear session storage and navigate to home page
        sessionStorage.clear();
       
        // Show error alert popup
        alert('Session expired. Please log in again.'); // You can customize this message or use a more styled popup
        navigate('/');
      }
    else if (
      error.response &&
      error.response.data &&
      error.response.data.message
    ) {
      setErrorMessage(error.response.data.message);
    } else {
      setErrorMessage(
        'An error occurred while submitting the form. Please try again later.'
      );
    }
  }
  };

  return (
    <div className="container">
      <h1>Doctor Registration Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            className="form-control"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {/* <div className="form-group">
          <label htmlFor="userFirstName">First Name:</label>
          <input
            type="text"
            id="userFirstName"
            className="form-control"
            value={userFirstName}
            onChange={(e) => setUserFirstName(e.target.value)}
            required
          />
        </div> */}
        {/* <div className="form-group">
          <label htmlFor="userLastName">Last Name:</label>
          <input
            type="text"
            id="userLastName"
            className="form-control"
            value={userLastName}
            onChange={(e) => setUserLastName(e.target.value)}
            
          />
        </div> */}
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {/* <div className="form-group">
          <label htmlFor="profilePhotoUrl">Profile Photo URL:</label>
          <input
            type="text"
            id="profilePhotoUrl"
            className="form-control"
            value={profilePhotoUrl}
            onChange={(e) => setProfilePhotoUrl(e.target.value)}
          />
        </div> */}
        <div className="form-group">
          <label htmlFor="contactNumber">Contact Number:</label>
          <input
            type="text"
            id="contactNumber"
            className="form-control"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="specialty">Specialty:</label>
          <input
            type="text"
            id="specialty"
            className="form-control"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="registrationNumber">Registration Number:</label>
          <input
            type="text"
            id="registrationNumber"
            className="form-control"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
      {/* Error message */}
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      
      {/* Popup */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Form submitted successfully!</h2>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddDoctorForm;
