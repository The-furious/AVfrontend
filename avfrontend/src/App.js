import React, { useState } from 'react';
import './app.css';
import { Footer } from './components/Footer/Footer';
import Header from './components/Header/Header';
import { SignupHomepage } from './components/Signup/SignupHomepage';
import DoctorConsultancyView from './components/Doctor/DoctorConsultancyView';
import DocorDashboard from './components/Doctor/DoctorDashboard'
import RadiologistDashboard from './components/Radiologist/RadiologistDashboard';
import RadiologistConsultancyView from './components/Radiologist/RadiologistConsultancyView';
import Navbar from './components/Navbar/Navbar';
import NavbarHome from './components/NavbarHome/NavbarHome';
// import DoctorDashboard from './components/Doctor/DoctorDashboard';
import PatientDashboard from './components/Patient/PatientDashboard';
function App() {
  const [showDoctorDashboard, setShowDoctorDashboard] = useState(false);
  const [showDoctorConsultancyView, setShowDoctorConsultancyView] = useState(false);
  const [showRadiologistDashboard, setShowRadiologistDashboard] = useState(false);
  const [showRadiologistConsultancyView, setShowRadiologistConsultancyView] = useState(false);

  const handleValueTileClick = () => {
    setShowDoctorDashboard(false);
    setShowDoctorConsultancyView(true);
  };

  const handleValueTileClickRadiologist = () => {
    setShowRadiologistDashboard(false);
    setShowRadiologistConsultancyView(true);
  };

  return (    
     <div className="App">
      <PatientDashboard/>   
    </div>

  );
}

export default App;
