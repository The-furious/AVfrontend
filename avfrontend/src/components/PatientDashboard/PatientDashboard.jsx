import React, { useState, useEffect } from 'react';
import './PatientDashboard.css'; // Import your CSS file for styling

const PatientDashboard = ({ handleValueTileClick }) => {
  const [selectedTab, setSelectedTab] = useState(1);
  const [consultancyDetails, setConsultancyDetails] = useState(null);
  const [historyDetails, setHistoryDetails] = useState(null);
  const [showNewConsultationForm, setShowNewConsultationForm] = useState(false); // State to manage visibility of New Consultation form

  useEffect(() => {
    // Call handleRequestClick when component mounts to show Request section initially
    handleRequestClick();
  }, []);

  const handleRequestClick = () => {
    setSelectedTab(1);
    setShowNewConsultationForm(false); // Hide the form
    // Simulated Request Details
    setConsultancyDetails([
      {
        consultationNumber: "1234",
        doctorID: "Doc001",
        radiologistID: "Rad001",
        status: "Pending",
        newUpdate: true // Indicate new update
      },
      {
        consultationNumber: "5678",
        doctorID: "Doc002",
        radiologistID: "Rad002",
        status: "Approved",
      },
    ]);
    setHistoryDetails(null); // Clear history details when switching tabs
  };

  const handleHistoryClick = () => {
    setSelectedTab(2);
    setShowNewConsultationForm(false); // Hide the form
    // Simulated History Details
    setHistoryDetails([
      {
        consultationNumber: "1234",
        doctorID: "Doc003",
        radiologistID: "Rad003",
        status: "Completed",
        newUpdate: true // Indicate new update
      },
      {
        consultationNumber: "5678",
        doctorID: "Doc004",
        radiologistID: "Rad004",
        status: "Completed",
      },
      {
        consultationNumber: "91011",
        doctorID: "Doc005",
        radiologistID: "Rad005",
        status: "Completed",
      },
      {
        consultationNumber: "121314",
        doctorID: "Doc006",
        radiologistID: "Rad006",
        status: "Completed",
      },
    ]);
    setConsultancyDetails(null); // Clear consultancy details when switching tabs
  };

  const handleStartNewConsultationClick = () => {
    setShowNewConsultationForm(true);
  };

  const handleCloseForm = () => {
    setShowNewConsultationForm(false);
  };

  const handleValueClick = (value) => {
    // Handle the click event for the value tile
    console.log(`Clicked value: ${value}`);
    handleValueTileClick();
    // Add further handling logic as needed
  };

  return (
    <div className="dashboard-main">
      <header>
        <h1>Arogya Vartha</h1>
        <div className="header-buttons">
          <button>Your Profile</button>
          <button>Logout</button>
        </div>
      </header>
      <div className="dashboard-sidebar">
        {/* Sidebar content goes here */}
        <div className="tab-buttons">
          <button onClick={handleStartNewConsultationClick} className={`tab-button`}>
            Start New Consultation
          </button>
          <button onClick={handleRequestClick} className={`tab-button ${selectedTab === 1 ? 'active' : ''}`}>
            Request
          </button>
          <button onClick={handleHistoryClick} className={`tab-button ${selectedTab === 2 ? 'active' : ''}`}>
            History
          </button>
        </div>
      </div>
      <div className="dashboard-content">
        {/* Render Consultancy or History based on selectedTab */}
        {selectedTab === 1 && !showNewConsultationForm && (
          <div>
            <h2>Request</h2>
            {/* Render Consultancy Details */}
            {consultancyDetails && consultancyDetails.map((detail, index) => (
              <div className="tile" key={index}>
                <div className="consultancy-details">
                  <div className="attribute-tile">
                    {/* Attribute names */}
                    <div className="attribute-name">Consultation Number:</div>
                    <div className="attribute-name">Doctor ID:</div>
                    <div className="attribute-name">Radiologist ID:</div>
                    <div className="attribute-name">Status:</div>
                  </div>
                  <div className="value-tile">
                    {/* Values */}
                    <div>{detail.consultationNumber}</div>
                    <div>{detail.doctorID}</div>
                    <div>{detail.radiologistID}</div>
                    <div>{detail.status}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {selectedTab === 2 && !showNewConsultationForm && (
          <div>
            <h2>History</h2>
            {/* Render History Details */}
            {historyDetails && historyDetails.map((detail, index) => (
              <div className="tile" key={index}>
                <div className="consultancy-details">
                  <div className="attribute-tile">
                    {/* Attribute names */}
                    <div className="attribute-name">Consultation Number:</div>
                    <div className="attribute-name">Doctor ID:</div>
                    <div className="attribute-name">Radiologist ID:</div>
                    <div className="attribute-name">Status:</div>
                  </div>
                  <div className="value-tile">
                    {/* Values */}
                    <div>{detail.consultationNumber}</div>
                    <div>{detail.doctorID}</div>
                    <div>{detail.radiologistID}</div>
                    <div>{detail.status}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Render the New Consultation form if showNewConsultationForm is true */}
        {showNewConsultationForm && (
          <Form onClose={handleCloseForm} />
        )}
      </div>
    </div>
  );
};

// Form component
const Form = ({ onClose }) => {
  const [formData, setFormData] = useState({
    doctorId: "",
    radiologistId: "",
    labId: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", formData); // Log form data
    // Close the form after submitting
    onClose();
  };

  return (
    <div className="form-container">
      <h1>Fill in the details</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="doctorId">Doctor ID:</label>
          <input
            type="text"
            id="doctorId"
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="radiologistId">Radiologist ID:</label>
          <input
            type="text"
            id="radiologistId"
            name="radiologistId"
            value={formData.radiologistId}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="labId">Lab ID:</label>
          <input
            type="text"
            id="labId"
            name="labId"
            value={formData.labId}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Start</button>
      </form>
    </div>
  );
};

export default PatientDashboard;
