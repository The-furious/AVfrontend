import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import "./PatientDashboard.css";
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = ({ handleValueTileClick }) => {
    const [selectedTab, setSelectedTab] = useState(1);
    const [content, setContent] = useState(null);
    const [consultancyDetails, setConsultancyDetails] = useState(null);
    const [historyDetails, setHistoryDetails] = useState(null);
    const [newConsultancyUpdates, setNewConsultancyUpdates] = useState(false);
    const [newHistoryUpdates, setNewHistoryUpdates] = useState(false);
    const [activeButton, setActiveButton] = useState(null); // State to track active button
    const [startConfirmation, setStartConfirmation] = useState(false);
    const [doctorId, setDoctorId] = useState('');
    const [radiologistId, setRadiologistId] = useState('');

    const isPatientLoggedIn = sessionStorage.getItem('isPatientLoggedIn') === 'true';
    const PatientId = sessionStorage.getItem('PatientId');
    const navigate = useNavigate();

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

    useEffect(() => {
        if (!isPatientLoggedIn) {
            navigate('/');
        }
    }, [isPatientLoggedIn, navigate]);

    const handleChange = (event) => {
        // Handle form input changes
        const { name, value } = event.target;
        if (name === 'doctorId') {
            setDoctorId(value);
        } else if (name === 'radiologistId') {
            setRadiologistId(value);
        }
    };

    const handleValueClick = (value) => {
        console.log(`Clicked value: ${value}`);
        handleValueTileClick();
    };

    return (
        <>
            <div className="container-fluid">
                <div className="patient-dashboard-sidebar">
                    <ul className="dashboard-sidebar-list" style={{ listStyle: 'none' }}>
                        <li>
                            <button
                                onClick={handleStartConsultationClick}
                                className={`tab-buttons ${content === 'form' && activeButton === 3 ? "active" : ""}`}
                            >
                                <span>
                                    <EditCalendarIcon />
                                </span>
                                Start New Consultant
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={handleRequestClick}
                                className={`tab-buttons ${selectedTab === 1 && activeButton === 1 ? "active" : ""}`}
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
                                className={`tab-buttons ${selectedTab === 2 && activeButton === 2 ? "active" : ""}`}
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
                    </ul>
                </div>
                <div className="patient-dashboard-content">
                    {/* Main content goes here */}
                    {content === 'Success' ? (
                        <div className="success-message-container">
                            <div className="success-message">
                                <CheckCircleIcon style={{ color: 'green', fontSize: 48 }} />
                                <p>Success!</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {content === 'form' ? (
                                <div className="form-container">
                                    <form onSubmit={handleSubmit}>
                                        <h2>Fill in the Details</h2>
                                        <div className="form-group" >
                                            <label htmlFor="doctorId">Doctor ID:</label>
                                            <input
                                                type="text"
                                                id="doctorId"
                                                name="doctorId"
                                                value={doctorId}
                                                onChange={handleChange}
                                                required // Adding required attribute for mandatory field
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="radiologistId">Radiologist ID (Optional):</label>
                                            <input
                                                type="text"
                                                id="radiologistId"
                                                name="radiologistId"
                                                value={radiologistId}
                                                onChange={handleChange}
                                                // You can omit 'required' attribute for optional fields
                                            />
                                        </div>
                                        <div className="form-group">
                                           <div className="form-group">
    <label style={{ display: 'flex', alignItems: 'center' }}>
        <input
            type="checkbox"
            id="startConfirmation"
            checked={startConfirmation}
            onChange={() => setStartConfirmation(!startConfirmation)}
        />
        <span style={{ marginLeft: '-50px' }}>
            Are you sure you want to start a consultation
        </span>
    </label>
</div>

                                        </div>
                                        <button type="submit">Submit</button>
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
