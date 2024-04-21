import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LabHistoryDetails = ({ searchKeyword }) => {
  const [historyDetails, setHistoryDetails] = useState([]);
  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    const fetchHistoryDetails = async () => {
      try {
        const token = sessionStorage.getItem('jwtToken');
        const response = await axios.get(`http://localhost:8090/lab/history/${userId}`,{
          headers: {
            Authorization: `Bearer ${token}`, // Attach the JWT token to the Authorization header
          },
        });
        setHistoryDetails(response.data);
      } catch (error) {
        console.error('Error fetching history details:', error);
      }
    };

    fetchHistoryDetails();
  }, [userId]);

  // Filter historyDetails based on searchKeyword
  const filteredHistory = historyDetails.filter((detail) => {
    // Additional checks to avoid undefined properties
    const consultationNumber = detail.consultationId|| '';
    const patientName = detail.patientName || '';
    return (
      consultationNumber.toString().includes(searchKeyword) ||
      patientName.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  });

  return (
    <div>
      <div className="consultancy-header"></div>
      {searchKeyword.trim() === '' ? (
        // Render the entire historyDetails if searchKeyword is empty
        historyDetails.map((detail, index) => (
          <div className="tile" key={index}>
            <div className="consultancy-details">
              <div className="attribute-tile">
                <div className="attribute-name">Consultation Number:</div>
                <div className="attribute-name">Patient Name:</div>
                <div className="attribute-name">Uploaded Date:</div>
                <div className="attribute-name">Test Name:</div>
              </div>
              <div className="value-tile">
                <div>{detail.consultationId}</div>
                <div>{detail.patientName}</div>
                <div>{detail.testDate}</div>
                <div>{detail.testName}</div>
              </div>
            </div>
          </div>
        ))
      ) : (
        // Render filteredHistory if searchKeyword is not empty
        filteredHistory.map((detail, index) => (
          <div className="tile" key={index}>
            <div className="consultancy-details">
              <div className="attribute-tile">
                <div className="attribute-name">Consultation Number:</div>
                <div className="attribute-name">Patient Name:</div>
                <div className="attribute-name">Uploaded Date:</div>
                <div className="attribute-name">Test Name:</div>
              </div>
              <div className="value-tile">
                <div>{detail.consultationId}</div>
                <div>{detail.patientName}</div>
                <div>{detail.testDate}</div>
                <div>{detail.testName}</div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default LabHistoryDetails;
