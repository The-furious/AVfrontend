import React, { useState } from 'react';
import './Login.css';

function DoctorLogin({ setShowForgotPassword, setDoctorLoggedIn }) {
  const [formData, setFormData] = useState({
    userId: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For demo purposes, check if the username and password match hardcoded values
    if (formData.userId === 'demoUser' && formData.password === 'demoPassword') {
      console.log('Login successful'); // For demo, log successful login
      setDoctorLoggedIn(true); // Set doctorLoggedIn to true when login is successful
    } else {
      console.log('Invalid username or password'); // For demo, log invalid login attempt
      setErrorMessage('Invalid username or password'); // Set error message
    }
  };
  
  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true); // Set showForgotPassword to true when the "Forgot Password" button is clicked
  };

  return (
    <div className="login-container">
      <h2>Doctor Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userId">User ID:</label>
          <input type="text" id="userId" name="userId" value={formData.userId} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Render error message */}
        <button type="submit">Login</button>
        <button type="button" className="forgot-password-button" onClick={handleForgotPasswordClick}>Forgot Password</button>
      </form>
    </div>
  );
}

export default DoctorLogin;
