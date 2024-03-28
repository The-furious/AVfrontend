import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
<<<<<<< Updated upstream
=======
import RadiologistIcon from '../images/radiologist.jpg';
import axios from 'axios'; // Import Axios
>>>>>>> Stashed changes

function RadiologistLogin({ setShowForgotPassword }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    userType: 'RADIOLOGIST'
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isRadiologistLoggedIn, setIsRadiologistLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
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
      const response = await axios.post('http://localhost:8090/auth/login', formData);
      
      if (!response.data || !response.data.token) {
        throw new Error('Invalid username or password');
      }

      const { token } = response.data;

      sessionStorage.setItem('jwtToken', token);
      setIsRadiologistLoggedIn(true);
      sessionStorage.setItem('isRadiologistLoggedIn', 'true');
      sessionStorage.setItem('radiologistId', formData.username);
      navigate(`/radiologist-dashboard/${formData.username}`);
    } catch (error) {
      console.error(error);
      setErrorMessage('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
<<<<<<< Updated upstream
=======
      <div className='logo'>
        <img src={RadiologistIcon} alt='admin' />
      </div>
>>>>>>> Stashed changes
      <h2>Radiologist Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">User ID:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Login</button>
        <button
          type="button"
          className="forgot-password-button"
          onClick={handleForgotPasswordClick}
        >
          Forgot Password
        </button>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>
    </div>
  );
}

export default RadiologistLogin;
