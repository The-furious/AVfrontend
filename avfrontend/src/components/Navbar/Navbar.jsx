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
    sessionStorage.setItem('isDoctorLoggedIn', 'false');
    sessionStorage.setItem('isRadiologistLoggedIn', 'false');
    sessionStorage.removeItem('DoctorId');
    sessionStorage.removeItem('RadiologistId');
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

    if (!isDoctorLoggedIn && !isRadiologistLoggedIn) {
      setShowDropdown(false);
    }
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar__left">
        <img src={ArogyaVartaIcon} alt="Logo" className="navbar__logo" />
        <span className="navbar__title">Arogya Varta</span>
      </div>

      {sessionStorage.getItem('isDoctorLoggedIn') === 'true' ||
      sessionStorage.getItem('isRadiologistLoggedIn') === 'true' ? (
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
