import React, { useState,useEffect,useRef } from 'react';
import Navbar from '../Navbar/Navbar';
import "./DoctorDashboard.css";
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import { useNavigate } from 'react-router-dom';
import useMousePosition from '../useMousePosition';


const DoctorDashboard= ({handleValueTileClick}) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const [content, setContent] = useState(null);
    const [consultancyDetails, setConsultancyDetails] = useState(null);
    const [historyDetails, setHistoryDetails] = useState(null);
    
    const [newConsultancyUpdates, setNewConsultancyUpdates] = useState(false);
    const [newHistoryUpdates, setNewHistoryUpdates] = useState(false);
    const isDoctorLoggedIn = sessionStorage.getItem('isDoctorLoggedIn') === 'true';
    const DoctorId=sessionStorage.getItem('DoctorId'); 
    const navigate = useNavigate(); 

    const [hoveredTileDetails, setHoveredTileDetails] = useState(null);
    const [showPatientDetails, setShowPatientDetails] = useState(false);

    const [searchInput, setSearchInput] = useState('');
const [filteredConsultancyDetails, setFilteredConsultancyDetails] = useState(null);
const [filteredHistoryDetails, setFilteredHistoryDetails] = useState(null); // Add state for filtered history details


   
    const timerRef = useRef(null);
    const mousePosition = useMousePosition();
    

    const handleHoverTile = (details) => {
        setHoveredTileDetails(details);
        timerRef.current = setTimeout(() => setShowPatientDetails(true), 1000); // Set delay for 1 second
    };

    const handleMouseLeave = () => {
        clearTimeout(timerRef.current);
        setShowPatientDetails(false);
    };

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
        setFilteredConsultancyDetails(consultancyDetails);
        
       
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
        
        setFilteredHistoryDetails(historyDetails); // Initialize filtered history details

        setConsultancyDetails(null); // Clear consultancy details when switching tabs
        setNewHistoryUpdates(false); // Reset notification badge
      };
    
      const handleValueClick = (value,patientName) => {
        // Handle the click event for the value tile
        console.log(`Clicked value: ${value}`);
        clearTimeout(timerRef.current); // Clear timeout on click
        setShowPatientDetails(false);
        
        navigate(`/doctor-consultancy-view/${DoctorId}`); 

        // Add further handling logic as needed
      };

      useEffect(() => {
        return () => {
            clearTimeout(timerRef.current); // Clear timeout on component unmount
        };
    }, []);


    const handleSearchInputChangeConsultancy = (e) => {
      const inputValue = e.target.value;
      setSearchInput(inputValue);
    
      // Update filtered consultancy details based on search input
      if (inputValue.trim() !== '') {
        const filteredDetails = consultancyDetails.filter(
          (detail) =>
            detail.consultationNumber.includes(inputValue) ||
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
            detail.consultationNumber.includes(inputValue) ||
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
      const filteredConsultancy = consultancyDetails.filter(
          (detail) =>
              detail.consultationNumber.includes(searchInput) ||
              detail.patientName.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredConsultancyDetails(filteredConsultancy);

      // Perform search based on searchInput for history details
      const filteredHistory = historyDetails.filter(
          (detail) =>
              detail.consultationNumber.includes(searchInput) ||
              detail.patientName.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredHistoryDetails(filteredHistory);
  };

  useEffect(() => {
    // Set filteredConsultancyDetails to all consultancy details when the component first renders
    setFilteredConsultancyDetails(consultancyDetails);
}, [consultancyDetails]);

useEffect(() => {
  // Set filteredConsultancyDetails to all consultancy details when the component first renders
  setFilteredHistoryDetails(historyDetails);
}, [historyDetails]);
    

     
      
    useEffect(() => {
        if (!isDoctorLoggedIn) {
            navigate('/');
        }
    }, [isDoctorLoggedIn, navigate]);
    
      return (
        <>
         
         <div className="container-fluid" >
            <div className="doctor-dashboard-sidebar">
            <ul className="dashboard-sidebar-list" style={{ listStyle: 'none'}}>
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
            <div className="doctor-dashboard-content">
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
                                                onClick={() => handleValueClick(detail.consultationNumber, detail.patientName)}
                                                onMouseEnter={() => handleHoverTile(detail)}
                                                onMouseLeave={handleMouseLeave}
                                            >
                                                {/* Values */}
                                                <div>{detail.consultationNumber}</div>
                                                <div>{detail.patientName}</div>
                                                <div>{detail.startDate}</div>
                                                <div>{detail.status}</div>
                                            </button>
                                            {showPatientDetails && hoveredTileDetails === detail && (
                                                <div className="patient-details-box" style={{ left: mousePosition.x, top: mousePosition.y }}>
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
                     <h2>Consultancy</h2>
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
                              <div>{detail.consultationNumber}</div>
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

export default DoctorDashboard;
