import React, { useState,useEffect } from 'react';
import AddDoctorForm from './DoctorForm/AddDoctorForm';
import AddRadiologistForm from './RadiologistForm/AddRadiologistForm';
import './AdminDashboard.css'; // Import CSS file for Admin component styling
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [showRadiologistForm, setShowRadiologistForm] = useState(false);
  const [redirectToAdmin, setRedirectToAdmin] = useState(false);
  const isAdminLoggedIn = sessionStorage.getItem('isAdminLoggedIn') === 'true';
    const AdminId=sessionStorage.getItem('AdminId'); 
    const navigate = useNavigate(); 

  const handleDoctorButtonClick = () => {
    setShowDoctorForm(true);
    setShowRadiologistForm(false);
  };

  const handleRadiologistButtonClick = () => {
    setShowDoctorForm(false);
    setShowRadiologistForm(true);
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
          <button className="admin-button admin-sidebar-button" onClick={handleDoctorButtonClick}>Add Doctor</button>
          <button className="admin-button admin-sidebar-button" onClick={handleRadiologistButtonClick}>Add Radiologist</button>
        </div>
      </div>

      <div className="admin-main-content">
        {showDoctorForm && <AddDoctorForm onSubmit={handleDoctorFormSubmit} />}
        {showRadiologistForm && <AddRadiologistForm />}
      </div>
    </div>
  );
};

export default AdminDashboard;
