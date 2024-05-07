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
import PatientDashboard from './components/Patient/PatientDashboard';
import ViewDoctors from './components/Admin/ViewDoctors/ViewDoctors';
import ViewRadiologists from './components/Admin/ViewRadiologists/ViewRadiologists';
import ViewLabs from './components/Admin/ViewLabs/ViewLabs';
import EditDoctorForm from './components/Admin/DoctorForm/EditDoctorForm';
import EditRadiologistForm from './components/Admin/RadiologistForm/EditRadiologistForm';
import EditLabForm from './components/Admin/LabForm/EditLabForm';
import DoctorProfile from './components/Profile/DoctorProfile/DoctorProfile';
import AdminProfile from './components/Profile/AdminProfile/AdminProfile';
import RadiologistProfile from './components/Profile/RadiologistProfile/RadiologistProfile';
import PatientProfile from './components/Profile/PatientProfile/PatientProfile';
import LabProfile from './components/Profile/LabProfile/LabProfile';  

function App() {
  
  return (
    <Router>
      <div className="App">
        <Navbar/>
        <Routes>
          <Route exact path="/" element={<SignupHomepage/>} />
          <Route path="/admin-dashboard/:adminName" element={<AdminDashboard />} />
         
         

        

          <Route path="/doctor-dashboard/:doctorName" element={<DoctorDashboard />} />
          <Route path="/doctor-consultancy-view/:doctorId" element={<DoctorConsultancyView/>} />
          <Route path="/radiologist-dashboard/:radiologistName" element={<RadiologistDashboard />} />
          <Route path="/radiologist-consultancy-view/:radiologistName" element={<RadiologistConsultancyView/>} />
          <Route path="/patient-dashboard/:patientName" element={<PatientDashboard />} />
          <Route path="/lab-dashboard/:labName" element={<LabTechnicianDashboard />} />
          <Route path="/admin-dashboard/:adminName" element={<AdminDashboard />} />
          <Route path="/patient-dashboard/:patientName" element={<PatientDashboard />} />
          <Route path="/profile/doctor" element={<DoctorProfile />} />
        <Route path="/profile/admin" element={<AdminProfile />} />
        <Route path="/profile/lab" element={<LabProfile />} />
        <Route path="/profile/patient" element={<PatientProfile />} />
        <Route path="/profile/radiologist" element={<RadiologistProfile />} />
        <Route path="/profile/patient" element={<PatientProfile />} />
        </Routes>
         
      </div>
    </Router>

  );
}

export default App;

