import React, { useState } from 'react';
import './Login.css';
import PatientIcon from "../images/patient.jpeg"
function PatientLogin({ setShowForgotPassword, setShowSignUp }) {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    role:'patient'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true); // Set showForgotPassword to true when the "Forgot Password" button is clicked
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // You can do further processing with the form data here

    
  };

  const handleSignUpClick = () => {
    setShowSignUp(true);
  };

  return (
    <div className="login-container">
      <div className='logo'>
      <img src={PatientIcon} alt='admin'/>
      </div>
      <h2> Patient Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userId">User ID:</label>
          <input type="text" id="userId" name="userId" value={formData.userId} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
        </div>
        <div className="button-group">
          <button type="submit">Login</button>
          <button className='signup' onClick={handleSignUpClick}>Sign Up</button>
        </div>
      </form>
      <button className="forgot-password-button" onClick={handleForgotPasswordClick}>Forgot Password?</button>
    </div>
  );
}

export default PatientLogin;
