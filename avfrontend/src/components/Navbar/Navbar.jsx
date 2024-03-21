import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import './navbar.css';
import ArogyaVartaIcon from '../images/ArogyaVartaIcon.jpeg';

const Navbar = ({personName}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    console.log("clicked")
    setShowDropdown(!showDropdown);
  };

  const handleLogout = (e) => {
    
    console.log('Logout clicked');
  };

  return (
    <nav className="navbar">
  <div className="navbar__left">
    <img src={ArogyaVartaIcon} alt="Logo" className="navbar__logo" />
    <span className="navbar__title">Arogya Varta</span>
  </div>
  
  <div className="navbar__right">
    <div className="navbar__user" onClick={toggleDropdown}>
      <span className="navbar__username">{personName}</span>
      <FaUser className="navbar__user-icon" />
    </div>
    {showDropdown && (
      <div className="navbar__dropdown">
        <ul>
          <li>Your Profile</li>
          <li>Logout</li>
        </ul>
      </div>
    )}
    {/* Logout button */}
    <button className="navbar__logout-button" onClick={handleLogout}>Logout</button>
  </div>
</nav>

  );
};

export default Navbar;
