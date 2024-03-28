import React, { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import './navbar.css';
import ArogyaVartaIcon from '../images/ArogyaVartaIcon.jpeg';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ personName }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogoutClick = () => {
    sessionStorage.removeItem('isDoctorLoggedIn', 'false');
    sessionStorage.removeItem('isRadiologistLoggedIn', 'false');
    sessionStorage.removeItem('isLabLoggedIn', 'false');
    sessionStorage.removeItem('isPatientLoggedIn', 'false');
    sessionStorage.removeItem('isAdminLoggedIn', 'false');
    
    sessionStorage.removeItem('DoctorId');
    sessionStorage.removeItem('RadiologistId');
    sessionStorage.removeItem('PatientId');
    sessionStorage.removeItem('AdminId');
    sessionStorage.removeItem('LabId');

    sessionStorage.removeItem('jwtToken');
    setShowDropdown(false); // Close the dropdown on logout
    navigate('/');
  };

  const handleProfileClick = () => {
    setShowDropdown(false); // Close the dropdown when "Your Profile" is clicked
    // Add your logic for handling the "Your Profile" action
  };

  useEffect(() => {
    const isDoctorLoggedIn = sessionStorage.getItem('isDoctorLoggedIn') === 'true';
    const isRadiologistLoggedIn = sessionStorage.getItem('isRadiologistLoggedIn') === 'true';
    const isPatientLoggedIn = sessionStorage.getItem('isPatientLoggedIn') === 'true';
    const isLabLoggedIn = sessionStorage.getItem('isLabLoggedIn') === 'true';
    const isAdminLoggedIn = sessionStorage.getItem('isRadiologistLoggedIn') === 'true';

    if (!isDoctorLoggedIn && !isRadiologistLoggedIn && !isPatientLoggedIn && !isLabLoggedIn  && !isAdminLoggedIn) {
      setShowDropdown(false);
    }
  }, []);

  const flag = sessionStorage.getItem('isDoctorLoggedIn') === 'true' ||
  sessionStorage.getItem('isRadiologistLoggedIn') === 'true'||sessionStorage.getItem('isPatientLoggedIn') === 'true' ||
  sessionStorage.getItem('isLabLoggedIn') === 'true'|| sessionStorage.getItem('isAdminLoggedIn') === 'true';

  return (
    <nav className="navbar">
      <div className="navbar__left">
        <img src={ArogyaVartaIcon} alt="Logo" className="navbar__logo" />
        <span className="navbar__title">Arogya Varta</span>
      </div>

      { flag ? (
      {sessionStorage.getItem('isDoctorLoggedIn') === 'true' ||
      sessionStorage.getItem('isRadiologistLoggedIn') === 'true'
      || sessionStorage.getItem('isLabLoggedIn') === 'true'? (
        <div className="navbar__right">
          <div className="navbar__user" onClick={toggleDropdown}>
            <span className="navbar__username">{personName}</span>
            <FaUser className="navbar__user-icon" />
          </div>
          {showDropdown && (
            <div className="navbar__dropdown">
              <ul>
                <li onClick={handleProfileClick}>Your Profile</li>
                <li onClick={handleLogoutClick}>Logout</li>
              </ul>
            </div>
          )}
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
