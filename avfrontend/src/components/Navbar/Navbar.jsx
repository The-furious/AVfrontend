import React, {useContext, useState, useEffect, useRef } from 'react';
import { FaUser } from 'react-icons/fa';
import { IoMenu } from 'react-icons/io5';
import './navbar.css';
import ArogyaVartaIcon from '../images/ArogyaVartaIcon.jpeg';
import { useNavigate } from 'react-router-dom';
import AdminLogin from '../logins/AdminLogin';
import PatientLogin from '../logins/PatientLogin';
import { UserDetailContext } from '../UserDetailContext';
import SockJS from "sockjs-client";
import StompJs from "stompjs";


const Navbar = ({ personName }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const { token, isLoggedIn, setToken, setUserId, setIsLoggedIn,connectedUser, setConnectedUser,stompClient, setStompClient  } =
    useContext(UserDetailContext);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [socketUrl, setSocketUrl] = useState("http://localhost:8090/ws"); // Change this to your WebSocket server URL

  const userId=sessionStorage.getItem('userId');
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogoutClick = () => {
    if (stompClient) {
      const user = { userId: userId, status: 'OFFLINE' };
      stompClient.send("/app/topic/disconnectUser", {}, JSON.stringify(user));
      stompClient.disconnect();
      console.log("Offline WebSocket disconnected");
    }
   sessionStorage.clear();


    setShowDropdown(false); // Close the dropdown on logout
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleProfileClick = (option) => {
    setSelectedOption(option);
    setShowDropdown(false); // Close the dropdown when an option is clicked
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



  const fflag=sessionStorage.getItem('isPatientLoggedIn') === 'true';
  

  const flag =
    sessionStorage.getItem('isDoctorLoggedIn') === 'true' ||
    sessionStorage.getItem('isRadiologistLoggedIn') === 'true' ||
    sessionStorage.getItem('isLabLoggedIn') === 'true' ||
    sessionStorage.getItem('isPatientLoggedIn') === 'true'||
    sessionStorage.getItem('isAdminLoggedIn') === 'true';

  return (
    <nav className="navbar">
      <div className="navbar__left">
        <img src={ArogyaVartaIcon} alt="Logo" className="navbar__logo" />
        <span className="navbar__title">Arogya Varta</span>
      </div>



      


{fflag &&(
        <div className="navbar__right insidenavbar">
         <div className="navbar__user" onClick={toggleDropdown} ref={dropdownRef}>
            <span className="navbar__username">{personName}</span>
            <IoMenu className="navbar__user-icon" />
          </div>
          {showDropdown && (
            <div className="navbar__dropdown" ref={dropdownRef}>
              <ul>
                <li onClick={() => handleProfileClick('Start New Consutation')}>Start New Consultaion</li>
                <li onClick={() => handleProfileClick('Request')}>Request</li>
                <li onClick={() => handleProfileClick('History')}>History</li>
                <li onClick={() => handleProfileClick('Your Profile')}>Your Profile</li>
                <li onClick={handleLogoutClick}>Logout</li>
              </ul>
            </div>
          )}
        </div>
      )}



      {flag && (
        <div className="navbar__right outsidenavbar">
          <div className="navbar__user" onClick={toggleDropdown} ref={dropdownRef}>
            <span className="navbar__username">{personName}</span>
            <FaUser className="navbar__user-icon" />
          </div>
          {showDropdown && (
            <div className="navbar__dropdown" ref={dropdownRef}>
              <ul>
                <li onClick={() => handleProfileClick('Your Profile')}>Your Profile</li>
                <li onClick={handleLogoutClick}>Logout</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {!flag && !fflag && (
        <div className="navbar__right iconphone">
          <div className="navbar__user" onClick={toggleDropdown} ref={dropdownRef}>
            <span className="navbar__username">{personName}</span>
            <IoMenu className="navbar__user-icon" />
          </div>
          {showDropdown && (
            <div className="navbar__dropdown" ref={dropdownRef}>
              <ul>
                <li onClick={() => handleProfileClick('Admin')}>Admin</li>
                <li onClick={() => handleProfileClick('Patient')}>Patient</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Render login forms based on the selected option */}
      {/* {selectedOption === 'Admin' && <AdminLogin />}
      {selectedOption === 'Patient' && <PatientLogin />} */}
    </nav>
  );

  
};

export default Navbar;
