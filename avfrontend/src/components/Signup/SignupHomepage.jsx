import React from 'react';
import { useState } from 'react';
import AdminLogin from '../logins/AdminLogin';
import DoctorLogin from '../logins/DoctorLogin';
import PatientLogin from '../logins/PatientLogin';
import PatientSignUp from './PatientSignUp';
import RadiologistLogin from '../logins/RadiologistLogin';
import LabLogin from '../logins/LabLogin';
export const SignupHomepage = () => {
    const [selectedTab, setSelectedTab] = useState(1);
  const [showSignUp, setShowSignUp] = useState(false);

  const changeTab = (tabNumber) => {
    setSelectedTab(tabNumber);
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
          {selectedTab === 1 && <AdminLogin/>}
          {selectedTab === 2 && <DoctorLogin/>}
          {selectedTab === 3 && !showSignUp && <PatientLogin setShowSignUp={setShowSignUp} />}
          {selectedTab === 3 && showSignUp && <PatientSignUp setShowSignUp={setShowSignUp} />}
          {selectedTab === 4 && <RadiologistLogin/>} 
          {selectedTab === 5 && <LabLogin/>} 
        </div>
      </div>
  )
}
