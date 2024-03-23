import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

function RadiologistLogin({ setShowForgotPassword }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role : 'radiologist'
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
      const { token } = data; // Assuming the token is provided in the response data

      sessionStorage.setItem('jwtToken', token);
      setIsRadiologistLoggedIn(true);
      sessionStorage.setItem('isRadiologistLoggedIn', 'true');
      sessionStorage.setItem('radiologistId', formData.userId);
      navigate(`/radiologist-dashboard/${formData.userId}`);
    } catch (error) {
      console.error(error);
      setErrorMessage('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
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
