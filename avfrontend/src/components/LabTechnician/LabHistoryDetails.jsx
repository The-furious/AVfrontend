import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LabHistoryDetails = ({ labId }) => {
  const [historyDetails, setHistoryDetails] = useState([]);

  useEffect(() => {
    const fetchHistoryDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8090/lab/history/${labId}`);
        setHistoryDetails(response.data);
      } catch (error) {
        console.error('Error fetching history details:', error);
      }
    };

    fetchHistoryDetails();
  }, [labId]);

  return (
    <div>
      <div className="consultancy-header"></div>
      {historyDetails.map((detail, index) => (
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
      ))}
    </div>
  );
};

export default LabHistoryDetails;
