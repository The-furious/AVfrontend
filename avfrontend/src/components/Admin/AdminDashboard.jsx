import React, { useState, useEffect } from 'react';
import AddDoctorForm from './DoctorForm/AddDoctorForm';
import AddRadiologistForm from './RadiologistForm/AddRadiologistForm';
import './AdminDashboard.css'; // Import CSS file for Admin component styling
import { useNavigate } from 'react-router-dom';
import  AddLabForm from './LabForm/AddLabForm'

const AdminDashboard = () => {
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [showLabForm, setShowLabForm] = useState(false);
  const [showRadiologistForm, setShowRadiologistForm] = useState(false);
  const [redirectToAdmin, setRedirectToAdmin] = useState(false);
  const [activeButton, setActiveButton] = useState(''); // State to track active button
  const isAdminLoggedIn = sessionStorage.getItem('isAdminLoggedIn') === 'true';
  const AdminId = sessionStorage.getItem('AdminId');
  const navigate = useNavigate();

  const handleLABButtonClick = () => {
    setShowLabForm(true);
    setShowDoctorForm(false);
    setShowRadiologistForm(false);
    setActiveButton('lab'); // Set active button to 'doctor'
  };
  const handleDoctorButtonClick = () => {
    setShowDoctorForm(true);
    setShowRadiologistForm(false);
    setShowLabForm(false);
    setActiveButton('doctor'); // Set active button to 'doctor'
  };

  const handleRadiologistButtonClick = () => {
    setShowDoctorForm(false);
    setShowRadiologistForm(true);
    setShowLabForm(false);
    setActiveButton('radiologist'); // Set active button to 'radiologist'
  };

  const handleDoctorFormSubmit = () => {
    // Handle form submission logic here
    // Redirect to /admin after successful submission
    setRedirectToAdmin(true);
  };

  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate('/');
    }
  }, [isAdminLoggedIn, navigate]);

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <div className="admin-sidebar-buttons">
          <button
            className={`admin-button ${activeButton === 'doctor' ? 'active' : ''}`}
            onClick={handleDoctorButtonClick}
          >
            Add Doctor
          </button>
          <button
            className={`admin-button ${activeButton === 'radiologist' ? 'active' : ''}`}
            onClick={handleRadiologistButtonClick}
          >
            Add Radiologist
          </button>
          <button
            className={`admin-button ${activeButton === 'lab' ? 'active' : ''}`}
            onClick={handleLABButtonClick}
          >
            Add LAB
          </button>
        </div>
      </div>

      <div className="admin-main-content">
        {showDoctorForm && <AddDoctorForm onSubmit={handleDoctorFormSubmit} />}
        {showRadiologistForm && <AddRadiologistForm />}
        {showLabForm && <AddLabForm />}
      </div>
    </div>
  );
};

export default AdminDashboard;
