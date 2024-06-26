import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "./LabTechnician.css";
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import LabHistoryDetails from './LabHistoryDetails';
import ImageUploadForm from './ImageUploadForm';

const LabTechnicianDashboard = () => {
  const [selectedTab, setSelectedTab] = useState(1);
  const [historyDetails, setHistoryDetails] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const userId=sessionStorage.getItem('userId')

  // Simulated History Details
  const simulatedHistoryDetails = [
    {
      consultationNumber: "1234",
      patientName: "John Doe",
      uploadedDate: "2024-02-14",
      status: "Completed",
    },
    {
      consultationNumber: "5678",
      patientName: "Jane Smith",
      uploadedDate: "2024-02-15",
      status: "Completed",
    },
    // Add more history details as needed
  ];

  const handleHistoryClick = () => {
    setSelectedTab(2);
    setHistoryDetails(simulatedHistoryDetails);
  };

  const handleSearchInputChange = (e) => {
    const inputValue = e.target.value;
    setSearchInput(inputValue);
  
    if (inputValue.trim() !== '') {
      const filteredHistory = simulatedHistoryDetails.filter(
        (detail) =>
          detail.consultationNumber.includes(inputValue) ||
          detail.patientName.toLowerCase().includes(inputValue.toLowerCase())
      );
      setHistoryDetails(filteredHistory);
    } else {
      setHistoryDetails(simulatedHistoryDetails);
    }
  };
  


  useEffect(() => {
    // Set filteredConsultancyDetails to all consultancy details when the component first renders
    setHistoryDetails(historyDetails);
  }, [historyDetails]);

  useEffect(() => {
    // Load initial data or perform other side effects
    // For example, fetch data from an API here
  }, []);

  return (
    <div className="container-fluid">
      <div className="lab-dashboard-sidebar">
        <ul className="dashboard-sidebar-list" style={{ listStyle: 'none'}}>
          <li>
            <button
              onClick={() => setSelectedTab(1)}
              className={`tab-button ${selectedTab === 1 ? "active" : ""}`}
            >
              <span>
                <EditCalendarIcon />
              </span>
              Consultancy
            </button>
          </li>
          <li>
            <button
              onClick={handleHistoryClick}
              className={`tab-button ${selectedTab === 2 ? "active" : ""}`}
            >
              <span>
                <EditCalendarIcon />
              </span>
              History
            </button>
          </li>
        </ul>
      </div>
      <div className="lab-dashboard-content">
        {selectedTab === 1 && (
          <ImageUploadForm/>

        )}
        {selectedTab === 2 && historyDetails && (
          <div>
            <div className="consultancy-header">
              <h2>History</h2>
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchInput}
                  onChange={handleSearchInputChange}
                />
                <button className="search-button" >
                  Search
                </button>
              </div>
            </div>
            <LabHistoryDetails searchKeyword={searchInput} />
          </div>
        )}
      </div>
    </div>
  );
}

export default LabTechnicianDashboard;
