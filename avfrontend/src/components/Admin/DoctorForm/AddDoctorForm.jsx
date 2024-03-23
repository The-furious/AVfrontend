import React, { useState } from 'react';
import './AddDoctorForm.css'; // Import CSS file

function AddDoctorForm() {
  // State variables for form fields and popup visibility
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can perform any action with the form data, such as sending it to a server
    console.log('Form submitted:', { userName, password, userFirstName, userLastName });
    // Show the popup
    setShowPopup(true);
  };

  return (
    <div className="container">
      <h1>Doctor Registration Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userName">Username:</label>
          <input
            type="text"
            id="userName"
            className="form-control"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
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
          />
        </div>
        <div className="form-group">
          <label htmlFor="userFirstName">First Name:</label>
          <input
            type="text"
            id="userFirstName"
            className="form-control"
            value={userFirstName}
            onChange={(e) => setUserFirstName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="userLastName">Last Name:</label>
          <input
            type="text"
            id="userLastName"
            className="form-control"
            value={userLastName}
            onChange={(e) => setUserLastName(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
      
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
