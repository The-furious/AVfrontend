import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import './Login.css';
import DoctorIcon from "../images/doctor.jpg"

function DoctorLogin({ setShowForgotPassword }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    userType: 'DOCTOR',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8090/auth/login', formData); // Use Axios for POST request
      console.log(response);
      if (!response.data || !response.data.token) {
        throw new Error('Invalid username or password');
      }

      const { token } = response.data;
      sessionStorage.setItem('jwtToken', token);
      console.log('Login successful'); // For demo, log successful login
      sessionStorage.setItem('isDoctorLoggedIn', 'true');
      sessionStorage.setItem('DoctorId', formData.username);
      sessionStorage.setItem('userId',response.data.userId)
      navigate(`/doctor-dashboard/${formData.username}`); // Navigate to doctor dashboard
    } catch (error) {
      console.error(error);
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
        <img src={DoctorIcon} alt='admin'/>
      </div>
      <h2>Doctor Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">User ID:</label>
          <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
        </div>
        <button type="submit">Login</button>
        <button className="forgot-password-button" onClick={handleForgotPasswordClick}>Forgot Password?</button>
        {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Render error message */}

      </form>
    </div>
  );
}

export default DoctorLogin;
