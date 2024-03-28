import React, { useState } from 'react';
<<<<<<< Updated upstream
=======
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios
>>>>>>> Stashed changes
import './Login.css';

function LabLogin({ setShowForgotPassword }) {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    userType: 'LAB'
  });
<<<<<<< Updated upstream
=======
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
>>>>>>> Stashed changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

<<<<<<< Updated upstream
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // You can do further processing with the form data here
=======
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
      sessionStorage.setItem('isLabLoggedIn', 'true');
      sessionStorage.setItem('LabId', formData.username);
      navigate(`/lab-dashboard/${formData.username}`); // Navigate to lab dashboard
    } catch (error) {
      console.error(error);
      console.log('Invalid username or password'); // For demo, log invalid login attempt
      setErrorMessage('Invalid username or password'); // Set error message
    }
>>>>>>> Stashed changes
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true); // Set showForgotPassword to true when the "Forgot Password" button is clicked
  };

  return (
    <div className="login-container">
<<<<<<< Updated upstream
      <h2>Lab Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userId">User ID:</label>
          <input type="text" id="userId" name="userId" value={formData.userId} onChange={handleChange} />
=======
      <div className='logo'>
        <img src={LabIcon} alt='admin'/>
      </div>
      <h2>Lab Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">User ID:</label>
          <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} />
>>>>>>> Stashed changes
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
        </div>
        <button type="submit">Login</button>
<<<<<<< Updated upstream
        <button type="button" className="forgot-password-button" onClick={handleForgotPasswordClick}>Forgot Password</button>
=======
        <button className="forgot-password-button" onClick={handleForgotPasswordClick}>Forgot Password?</button>
        {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Render error message */}
>>>>>>> Stashed changes

      </form>
    </div>
  );
}

export default LabLogin;
