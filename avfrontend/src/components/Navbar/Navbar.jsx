import React, { useState, useEffect,useRef } from 'react';
import { FaUser } from 'react-icons/fa';
import './navbar.css';
import ArogyaVartaIcon from '../images/ArogyaVartaIcon.jpeg';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ personName }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogoutClick = () => {
    sessionStorage.clear(); // Clear all sessionStorage items
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
    const isAdminLoggedIn = sessionStorage.getItem('isAdminLoggedIn') === 'true';

    if (!isDoctorLoggedIn && !isRadiologistLoggedIn && !isPatientLoggedIn && !isLabLoggedIn && !isAdminLoggedIn) {
      setShowDropdown(false);
    }
  }, []);
 
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const flag =
    sessionStorage.getItem('isDoctorLoggedIn') === 'true' ||
    sessionStorage.getItem('isRadiologistLoggedIn') === 'true' ||
    sessionStorage.getItem('isPatientLoggedIn') === 'true' ||
    sessionStorage.getItem('isLabLoggedIn') === 'true' ||
    sessionStorage.getItem('isAdminLoggedIn') === 'true';

  return (
    <nav className="navbar">
      <div className="navbar__left">
        <img src={ArogyaVartaIcon} alt="Logo" className="navbar__logo" />
        <span className="navbar__title">Arogya Varta</span>
      </div>

      {flag &&
         (
          <div className="navbar__right">
            <div className="navbar__user" onClick={toggleDropdown} ref={dropdownRef}>
              <span className="navbar__username">{personName}</span>
              <FaUser className="navbar__user-icon" />
            </div>
            {showDropdown && (
              <div className="navbar__dropdown" ref={dropdownRef}>
                <ul>
                  <li onClick={handleProfileClick}>Your Profile</li>
                  <li onClick={handleLogoutClick}>Logout</li>
                </ul>
              </div>
            )}
          </div>
        )}
    </nav>
  );
};

export default Navbar;
