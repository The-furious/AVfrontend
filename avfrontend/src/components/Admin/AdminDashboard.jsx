import React, { useState } from 'react';
import AddDoctorForm from './DoctorForm/AddDoctorForm';
import AddRadiologistForm from './RadiologistForm/AddRadiologistForm';
import './AdminDashboard.css'; // Import CSS file for Admin component styling

const AdminDashboard = () => {
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [showRadiologistForm, setShowRadiologistForm] = useState(false);
  const [redirectToAdmin, setRedirectToAdmin] = useState(false);

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

  // Redirect to /admin if redirectToAdmin is true
  if (redirectToAdmin) {
    window.location.href = '/admin';
    // Alternatively, you can use history.push('/admin') if you have access to history object
    return null; // Render nothing because we are redirecting
  }

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>
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
