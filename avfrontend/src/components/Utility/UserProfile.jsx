import React, { useEffect, useState, useContext } from 'react';
import patient from "../images/patient.jpeg";
import radiologist from "../images/radiologist.jpg";
import doctor from "../images/doctor.jpg";

import axios from "axios";
import { UserDetailContext } from "../UserDetailContext";

const UserProfile = ({ name, userType, RecipientId }) => {
    const [isOnline, setIsOnline] = useState(false);
    const { connectedUser } = useContext(UserDetailContext);
    let profileImage = ""; // Default profile image
  
    // Check if the RecipientId exists in the connectedUser array
    const isRecipientOnline = connectedUser ? connectedUser.includes(RecipientId) : false;
  
    // Update the online status based on whether the recipient is online
    useEffect(() => {
      setIsOnline(isRecipientOnline);
    }, [isRecipientOnline]);
  
    useEffect(() => {
      setIsOnline(connectedUser ? connectedUser.includes(RecipientId) : false);
    }, [connectedUser, RecipientId]);
  
    if (userType === "PATIENT") {
      profileImage = patient;
    } else if (userType === "RADIOLOGIST") {
      profileImage = radiologist;
    }
    else if (userType === "DOCTOR") {
        profileImage = doctor;
      }
  

  return (
    <div className="user-profile">
      <img src={profileImage} alt="Profile" className="profile-photo" />
      <div className="profile-name">{name}</div>
      <div className="status">
        {isOnline && <span className="online-status">(Online)</span>}
      </div>
    </div>
  );
};

export default UserProfile;
