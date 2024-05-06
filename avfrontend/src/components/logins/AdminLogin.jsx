import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import AdminIcon from "../images/admin.jpeg";
import axios from "axios"; // Import Axios

function AdminLogin({ setShowForgotPassword }) {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isAdminLoggedIn, setAdminLoggedIn] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    userType: "ADMIN",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://localhost:8090/auth/login",
        formData
      );

      console.log(response);

      if (!response.data || !response.data.token) {
        throw new Error("Invalid username or password");
      }

      const { token } = response.data;
      sessionStorage.setItem("userId", response.data.userId);

      sessionStorage.setItem("jwtToken", token);

      sessionStorage.setItem("isAdminLoggedIn", "true");
      sessionStorage.setItem("adminId", formData.username);
      setAdminLoggedIn(true);
      console.log("Login successful");

      sessionStorage.setItem("adminname", formData.username);

      // Navigate to the admin dashboard or any other desired route
      navigate(`/admin-dashboard/${formData.username}`);
    } catch (error) {
      console.error(error);

      setErrorMessage("Invalid username or password");
    }
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
  };

  return (
    <div className="login-container">
      <div className="logo">
        <img src={AdminIcon} alt="admin" />
      </div>
      <h2>Admin Login</h2>
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
          className="forgot-password-button"
          onClick={handleForgotPasswordClick}
        >
          Forgot Password?
        </button>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>
    </div>
  );
}

export default AdminLogin;
