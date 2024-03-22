import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import "./PatientDashboard.css";
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const PatientDashboard = ({ handleValueTileClick }) => {
    const [selectedTab, setSelectedTab] = useState(1);
    const [content, setContent] = useState(null);
    const [consultancyDetails, setConsultancyDetails] = useState(null);
    const [historyDetails, setHistoryDetails] = useState(null);
    const [newConsultancyUpdates, setNewConsultancyUpdates] = useState(false);
    const [newHistoryUpdates, setNewHistoryUpdates] = useState(false);
    const [activeButton, setActiveButton] = useState(null); // State to track active button

    const handleRequestClick = () => {
        setSelectedTab(1);
        setContent('Request content goes here...');
        setConsultancyDetails([
            {
                consultationNumber: "1234",
                doctorId: "DOC123",
                radiologistId: "RAD123",
                status: "Work in Progress",
                newUpdate: true
            },
            {
                consultationNumber: "5678",
                doctorId: "DOC456",
                radiologistId: "RAD456",
                status: "Scheduled",
            },
        ]);
        setHistoryDetails(null);
        setNewConsultancyUpdates(false);
        setActiveButton(1); // Set active button
    };

    const handleHistoryClick = () => {
        setSelectedTab(2);
        setContent('History content goes here...');
        setHistoryDetails([
            {
                consultationNumber: "1234",
                doctorId: "DOC123",
                radiologistId: "RAD123",
                status: "Completed",
                newUpdate: true
            },
            {
                consultationNumber: "5678",
                doctorId: "DOC456",
                radiologistId: "RAD456",
                status: "Completed",
            },
        ]);
        setConsultancyDetails(null);
        setNewHistoryUpdates(false);
        setActiveButton(2); // Set active button
    };

    const handleStartConsultationClick = () => {
        // Handle Start New Consultation button click
        setContent('form'); // Show the form
        setActiveButton(3); // Set active button
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Simulate form submission
        // Show success message
        setContent('Success');
    };

    const handleChange = (event) => {
        // Handle form input changes
        // Update form data state
    };

    const handleValueClick = (value) => {
        console.log(`Clicked value: ${value}`);
        handleValueTileClick();
    };

    return (
        <>
            <Navbar />
            <div className="container-fluid">
                <div className="doctor-dashboard-sidebar">
                    <ul className="dashboard-sidebar-list" style={{ listStyle: 'none' }}>
                        <li>
                            <button
                                onClick={handleRequestClick}
                                className={`tab-button ${selectedTab === 1 && activeButton === 1 ? "active" : ""}`}
                            >
                                <span>
                                    <EditCalendarIcon />
                                </span>
                                Request{" "}
                                {newConsultancyUpdates && (
                                    <span className="notification-badge"></span>
                                )}
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={handleHistoryClick}
                                className={`tab-button ${selectedTab === 2 && activeButton === 2 ? "active" : ""}`}
                            >
                                <span>
                                    <EditCalendarIcon />
                                </span>
                                History{" "}
                                {newHistoryUpdates && (
                                    <span className="notification-badge"></span>
                                )}
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={handleStartConsultationClick}
                                className={`tab-button ${content === 'form' && activeButton === 3 ? "active" : ""}`}
                            >
                                <span>
                                    <EditCalendarIcon />
                                </span>
                                Start New Consultation
                            </button>
                        </li>
                    </ul>
                </div>
                <div className="doctor-dashboard-content">
                    {/* Main content goes here */}
                    {content === 'Success' ? (
                        <div className="success-message">
                            <CheckCircleIcon style={{ color: 'green', fontSize: 48 }} />
                            <p>Success!</p>
                        </div>
                    ) : (
                        <>
                            {content === 'form' ? (
                                <div className="form-container">
                                    <h1>Fill in the details</h1>
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="doctorId">Doctor ID:</label>
                                            <input
                                                type="text"
                                                id="doctorId"
                                                name="doctorId"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="radiologistId">Radiologist ID:</label>
                                            <input
                                                type="text"
                                                id="radiologistId"
                                                name="radiologistId"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="labId">Lab ID:</label>
                                            <input
                                                type="text"
                                                id="labId"
                                                name="labId"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <button type="submit">Start</button>
                                    </form>
                                </div>
                            ) : (
                                <>
                                    {selectedTab === 1 && content && (
                                        <div>
                                            <h2>Request</h2>
                                            {consultancyDetails &&
                                                consultancyDetails.map((detail, index) => (
                                                    <div className="tile" key={index}>
                                                        <div className="consultancy-details">
                                                            <div className="attribute-tile">
                                                                <div className="attribute-name">
                                                                    Consultation Number:
                                                                </div>
                                                                <div className="attribute-name">
                                                                    Doctor ID:
                                                                </div>
                                                                <div className="attribute-name">Radiologist ID:</div>
                                                                <div className="attribute-name">Status:</div>
                                                            </div>
                                                            <button
                                                                className="value-tile"
                                                                onClick={() => handleValueClick()}
                                                            >
                                                                <div>{detail.consultationNumber}</div>
                                                                <div>{detail.doctorId}</div>
                                                                <div>{detail.radiologistId}</div>
                                                                <div>{detail.status}</div>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    )}
                                    {selectedTab === 2 && content && (
                                        <div>
                                            <h2>History</h2>
                                            {historyDetails &&
                                                historyDetails.map((detail, index) => (
                                                    <div className="tile" key={index}>
                                                        <div className="consultancy-details">
                                                            <div className="attribute-tile">
                                                                <div className="attribute-name">
                                                                    Consultation Number:
                                                                </div>
                                                                <div className="attribute-name">
                                                                    Doctor ID:
                                                                </div>
                                                                <div className="attribute-name">Radiologist ID:
                                                                </div>
<div className="attribute-name">Status:</div>
</div>
<button
className="value-tile"
onClick={() => handleValueClick()}
>
<div>{detail.consultationNumber}</div>
<div>{detail.doctorId}</div>
<div>{detail.radiologistId}</div>
<div>{detail.status}</div>
</button>
</div>
</div>
))}
</div>
)}
</>
)}
</>
)}
</div>
</div>
</>
);
}

export default PatientDashboard;