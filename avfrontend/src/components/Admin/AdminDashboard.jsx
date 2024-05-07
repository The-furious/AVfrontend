import React, { useState, useEffect } from 'react';
import AddDoctorForm from './DoctorForm/AddDoctorForm';
import ViewDoctors from './ViewDoctors/ViewDoctors';
import AddRadiologistForm from './RadiologistForm/AddRadiologistForm';
import './AdminDashboard.css'; // Import CSS file for Admin component styling
import { useNavigate } from 'react-router-dom';
import AddLabForm from './LabForm/AddLabForm';
import ViewRadiologists from './ViewRadiologists/ViewRadiologists';
import ViewLabs from './ViewLabs/ViewLabs';

const AdminDashboard = () => {
  const [redirectToAdmin, setRedirectToAdmin] = useState(false);
  const isAdminLoggedIn = sessionStorage.getItem('isAdminLoggedIn') === 'true';
  const AdminId = sessionStorage.getItem('AdminId');
  const navigate = useNavigate();

  const [clickedButton, setClickedButton] = useState('');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate('/');
    }
  }, [isAdminLoggedIn, navigate]);

  const handleButtonClick = (buttonName) => {
    setClickedButton(buttonName);
  };

  const handleDoctorFormSubmit = () => {
    // Handle form submission logic here
    // Redirect to /admin after successful submission
    setRedirectToAdmin(true);
  };

  // Switch function to render different forms based on clickedButton value
  const renderForm = () => {
    switch (clickedButton) {
      case 'AddDoctor':
        return <AddDoctorForm onSubmit={handleDoctorFormSubmit} />;
      case 'AddRadiologist':
        return <AddRadiologistForm />;
      case 'AddLab':
        return <AddLabForm />;
      case 'view-doctors':
        return <ViewDoctors />;
      case 'view-radiologists':
        return <ViewRadiologists />;
      case 'view-labs':
        return <ViewLabs/>;
      default:
        return null; // Render nothing if no button is clicked
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <div className="admin-sidebar-buttons">
          <button
            className={`admin-button ${clickedButton === 'AddDoctor' ? 'active' : ''}`}
            onClick={() => handleButtonClick('AddDoctor')}
          >
            Add Doctor
          </button>
          <button
            className={`admin-button ${clickedButton === 'AddRadiologist' ? 'active' : ''}`}
            onClick={() => handleButtonClick('AddRadiologist')}
          >
            Add Radiologist
          </button>
          <button
            className={`admin-button ${clickedButton === 'AddLab' ? 'active' : ''}`}
            onClick={() => handleButtonClick('AddLab')}
          >
            Add Lab
          </button>

          <button
            className={`admin-button ${clickedButton === 'view-doctors' ? 'active' : ''}`}
            onClick={() => handleButtonClick('view-doctors')}
          >
            View All Doctors
          </button>
         
         
          <button
            className={`admin-button ${clickedButton === 'view-radiologists' ? 'active' : ''}`}
            onClick={() => handleButtonClick('view-radiologists')}
          >
            View All Radiologists
          </button>
          <button
            className={`admin-button ${clickedButton === 'view-labs' ? 'active' : ''}`}
            onClick={() => handleButtonClick('view-labs')}
          >
            View All Labs
          </button>

          {/* Add more buttons if needed */}
          
          
          
        </div>
       
      </div>

      <div className="admin-main-content">
        {renderForm()}
      </div>
    </div>
  );
};

export default AdminDashboard;
