import React, { useState } from 'react';
import './app.css';
import { Footer } from './components/Footer/Footer';
import Header from './components/Header/Header';
import { SignupHomepage } from './components/Signup/SignupHomepage';
import DoctorConsultancyView from './components/Doctor/DoctorConsultancyView';
import DoctorDashboard from './components/Doctor/DoctorDashboard';

function App() {
  const [showDoctorDashboard, setShowDoctorDashboard] = useState(false);
  const [showDoctorConsultancyView, setShowDoctorConsultancyView] = useState(false);

  const handleValueTileClick = () => {
    setShowDoctorDashboard(false);
    setShowDoctorConsultancyView(true);
  };

  return (
    <div className="App">
      <Header />
      {/* If neither dashboard nor consultancy view is shown, show the signup homepage */}
      {!showDoctorDashboard && !showDoctorConsultancyView && (
        <>
          <SignupHomepage setDoctorLoggedIn={() => setShowDoctorDashboard(true)} />
          <Footer />
        </>
      )}

      {/* Show DoctorDashboard when DoctorLoggedIn */}
      {showDoctorDashboard && (
        <DoctorDashboard handleValueTileClick={handleValueTileClick} />
      )}

      {/* Show DoctorConsultancyView when value tile button is clicked */}
      {showDoctorConsultancyView && <DoctorConsultancyView />}
    </div>
  );
}

export default App;
