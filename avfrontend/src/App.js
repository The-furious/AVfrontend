import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './app.css';
import { Footer } from './components/Footer/Footer';
import Header from './components/Header/Header';
import { SignupHomepage } from './components/Signup/SignupHomepage';
import DoctorConsultancyView from './components/Doctor/DoctorConsultancyView';
import DoctorDashboard from './components/Doctor/DoctorDashboard'
import RadiologistDashboard from './components/Radiologist/RadiologistDashboard';
import RadiologistConsultancyView from './components/Radiologist/RadiologistConsultancyView';
import Navbar from './components/Navbar/Navbar';
import LabTechnicianDashboard  from './components/LabTechnician/LabTechnicianDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import PatientDashboard from './components/Patient/PatientDashboard'
import { UserDetailProvider } from './components/UserDetailContext';
import UserProfile from './components/Utility/UserProfile';
import PatientConsultancyView from './components/Patient/PatientConsultancyView';
import DicomViewer from './components/DicomViewer/DicomViewer';
import DwvComponent from './components/DicomViewer/DwvComponent';

function App() {
  
  return (
   
    <Router>
       <UserDetailProvider>

      <div className="App">
        <Navbar/>
        <Routes>
          <Route exact path="/" element={<SignupHomepage/>} />
          <Route path="/admin-dashboard/:adminName" element={<AdminDashboard />} />
          <Route path="/doctor-dashboard/:doctorName" element={<DoctorDashboard />} />
          <Route path="/doctor-consultancy-view/:doctorName" element={<DoctorConsultancyView/>} />
          <Route path="/radiologist-dashboard/:radiologistName" element={<RadiologistDashboard />} />
          <Route path="/radiologist-consultancy-view/:radiologistName" element={<RadiologistConsultancyView/>} />
          <Route path="/patient-dashboard/:patientName" element={<PatientDashboard />} />
          <Route path="/lab-dashboard/:labName" element={<LabTechnicianDashboard />} />
          <Route path="/admin-dashboard/:adminName" element={<AdminDashboard />} />
          <Route path="/patient-dashboard/:patientName" element={<PatientDashboard />} />
          <Route path="/patient-consultancy-view/:patientName" element={<PatientConsultancyView/>} />

          <Route path="" element={<UserProfile />} />
          <Route path="/dicom-viewer" element={<DicomViewer />} />
          <Route path="/dicom-viewer-component" element={<DwvComponent />} />
          


        </Routes>
         
      </div>
    
    </UserDetailProvider>
    </Router>

  );
}

export default App;
