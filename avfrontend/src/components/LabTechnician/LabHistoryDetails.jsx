import React from 'react';

const LabHistoryDetails = ({ historyDetails }) => {
  return (
    <div>
      <div className="consultancy-header">
        
      </div>
      {historyDetails &&
        historyDetails.map((detail, index) => (
          <div className="tile" key={index}>
            <div className="consultancy-details">
              <div className="attribute-tile">
                <div className="attribute-name">
                  Consultation Number:
                </div>
                <div className="attribute-name">
                  Patient Name:
                </div>
                <div className="attribute-name">Uploaded Date:</div>
                <div className="attribute-name">Status:</div>
              </div>
              <div className="value-tile">
                <div>{detail.consultationNumber}</div>
                <div>{detail.patientName}</div>
                <div>{detail.uploadedDate}</div>
                <div>{detail.status}</div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default LabHistoryDetails;
