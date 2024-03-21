import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';

import './navbarHome.css';
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
  
 
</nav>

  );
};

export default Navbar;
