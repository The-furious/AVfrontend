import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import PatientIcon from "../images/patient.jpeg"

function PatientLogin({ setShowForgotPassword, setShowSignUp,setIsSignupOpen }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    userType:'PATIENT'
  });
  const [isPatientLoggedIn, setIsPatientLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
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
      setIsPatientLoggedIn(true);
      sessionStorage.setItem('isPatientLoggedIn', 'true');
      sessionStorage.setItem('patientId', formData.username);
      navigate(`/patient-dashboard/${formData.username}`);
    } catch (error) {
      console.error(error);
      setErrorMessage('Invalid username or password');
    }
  };

  const handleSignUpClick = () => {
    setShowSignUp(true);
    setIsSignupOpen(true);
  };

  return (
    <div className="login-container">
      <div className='logo'>
        <img src={PatientIcon} alt='admin'/>
      </div>
      <h2> Patient Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">User ID:</label>
          <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} />
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
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
}

export default PatientLogin;
