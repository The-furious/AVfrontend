import React, { useState, useEffect,useRef } from "react";
import Navbar from "../Navbar/Navbar";
import "./PatientDashboard.css";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios
import useMousePosition from "../Utility/useMousePosition";

const PatientDashboard = ({ handleValueTileClick }) => {
  const [selectedTab, setSelectedTab] = useState(1);
  const [content, setContent] = useState(null);
  const [consultancyDetails, setConsultancyDetails] = useState(null);
  const [historyDetails, setHistoryDetails] = useState(null);
  const [newConsultancyUpdates, setNewConsultancyUpdates] = useState(false);
  const [newHistoryUpdates, setNewHistoryUpdates] = useState(false);
  const [activeButton, setActiveButton] = useState(null); // State to track active button
  const [startConfirmation, setStartConfirmation] = useState(false);
  const [doctorId, setDoctorId] = useState("");
  const [radiologistId, setRadiologistId] = useState("");
  const [pendingConsultations, setPendingConsultations] = useState(null); // New state for pending consultations
  const [doctors, setDoctors] = useState([]);
  const [radiologists, setRadiologists] = useState([]);
  const [showConsent,setShowConsent]=useState(false);

  const isPatientLoggedIn =
    sessionStorage.getItem("isPatientLoggedIn") === "true";
  const PatientId = sessionStorage.getItem("PatientId");
  let userId = sessionStorage.getItem("userId");
  console.log(userId);

  userId = parseInt(userId);

  const navigate = useNavigate();
  const timerRef = useRef(null);
  const mousePosition = useMousePosition();

  const handleHoverTile = (details) => {
    
    timerRef.current = setTimeout(() => setShowConsent(true), 1000); // Set delay for 1 second
  };

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
    setShowConsent(false);
  };

  const handleRequestClick = async () => {
    setSelectedTab(1);
    setContent("Request content goes here...");

    try {
      // Fetch data using Axios
      const token = sessionStorage.getItem("jwtToken");
      console.log(token);
      const response = await axios.get(
        `https://localhost:8090/consultation/get/present/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the JWT token to the Authorization header
          },
        }
      );

      // Extract relevant data from the response and update state
      const consultancyDetails = response.data.map((consultancy) => ({
        consultationId: consultancy.consultationId,
        doctorName: consultancy.doctor.name,
        startDate: consultancy.startDate.slice(0, 10),
        doctorId: consultancy.doctor.userId,
        status: "Work in Progress",
      }));

      setConsultancyDetails(consultancyDetails);
      setHistoryDetails(null);
      setNewConsultancyUpdates(false);
      setActiveButton(1); // Set active button
    } catch (error) {
      console.error("Error fetching consultancy details:", error);
      // Handle error (e.g., display an error message to the user)
      if (error.response && error.response.status === 403) {
        // JWT token expired, clear session storage and navigate to home page
        sessionStorage.clear();

        // Show error alert popup
        alert("Session expired. Please log in again."); // You can customize this message or use a more styled popup
        navigate("/");
      }
    }
  };

  const handleHistoryClick = async () => {
    setSelectedTab(2);
    setContent("Request content goes here...");

    try {
      // Fetch data using Axios
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.get(
        `https://localhost:8090/consultation/get/history/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the JWT token to the Authorization header
          },
        }
      );

      // Extract relevant data from the response and update state
      const consultancyDetails = response.data.map((consultancy) => ({
        consultationId: consultancy.consultationId,
        doctorName: consultancy.doctor.name,

        startDate: consultancy.startDate.slice(0, 10),
        status: "Completed",
      }));

      setConsultancyDetails(null);
      setNewConsultancyUpdates(false);
      setHistoryDetails(consultancyDetails);
      setActiveButton(2);
    } catch (error) {
      console.error("Error fetching consultancy details:", error);
      // Handle error (e.g., display an error message to the user)
      if (error.response && error.response.status === 403) {
        // JWT token expired, clear session storage and navigate to home page
        sessionStorage.clear();

        // Show error alert popup
        alert("Session expired. Please log in again."); // You can customize this message or use a more styled popup
        navigate("/");
      }
    }
  };
  const handlePendingConsultationClick = async () => {
    setSelectedTab(3); // Update selected tab for pending consultations

    try {
      // Fetch pending consultation data using Axios
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.get(
        `https://localhost:8090/patient/notification/non-consents/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the JWT token to the Authorization header
          },
        }
      );

      // Extract relevant data from the response and update state
      const pendingConsultationsData = response.data.map((consultation) => ({
        consultationId: consultation.consultationId,
        radiologistName: consultation.name,
        radiologistId: consultation.userId,
        status: "Pending",
      }));

      console.log(pendingConsultationsData);

      setPendingConsultations(pendingConsultationsData);
      setActiveButton(3); // Set active button for pending consultations
    } catch (error) {
      console.error("Error fetching pending consultations:", error);
      // Handle error (e.g., display an error message to the user)
      // Similar error handling as other functions
    }
  };

  const handleYesClick = async (radiologistId, consultationId) => {
    try {
      const token = sessionStorage.getItem("jwtToken");
      await axios.post(
        "https://localhost:8090/patient/notification/giveConsent",
        {
          userId: radiologistId,
          consultationId: consultationId,
          consentGiven: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await handlePendingConsultationClick();
      clearTimeout(timerRef.current); // Clear timeout on click
    setShowConsent(false);
      console.log("Yes clicked");
      // Add logic to update UI or handle success message
    } catch (error) {
      console.error("Error giving consent:", error);
      // Handle error (e.g., display an error message to the user)
    }
  };
  const handleNoClick = async (radiologistId, consultationId) => {
    try {
      const token = sessionStorage.getItem("jwtToken");
      await axios.post(
        "https://localhost:8090/patient/notification/giveConsent",
        {
          userId: radiologistId,
          consultationId: consultationId,
          consentGiven: false,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await handlePendingConsultationClick();
      clearTimeout(timerRef.current); // Clear timeout on click
      setShowConsent(false);
      console.log("No clicked");
      // Add logic to update UI or handle success message
    } catch (error) {
      console.error("Error giving consent:", error);
      // Handle error (e.g., display an error message to the user)
    }
  };

  const handleStartConsultationClick = () => {
    // Handle Start New Consultation button click
    setContent("form"); // Show the form
    setActiveButton(3); // Set active button
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create the request body
    const requestBody = {
      patientId: parseInt(userId),
      doctorId: parseInt(doctorId),

      // radiologistId:parseInt(radiologistId)
    };
    console.log(doctorId);
    console.log(requestBody);
    if (!startConfirmation) {
      alert(
        "Please confirm starting the consultation by checking the checkbox."
      );
      return;
    }

    try {
      // Send POST request using Axios
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.post(
        "https://localhost:8090/consultation/create",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the JWT token to the Authorization header
          },
        }
      );
      console.log("Consultancy created:", response.data);

      // Show success message or handle further logic
      setContent("Success");
    } catch (error) {
      console.error("Error creating consultancy:", error);
      // Handle error (e.g., display an error message to the user)
      if (error.response && error.response.status === 403) {
        // JWT token expired, clear session storage and navigate to home page
        sessionStorage.clear();

        // Show error alert popup
        alert("Session expired. Please log in again."); // You can customize this message or use a more styled popup
        navigate("/");
      }
    }
  };

  useEffect(() => {
    if (!isPatientLoggedIn) {
      navigate("/");
    }
  }, [isPatientLoggedIn, navigate]);

  // const handleChange = (event) => {
  //   // Handle form input changes
  //   const { name, value } = event.target;
  //   if (name === "doctorId") {
  //     setDoctorId(value);
  //   } else if (name === "radiologistId") {
  //     setRadiologistId(value);
  //   }
  // };

  const handleValueClick = (consultationId, patientName) => {
    // Handle the click event for the value tile
    console.log(`Clicked value: ${consultationId}`);

    // Set the selected consultationId in sessionStorage
    sessionStorage.setItem("selectedConsultationId", consultationId);

    // Navigate to the doctor-consultancy-view page
    navigate(`/patient-consultancy-view/${userId}`);
  };

  const handleHistoryValueClick = async (consultationId) => {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.get(
        `https://localhost:8090/consultation/generateReport/${consultationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob', // Set the responseType to 'blob' for binary data (PDF)
        }
      );
  
      // Create a Blob from the response data
      const blob = new Blob([response.data], { type: 'application/pdf' });
  
      // Create a URL for the Blob object
      const url = window.URL.createObjectURL(blob);
  
      // Create a link element to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'report.pdf'; // Set the filename for the downloaded file
      document.body.appendChild(link);
  
      // Trigger the download
      link.click();
  
      // Clean up by removing the link element and revoking the URL
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error while downloading", error);
      // Handle error (e.g., display an error message to the user)
    }
  };
  

  useEffect(() => {
    const fetchRadiologistsAndDoctors = async () => {
      try {
        const radiologistsResponse = await axios.get(
          "https://localhost:8090/admin/getAllRadiologist"
        );
        setRadiologists(radiologistsResponse.data);
        console.log(radiologistsResponse);

        const doctorsResponse = await axios.get(
          "https://localhost:8090/admin/getAllDoctors"
        );
        setDoctors(doctorsResponse.data);
      } catch (error) {
        console.error("Error fetching radiologists and doctors:", error);
        // Handle error (e.g., display an error message to the user)
      }
    };

    fetchRadiologistsAndDoctors();
  }, []);

  return (
    <>
      <div className="container-fluid">
        <div className="patient-dashboard-sidebar">
          <ul className="dashboard-sidebar-list" style={{ listStyle: "none" }}>
            <li>
              <button
                onClick={handleStartConsultationClick}
                className={`tab-buttons ${
                  content === "form" && activeButton === 3 ? "active" : ""
                }`}
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
                className={`tab-buttons ${
                  selectedTab === 1 && activeButton === 1 ? "active" : ""
                }`}
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
                className={`tab-buttons ${
                  selectedTab === 2 && activeButton === 2 ? "active" : ""
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
            <li>
              <button
                onClick={handlePendingConsultationClick} // Call the new function for pending consultations
                className={`tab-buttons ${
                  selectedTab === 3 && activeButton === 3 ? "active" : ""
                }`}
              >
                <span>
                  <EditCalendarIcon />
                </span>
                Pending Consultation
              </button>
            </li>
          </ul>
        </div>
        <div className="patient-dashboard-content">
          {/* Main content goes here */}
          {content === "Success" ? (
            <div className="success-message-container">
              <div className="success-message">
                <CheckCircleIcon style={{ color: "green", fontSize: 48 }} />
                <p>Success!</p>
              </div>
            </div>
          ) : (
            <>
              {content === "form" ? (
                <div className="form-container">
                  <form onSubmit={handleSubmit}>
                    <h2>Fill in the Details</h2>
                    <div className="form-group">
                      <label htmlFor="doctorId">Doctor Name :</label>
                      <select
                        id="doctorId"
                        onChange={(e) => {
                          const selectedDoctorName = e.target.value; // Get the selected doctor's name
                          console.log(
                            "Selected Doctor Name:",
                            selectedDoctorName
                          );

                          // Find the doctor object based on the selected name
                          const selectedDoctor = doctors.find(
                            (doctor) => doctor.name === selectedDoctorName
                          );

                          if (selectedDoctor) {
                            console.log(
                              "Selected Doctor ID:",
                              selectedDoctor.userId
                            );
                            setDoctorId(selectedDoctor.userId); // Set doctorId with the ID of the selected doctor
                          }
                        }}
                        // Set the value attribute of the select element to doctorId
                        required
                      >
                        <option value="">Select Doctor</option>
                        {doctors.map((doctor) => (
                          <option key={doctor.userId} value={doctor.name}>
                            {doctor.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="radiologistId">Radiologist Name :</label>
                      <div className="form-group">
                        <label htmlFor="radiologistId">Radiologist Name:</label>
                        <select
                          id="radiologistId"
                          onChange={(e) => {
                            const selectedRadiologistName = e.target.value;
                            const selectedRadiologist = radiologists.find(
                              (radiologist) =>
                                radiologist.name === selectedRadiologistName
                            );
                            if (selectedRadiologist) {
                              setRadiologistId(selectedRadiologist.userId);
                            } else {
                              setRadiologistId(""); // Handle the case when no radiologist is selected
                            }
                          }}
                        >
                          <option value="">Select Radiologist</option>
                          {radiologists.map((radiologist) => (
                            <option
                              key={radiologist.userId}
                              value={radiologist.userId}
                            >
                              {radiologist.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="form-group">
                        <label
                          style={{ display: "flex", alignItems: "center" }}
                          htmlFor="startConfirmation"
                        >
                          <input
                            type="checkbox"
                            id="startConfirmation"
                            checked={startConfirmation}
                            onChange={() =>
                              setStartConfirmation(!startConfirmation)
                            }
                          />
                          <span style={{ marginLeft: "-50px" }}>
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
                                <div className="attribute-name">Doctor ID:</div>
                                <div className="attribute-name">
                                  Start Date:
                                </div>
                                <div className="attribute-name">Status:</div>
                              </div>
                              <button
                                className="value-tile"
                                onClick={() =>
                                  handleValueClick(
                                    detail.consultationId,
                                    detail.doctorId
                                  )
                                }
                              >
                                <div>{detail.consultationId}</div>
                                <div>{detail.doctorName}</div>
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
                                <div className="attribute-name">
                                  Consultation Number:
                                </div>
                                <div className="attribute-name">Doctor ID:</div>
                                <div className="attribute-name">
                                  Start Date:
                                </div>
                                <div className="attribute-name">Status:</div>
                               
                              </div>
                              <button
                                className="value-tile"
                                onClick={() => handleHistoryValueClick(detail.consultationId)}
                              >
                                <div>{detail.consultationId}</div>
                                <div>{detail.doctorName}</div>
                                <div>{detail.startDate}</div>
                                <div>{detail.status}</div>
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                  {selectedTab === 3 && (
                    <div>
                      <h2>Pending Consultations</h2>
                      {pendingConsultations &&
                        pendingConsultations.map((consultation, index) => (
                          <div className="tile" key={index}>
                            <div className="consultancy-details">
                              <div className="attribute-tile">
                                <div className="attribute-name">
                                  Consultation Number:
                                </div>
                                <div className="attribute-name">
                                  Radiologist Name:
                                </div>
                                <div className="attribute-name">Status:</div>
                                <div className="attribute-name">Approve:</div>
                              </div>
                              <div className="value-tile" onMouseEnter={() => handleHoverTile()}
                                    onMouseLeave={handleMouseLeave}>
                                <div>{consultation.consultationId}</div>
                                <div>{consultation.radiologistName}</div>
                                <div>{consultation.status}</div>
                                <div className="button-container">
                                  {/* Add Yes and No buttons */}
                                  <button
                                    className="yes-button "
                                    onMouseEnter={handleMouseLeave}
                                    onClick={() =>
                                      handleYesClick(
                                        consultation.radiologistId,
                                        consultation.consultationId
                                      )
                                     
                                    }
                                    
                                  >
                                    Yes
                                  </button>
                                  <button
                                    className="no-button"
                                    onMouseEnter={handleMouseLeave}
                                    onClick={() =>
                                      handleNoClick(
                                        consultation.radiologistId,
                                        consultation.consultationId
                                      )
                                    }
                                  >
                                    No
                                  </button>
                                </div>
                              </div>{showConsent && (
                        <div
                          className="patient-details-box"
                          style={{
                            left: mousePosition.x,
                            top: mousePosition.y,
                          }}
                        >
                           <p>need a consent to add the radiologist</p>
                         
                        </div>
                      )}
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
};

export default PatientDashboard;
