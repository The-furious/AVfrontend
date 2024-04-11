import React, { useState,useEffect,useRef } from 'react';
import Navbar from '../Navbar/Navbar';
import "./RadiologistDashboard.css";
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import { useNavigate } from 'react-router-dom';
import useMousePosition from "../Utility/useMousePosition"

import axios from 'axios'; // Import Axios

const RadiologistDashboard= () => {
    const [selectedTab, setSelectedTab] = useState(1);
    const [content, setContent] = useState(null);
    const [consultancyDetails, setConsultancyDetails] = useState(null);
    const [historyDetails, setHistoryDetails] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage user's authentication status
    const [newConsultancyUpdates, setNewConsultancyUpdates] = useState(false);
    const [newHistoryUpdates, setNewHistoryUpdates] = useState(false);
    const [hoveredTileDetails, setHoveredTileDetails] = useState(null);
    const [showPatientDetails, setShowPatientDetails] = useState(false);
    const timerRef = useRef(null);
    const mousePosition = useMousePosition();

    const [searchInput, setSearchInput] = useState('');
    const [filteredConsultancyDetails, setFilteredConsultancyDetails] = useState(null);
    const [filteredHistoryDetails, setFilteredHistoryDetails] = useState(null);

    const handleHoverTile = (details) => {
      setHoveredTileDetails(details);
      timerRef.current = setTimeout(() => setShowPatientDetails(true), 1000); // Set delay for 1 second
  };

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
    setShowPatientDetails(false);
};




  useEffect(() => {
    return () => {
        clearTimeout(timerRef.current); // Clear timeout on component unmount
    };
}, []);


    const isRadiologistLoggedIn = sessionStorage.getItem('isRadiologistLoggedIn') === 'true';
    const RadiologistId=sessionStorage.getItem('radiologistId'); 
    const userId=sessionStorage.getItem('userId')
    const navigate = useNavigate(); 

    const handleConsultancyClick = async () => {
      setSelectedTab(1);
      setContent('Consultancy content goes here...');
      // Fetch consultancy details from the backend
      try {
        // Fetch data using Axios
        const token = sessionStorage.getItem('jwtToken');
        const response = await axios.get(`http://localhost:8090/consultation/get/present/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the JWT token to the Authorization header
          },
        });
        
        // Extract relevant data from the response and update state
        const consultancyDetails = response.data.map((consultancy) => ({
          consultationId: consultancy.consultationId,
          patientName: consultancy.patient.name,
          startDate: consultancy.startDate,
          status: "Work in Progress",
        }));
          setConsultancyDetails(consultancyDetails);
          setFilteredConsultancyDetails(consultancyDetails);
      }catch (error) {
        console.error('Error fetching consultancy details:', error);
        // Handle error (e.g., display an error message to the user)
        if (error.response && error.response.status === 403) {
          // JWT token expired, clear session storage and navigate to home page
          sessionStorage.clear();
         
          // Show error alert popup
          alert('Session expired. Please log in again.'); // You can customize this message or use a more styled popup
          navigate('/');
        }
      }
    };
    
    const handleHistoryClick = async () => {
      setSelectedTab(2);
      setContent('History content goes here...');
      // Fetch history details from the backend
      try {
        const token = sessionStorage.getItem('jwtToken');
        const response = await axios.get(`http://localhost:8090/consultation/get/history/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the JWT token to the Authorization header
          },
        });
        const updatedHistoryDetails = response.data.map(detail => ({
          consultationId: detail.consultationId,
          patientName: detail.patientName,
          startDate: detail.startDate,
          status: detail.status, // Assuming status is provided in the response
        }));
        setHistoryDetails(updatedHistoryDetails);
        setFilteredHistoryDetails(updatedHistoryDetails);
      } catch (error) {
        console.error('Error fetching history details:', error);
        // Handle error (e.g., display an error message to the user)
        if (error.response && error.response.status === 403) {
          // JWT token expired, clear session storage and navigate to home page
          sessionStorage.clear();
         
          // Show error alert popup
          alert('Session expired. Please log in again.'); // You can customize this message or use a more styled popup
          navigate('/');
        }
      }
    };
    
    
    
    
      const handleValueClick = (value) => {
        // Handle the click event for the value tile
        console.log(`Clicked value: ${value}`);
        sessionStorage.setItem('selectedConsultationId', value);

        clearTimeout(timerRef.current); // Clear timeout on click
        setShowPatientDetails(false);
      

        navigate(`/radiologist-consultancy-view/${RadiologistId}`);
        // Add further handling logic as needed
      };
      const handleSearchInputChangeConsultancy = (e) => {
        const inputValue = e.target.value;
        setSearchInput(inputValue);
      
        // Update filtered consultancy details based on search input
        if (inputValue.trim() !== '') {
          const filteredDetails = consultancyDetails.filter(
            (detail) =>
              detail.consultationId.toString().includes(inputValue) ||
              detail.patientName.toLowerCase().includes(inputValue.toLowerCase())
          );
          setFilteredConsultancyDetails(filteredDetails);
          
        } else {
          // If search input is empty, render all consultancy details
          setFilteredConsultancyDetails(consultancyDetails);
        }
      };

      const handleSearchInputChangeHistory = (e) => {
        const inputValue = e.target.value;
        setSearchInput(inputValue);
      
        // Update filtered consultancy details based on search input
        if (inputValue.trim() !== '') {
          const filteredDetails = historyDetails.filter(
            (detail) =>
              detail.consultationId.toString().includes(inputValue) ||
              detail.patientName.toLowerCase().includes(inputValue.toLowerCase())
          );
          setFilteredHistoryDetails(filteredDetails);
          
        } else {
          // If search input is empty, render all consultancy details
          setFilteredHistoryDetails(historyDetails);
        }
      };

      const handleSearch = () => {
        // Perform search based on searchInput for consultancy details
        if (selectedTab === 1) {
          const filteredConsultancy = consultancyDetails.filter(
            (detail) =>
              detail.consultationId.toString().includes(searchInput) ||
              detail.patientName.toLowerCase().includes(searchInput.toLowerCase())
          );
          setFilteredConsultancyDetails(filteredConsultancy);
        }
      
        // Perform search based on searchInput for history details
        if (selectedTab === 2) {
          const filteredHistory = historyDetails.filter(
            (detail) =>
              detail.consultationId.toString().includes(searchInput) ||
              detail.patientName.toLowerCase().includes(searchInput.toLowerCase())
          );
          setFilteredHistoryDetails(filteredHistory);
        }
      };


      useEffect(() => {
        if (!isRadiologistLoggedIn) {
            navigate('/');
        }
    }, [isRadiologistLoggedIn, navigate]);

    
  
  useEffect(() => {
    if (selectedTab === 1) {
        handleConsultancyClick(); // Render consultancy content when tab 1 is selected
    } else if (selectedTab === 2) {
        handleHistoryClick(); // Render history content when tab 2 is selected
    }
  }, [selectedTab]);
    
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
                     <div className="consultancy-header">
                     <h2>Consultancy</h2>
                     <div className="search-bar">
                       <input
                         type="text"
                         placeholder="Search"
                         value={searchInput}
                         onChange={handleSearchInputChangeConsultancy}
                       />
                       <button className="search-button" onClick={() => handleSearch()}>
                         Search
                       </button>
                     </div>
                   </div>
                    {filteredConsultancyDetails &&
                      filteredConsultancyDetails.map((detail, index) => (
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
                              onClick={() => handleValueClick(detail.consultationId)}
                              onMouseEnter={() => handleHoverTile(detail)}
                              onMouseLeave={handleMouseLeave}
                            >
                              {/* Values */}
                              <div>{detail.consultationId}</div>
                              <div>{detail.patientName}</div>
                              <div>{detail.startDate}</div>
                              <div>{detail.status}</div>
                            </button>
                            {showPatientDetails && hoveredTileDetails === detail && (
                                                <div className="patient-details-box"  style={{ left: mousePosition.x, top: mousePosition.y }}>
                                                    <div>Name: {detail.patientName}</div>
                                                    {/* Add more patient details here */}
                                                </div>
                                            )}
                          </div>
                          
                        </div>
                      ))}
                  </div>
                )}
                {selectedTab === 2 && content && (
                  <div>
                     <div className="consultancy-header">
                     <h2>History</h2>
                     <div className="search-bar">
                       <input
                         type="text"
                         placeholder="Search"
                         value={searchInput}
                         onChange={handleSearchInputChangeHistory}
                       />
                       <button className="search-button" onClick={() => handleSearch()}>
                         Search
                       </button>
                     </div>
                   </div>
                    {filteredHistoryDetails &&
                      filteredHistoryDetails.map((detail, index) => (
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
                              onMouseEnter={() => handleHoverTile(detail)}
                              onMouseLeave={handleMouseLeave}
                            >
                              {/* Values */}
                              <div>{detail.consultationId}</div>
                              <div>{detail.patientName}</div>
                              <div>{detail.startDate}</div>
                              <div>{detail.status}</div>
                            </button>
                            {showPatientDetails && hoveredTileDetails === detail && (
                                                <div className="patient-details-box"  style={{ left: mousePosition.x, top: mousePosition.y }}>
                                                    <div>Name: {detail.patientName}</div>
                                                    {/* Add more patient details here */}
                                                </div>
                                            )}
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
