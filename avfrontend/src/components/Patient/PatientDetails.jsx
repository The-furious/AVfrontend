import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PatientDetails.css'
import PatientImage from'../images/patient.jpeg'


const PatientDetails = ({ id }) => {
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const styles = {
    patientDetailsBox: {
      display: 'flex',
      margin: '10px',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
    },
    profileImage: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      marginRight: '20px',
    },
    detailsContainer: {
      flex: 1,
    },
    name: {
      marginBottom: '5px',
    },
    info: {
      margin: '5px 0',
    },
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8090/patient/${id}`);
        setPatientData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!patientData) return null; // Handle case where patient data is not available

  return (
    <div style={styles.patientDetailsBox}>
      <div>
        <img src={patientData.profilePhotoUrl} alt="Profile" style={styles.profileImage} />
      </div>
      <div style={styles.detailsContainer}>
        <h3 style={styles.name}>{patientData.name}</h3>
        <p style={styles.info}>Weight: {patientData.weight}</p>
        <p style={styles.info}>Height: {patientData.height}</p>
        <p style={styles.info}>Blood Group: {patientData.bloodGroup}</p>
        <p style={styles.info}>Age: {calculateAge(patientData.dateOfBirth)}</p>
      </div>
    </div>
  );
};

const calculateAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export default PatientDetails;
