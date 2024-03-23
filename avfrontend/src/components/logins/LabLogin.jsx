import React, { useState } from 'react';
import './Login.css';

function LabLogin({ setShowForgotPassword }) {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    role:'lab_technician'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // You can do further processing with the form data here
  };
  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true); // Set showForgotPassword to true when the "Forgot Password" button is clicked
  };

  return (
    <div className="login-container">
      <h2>Lab Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userId">User ID:</label>
          <input type="text" id="userId" name="userId" value={formData.userId} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
        </div>
        <button type="submit">Login</button>
        <button type="button" className="forgot-password-button" onClick={handleForgotPasswordClick}>Forgot Password</button>

      </form>
    </div>
  );
}

export default LabLogin;
