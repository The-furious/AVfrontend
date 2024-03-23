import React, { useState,useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import "./RadiologistDashboard.css";
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import { useNavigate } from 'react-router-dom';

const RadiologistDashboard= () => {
    const [selectedTab, setSelectedTab] = useState(1);
    const [content, setContent] = useState(null);
    const [consultancyDetails, setConsultancyDetails] = useState(null);
    const [historyDetails, setHistoryDetails] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage user's authentication status
    const [newConsultancyUpdates, setNewConsultancyUpdates] = useState(false);
    const [newHistoryUpdates, setNewHistoryUpdates] = useState(false);

    const isRadiologistLoggedIn = sessionStorage.getItem('isRadiologistLoggedIn') === 'true';
    const RadiologistId=sessionStorage.getItem('RadiologistId'); 
    const navigate = useNavigate(); 

    const handleConsultancyClick = () => {
        setSelectedTab(1);
        setContent('Consultancy content goes here...');
        // Simulated Consultancy Details
        setConsultancyDetails([
          {
            consultationNumber: "1234",
            patientName: "John Doe",
            startDate: "2024-02-14",
            status: "Work in Progress",
            newUpdate: true // Indicate new update
          },
          {
            consultationNumber: "5678",
            patientName: "Jane Smith",
            startDate: "2024-02-15",
            status: "Scheduled",
          },
          {
            consultationNumber: "91011",
            patientName: "Alice Johnson",
            startDate: "2024-02-16",
            status: "Completed",
          },
          {
            consultationNumber: "121314",
            patientName: "Bob Williams",
            startDate: "2024-02-17",
            status: "Cancelled",
          },
          {
            consultationNumber: "121314",
            patientName: "Bob Williams",
            startDate: "2024-02-17",
            status: "Cancelled",
          },
          {
            consultationNumber: "121314",
            patientName: "Bob Williams",
            startDate: "2024-02-17",
            status: "Cancelled",
          },
        ]);
        setHistoryDetails(null); // Clear history details when switching tabs
        setNewConsultancyUpdates(false); // Reset notification badge
      };
    
      const handleHistoryClick = () => {
        setSelectedTab(2);
        setContent('History content goes here...');
        // Simulated History Details
        setHistoryDetails([
          {
            consultationNumber: "1234",
            patientName: "John Doe",
            startDate: "2024-02-14",
            status: "Completed",
            newUpdate: true // Indicate new update
          },
          {
            consultationNumber: "5678",
            patientName: "Jane Smith",
            startDate: "2024-02-15",
            status: "Completed",
          },
          {
            consultationNumber: "91011",
            patientName: "Alice Johnson",
            startDate: "2024-02-16",
            status: "Completed",
          },
          {
            consultationNumber: "121314",
            patientName: "Bob Williams",
            startDate: "2024-02-17",
            status: "Completed",
          },
        ]);
        setConsultancyDetails(null); // Clear consultancy details when switching tabs
        setNewHistoryUpdates(false); // Reset notification badge
      };
    
      const handleValueClick = (value) => {
        // Handle the click event for the value tile
        console.log(`Clicked value: ${value}`);
      

        navigate(`/radiologist-consultancy-view/${RadiologistId}`);
        // Add further handling logic as needed
      };

      useEffect(() => {
        if (!isRadiologistLoggedIn) {
            navigate('/');
        }
    }, [isRadiologistLoggedIn, navigate]);
    
      return (
        <>
         
         <div className="container-fluid">
            <div className="radiologist-dashboard-sidebar">
            <ul className="dashboard-sidebar-list">
                  <li>
                    <button
                      onClick={handleConsultancyClick}
                      className={`tab-button ${
                        selectedTab === 1 ? "active" : ""
                      }`}
                    >
                      <span>
                        <EditCalendarIcon />
                      </span>
                      Consultancy{" "}
                      {newConsultancyUpdates && (
                        <span className="notification-badge"></span>
                      )}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleHistoryClick}
                      className={`tab-button ${
                        selectedTab === 2 ? "active" : ""
                      }`}
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
            <div className="radiologist-dashboard-content">
             {/* Main content goes here */}

            
             {selectedTab === 1 && content && (
                  <div>
                    <h2>Consultancy</h2>
                    {consultancyDetails &&
                      consultancyDetails.map((detail, index) => (
                        <div className="tile" key={index}>
                          <div className="consultancy-details">
                            <div className="attribute-tile">
                              {/* Attribute names */}
                              <div className="attribute-name">
                                Consultation Number:
                              </div>
                              <div className="attribute-name">
                                Patient Name:
                              </div>
                              <div className="attribute-name">Start Date:</div>
                              <div className="attribute-name">Status:</div>
                            </div>
                            <button
                              className="value-tile"
                              onClick={() => handleValueClick()}
                            >
                              {/* Values */}
                              <div>{detail.consultationNumber}</div>
                              <div>{detail.patientName}</div>
                              <div>{detail.startDate}</div>
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
                              {/* Attribute names */}
                              <div className="attribute-name">
                                Consultation Number:
                              </div>
                              <div className="attribute-name">
                                Patient Name:
                              </div>
                              <div className="attribute-name">Start Date:</div>
                              <div className="attribute-name">Status:</div>
                            </div>
                            <button
                              className="value-tile"
                              onClick={() => handleValueClick()}
                            >
                              {/* Values */}
                              <div>{detail.consultationNumber}</div>
                              <div>{detail.patientName}</div>
                              <div>{detail.startDate}</div>
                              <div>{detail.status}</div>
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
             </div>
        </div>    
        </>
      );
}

export default RadiologistDashboard;
