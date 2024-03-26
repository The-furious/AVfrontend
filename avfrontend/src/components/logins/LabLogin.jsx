import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import LabIcon from "../images/lab.jpg"

function LabLogin({ setShowForgotPassword }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role:'lab_technician'
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLabLoggedIn, setIsLabLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8090/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      console.log(response);
      if (!response.ok) {
        throw new Error('Invalid username or password');
      }

      const data = await response.json();
      const { token } = data;
      sessionStorage.setItem('jwtToken', token);
      console.log('Login successful'); // For demo, log successful login
      setIsLabLoggedIn(true); // Set isLoggedIn to true when login is successful
      sessionStorage.setItem('isLabLoggedIn', 'true'); 
      sessionStorage.setItem('LabId', formData.userId); 
      navigate(`/lab-dashboard/${formData.username}`);// Set doctorLoggedIn to true when login is successful
    } catch{
      console.log('Invalid username or password'); // For demo, log invalid login attempt
      setErrorMessage('Invalid username or password'); // Set error message
    }
  };
  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true); // Set showForgotPassword to true when the "Forgot Password" button is clicked
  };

  return (
    <div className="login-container">
      <div className='logo'>
      <img src={LabIcon} alt='admin'/>
      </div>
      <h2>Lab Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">User ID:</label>
          <input type="text" id="username" name="username" value={formData.userId} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Render error message */}
        <button type="submit">Login</button>
        <button className="forgot-password-button" onClick={handleForgotPasswordClick}>Forgot Password?</button>
      </form>
    </div>
  );
}

export default LabLogin;
