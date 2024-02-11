import React, { useState } from 'react';
import AdminLogin from '../logins/AdminLogin';
import DoctorLogin from '../logins/DoctorLogin';
import PatientLogin from '../logins/PatientLogin';
import PatientSignUp from './PatientSignUp';
import RadiologistLogin from '../logins/RadiologistLogin';
import LabLogin from '../logins/LabLogin';
import ForgotPassword from '../logins/ForgotPassword/ForgotPassword';
import "./SignUpHomePage.css"

export const SignupHomepage = () => {
  const [selectedTab, setSelectedTab] = useState(1);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const [resetForUser, setResetForUser] = useState(null); // Track which user type initiated the password reset

  const changeTab = (tabNumber) => {
    setSelectedTab(tabNumber);
    setShowForgotPassword(false); // Reset showForgotPassword when changing tabs
    setPasswordResetSuccess(false); // Reset password reset success state when changing tabs
  };

  // Function to handle password reset success
  const handlePasswordResetSuccess = (userType) => {
    setPasswordResetSuccess(true);
    setShowForgotPassword(false); // Reset showForgotPassword when password reset is successful
    setResetForUser(userType); // Set which user type initiated the password reset
  };

  // Function to render login component based on user type after password reset
  const renderLoginComponent = () => {
    switch (resetForUser) {
      case 'admin':
        return <AdminLogin setShowForgotPassword={setShowForgotPassword} />;
      case 'doctor':
        return <DoctorLogin setShowForgotPassword={setShowForgotPassword} />;
      case 'patient':
        return <PatientLogin setShowForgotPassword={setShowForgotPassword} setShowSignUp={setShowSignUp} />;
      case 'radiologist':
        return <RadiologistLogin setShowForgotPassword={setShowForgotPassword} />;
      case 'lab':
        return <LabLogin setShowForgotPassword={setShowForgotPassword} />;
      default:
        return null;
    }
  };

  return (
    <div className="main">
      <div className="sidebar">
        {/* Sidebar content goes here */}
        <div className="tab-buttons">
          <button onClick={() => changeTab(1)} className={selectedTab === 1 ? 'active' : ''}>Admin</button>
          <button onClick={() => changeTab(2)} className={selectedTab === 2 ? 'active' : ''}>Doctor</button>
          <button onClick={() => changeTab(3)} className={selectedTab === 3 ? 'active' : ''}>Patient</button>
          <button onClick={() => changeTab(4)} className={selectedTab === 4 ? 'active' : ''}>Radiologist</button>
          <button onClick={() => changeTab(5)} className={selectedTab === 5 ? 'active' : ''}>LAB</button>
        </div>
      </div>
      <div className="content">
        {/* Main content goes here */}
        {passwordResetSuccess ? (
          // Render the respective login component after password reset
          <div>
            <h2>Password Reset Successful!</h2>
            {renderLoginComponent()}
          </div>
        ) : (
          <div>
            {selectedTab === 1 && !showForgotPassword && <AdminLogin setShowForgotPassword={setShowForgotPassword} />}
            {selectedTab === 1 && showForgotPassword && <ForgotPassword onPasswordReset={() => handlePasswordResetSuccess('admin')} />}
            {selectedTab === 2 && !showForgotPassword && <DoctorLogin setShowForgotPassword={setShowForgotPassword} />}
            {selectedTab === 2 && showForgotPassword && <ForgotPassword onPasswordReset={() => handlePasswordResetSuccess('doctor')} />}
            {selectedTab === 3 && !showForgotPassword && !showSignUp && <PatientLogin setShowForgotPassword={setShowForgotPassword} setShowSignUp={setShowSignUp} />}
            {selectedTab === 3 && showSignUp && <PatientSignUp setShowSignUp={setShowSignUp} />}
            {selectedTab === 3 && showForgotPassword && <ForgotPassword onPasswordReset={() => handlePasswordResetSuccess('patient')} />}
            {selectedTab === 4 && !showForgotPassword && <RadiologistLogin setShowForgotPassword={setShowForgotPassword} />}
            {selectedTab === 4 && showForgotPassword && <ForgotPassword onPasswordReset={() => handlePasswordResetSuccess('radiologist')} />}
            {selectedTab === 5 && !showForgotPassword && <LabLogin setShowForgotPassword={setShowForgotPassword} />}
            {selectedTab === 5 && showForgotPassword && <ForgotPassword onPasswordReset={() => handlePasswordResetSuccess('lab')} />}
          </div>
        )}
      </div>
    </div>
  );
};
