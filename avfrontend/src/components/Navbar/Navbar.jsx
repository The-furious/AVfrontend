import React, { useState, useEffect, useRef } from 'react';
import { FaUser } from 'react-icons/fa';
import './navbar.css';
import ArogyaVartaIcon from '../images/ArogyaVartaIcon.jpeg';
import { useNavigate } from 'react-router-dom';
import DoctorProfile from '../Profile/DoctorProfile/DoctorProfile';
import AdminProfile from '../Profile/AdminProfile/AdminProfile';
import LabProfile from '../Profile/LabProfile/LabProfile';
import PatientProfile from '../Profile/PatientProfile/PatientProfile';
import RadiologistProfile from '../Profile/RadiologistProfile/RadiologistProfile';

const Navbar = ({ personName }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userType, setUserType] = useState('');
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const isDoctorLoggedIn = sessionStorage.getItem('isDoctorLoggedIn');
  const isRadiologistLoggedIn = sessionStorage.getItem('isRadiologistLoggedIn');
  const isPatientLoggedIn = sessionStorage.getItem('isPatientLoggedIn');
  const isLabLoggedIn = sessionStorage.getItem('isLabLoggedIn');
  const isAdminLoggedIn = sessionStorage.getItem('isAdminLoggedIn');

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogoutClick = () => {
    sessionStorage.clear(); // Clear all sessionStorage items
    setShowDropdown(false);
    setShowProfile(false);
    navigate('/');
  };

  const handleProfileClick = () => {
    setShowDropdown(false);
    setShowProfile(true);
    navigate(`profile/${userType}`);
  };

  useEffect(() => {
    if (!isDoctorLoggedIn && !isRadiologistLoggedIn && !isPatientLoggedIn && !isLabLoggedIn && !isAdminLoggedIn) {
      setShowDropdown(false);
    }

    if (isDoctorLoggedIn) {
      setUserType('doctor');
      setUserId(sessionStorage.getItem('DoctorUserId'));
    } else if (isRadiologistLoggedIn) {
      setUserType('radiologist');
      setUserId(sessionStorage.getItem('RadiologistUserId'));
    } else if (isPatientLoggedIn) {
      setUserType('patient');
      setUserId(sessionStorage.getItem('PatientUserId'));
    } else if (isLabLoggedIn) {
      setUserType('lab');
      setUserId(sessionStorage.getItem('LabUserId'));
    } else if (isAdminLoggedIn) {
      setUserType('admin');
      setUserId(sessionStorage.getItem('AdminUserId'));
    }
  }, [isDoctorLoggedIn, isRadiologistLoggedIn, isPatientLoggedIn, isLabLoggedIn, isAdminLoggedIn]);

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

  return (
    <>
    <nav className="navbar">
      <div className="navbar__left">
        <img src={ArogyaVartaIcon} alt="Logo" className="navbar__logo" />
        <span className="navbar__title">Arogya Varta</span>
      </div>

      {userType && (
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
    
    </>
  );
};

export default Navbar;
