import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HoverPatientDetails.css"; // Import CSS for styling
import patient from "../images/patient.jpeg";



const HoverPatientDetails = ({ patientId }) => {
  const [patientDetails, setPatientDetails] = useState(null);
  console.log(patientId);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8090/patient/${patientId}`);
        setPatientDetails(response.data);
        console.log(patientDetails);
      } catch (error) {
        console.error("Error fetching patient details:", error);
        // Handle error, maybe show a message to the user
      }
    };

    if (patientId) {
      fetchPatientDetails();
    }
  }, [patientId]);

  if (!patientDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="patient-profile">
      <img src={patientDetails.profilePhotoUrl || patient} alt="Profile" className="profile-pic" />
      <div className="profile-name">Name: {patientDetails.name.toUpperCase()}</div>

      <div className="details">
        <div className="profile-info">
          <div className="info-item">Age: {calculateAge(patientDetails.dateOfBirth)}</div>
          <div className="info-item">Sex: {patientDetails.sex}</div>

          <div className="info-item">Blood Group: {patientDetails.bloodGroup}</div>
          <div className="info-item">Height: {patientDetails.height}</div>
          <div className="info-item">Weight: {patientDetails.weight}</div>
          <div className="info-item">Contact: {patientDetails.contactNumber}</div>
          <div className="info-item">Emergency: {patientDetails.emergencyContact}</div>
        </div>
      </div>
    </div>
  );
};

const calculateAge = (dateOfBirth) => {
  const birthDate = new Date(dateOfBirth);
  const currentDate = new Date();
  const age = currentDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = currentDate.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
    return age - 1;
  }
  return age;
};

export default HoverPatientDetails;
