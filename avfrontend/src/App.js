import React, { useState } from 'react';
import './app.css';
import { Footer } from './components/Footer/Footer';
import Header from './components/Header/Header';
import {SignupHomepage} from './components/Signup/SignupHomepage'; // Changed import statement
import DoctorConsultancyView from './components/DoctorsConsultancyView/DoctorConsultancyView'; // Changed import statement

function App() {
  const [doctorLoggedIn, setDoctorLoggedIn] = useState(false);

  return (
    <div className="App">
      {doctorLoggedIn ? (
        <DoctorConsultancyView />
      ) : (
        <>
          <Header />
          <SignupHomepage setDoctorLoggedIn={setDoctorLoggedIn} />
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
