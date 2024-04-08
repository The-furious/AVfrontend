import React, { useState, useEffect, useRef } from "react";
import "./DoctorConsultancyView.css";
import image1 from "../images/image1.jpg";
import image2 from "../images/image2.jpg";
import image3 from "../images/image3.jpg";
import patient from "../images/patient.jpeg";
import radiologist from "../images/radiologist.jpg";
import axios from "axios";
import useMousePosition from "../Utility/useMousePosition";

import { useNavigate } from "react-router-dom";

const UserProfile = ({ name, photoUrl }) => (
  <div className="user-profile">
    <img src={patient} alt="Profile" className="profile-photo" />
    <div className="profile-name">{name}</div>
  </div>
);

export const DoctorConsultancyView = () => {
  const [selectedTab, setSelectedTab] = useState("patient");
  const [sidebarImages, setSidebarImages] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);
  const [textInputValue, setTextInputValue] = useState("");
  const [overlayImages, setOverlayImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [overlayPosition, setOverlayPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const isDoctorLoggedIn =
    sessionStorage.getItem("isDoctorLoggedIn") === "true";
  const [showDropdown, setShowDropdown] = useState(false);
  const [Radiologists, setRadiologists] = useState([]);
  const chatBoxRef = useRef(null);

  const selectedConsultationId = sessionStorage.getItem(
    "selectedConsultationId"
  );

  const [chatMessages, setChatMessages] = useState({
    patient: [
      { id: 1, text: "Hello!", sender: "patient" },
      { id: 2, text: "How can I help you?", sender: "patient" },
    ],
    radiologist1: [
      { id: 1, text: "Hi, Doctor!", sender: "radiologist1" },
      { id: 2, text: "Sure, let's discuss.", sender: "radiologist1" },
    ],
    radiologist2: [
      { id: 1, text: "Hello, Dr. Smith!", sender: "radiologist2" },
      { id: 2, text: "I have some reports.", sender: "radiologist2" },
    ],
  });

  useEffect(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const overlayWidth = 400; // Adjust as needed
    const overlayHeight = 300; // Adjust as needed
    const initialX = (screenWidth - overlayWidth) / 2;
    const initialY = 200; // 200px from top
    setOverlayPosition({ x: initialX, y: initialY });
  }, []);

  useEffect(() => {
    if (!isDoctorLoggedIn) {
      navigate("/");
    }
  }, [isDoctorLoggedIn, navigate]);

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    // Reset selected image when switching tabs
    setSelectedImage(null);
  };

  const handleImageClick = async (consultationId, index) => {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.get(
        `http://localhost:8090/consultation/labReport/${selectedConsultationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the JWT token to the Authorization header
          },
        }
      );
      const images = response.data.images.map(
        (imageData) => imageData.imageUrl
      ); // Assuming the API returns an array of image URLs
      setOverlayImages(images);
      setCurrentIndex(index);
      setSelectedImage(images[index]);
    } catch (error) {
      console.error("Error fetching images:", error);
      // Handle error, maybe show a message to the user
    }
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  const handlePrevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? overlayImages.length - 1 : prevIndex - 1
    );
    setSelectedImage(overlayImages[currentIndex]);
  };

  const handleNextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === overlayImages.length - 1 ? 0 : prevIndex + 1
    );
    setSelectedImage(overlayImages[currentIndex]);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - overlayPosition.x,
      y: e.clientY - overlayPosition.y,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setOverlayPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const overlayContainerStyle = {
    transform: `scale(${zoomLevel})`,
    left: `${overlayPosition.x}px`,
    top: `${overlayPosition.y}px`,
    cursor: isDragging ? "grabbing" : "grab",
  };

  useEffect(() => {
    // Scroll the chat box to the bottom after every render
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  });

  const handleSendMessage = () => {
    if (textInputValue.trim() !== "") {
      const newMessage = {
        id: chatMessages.length + 1,
        text: textInputValue.trim(),
        sender: "doctor",
      };
      setChatMessages((prevChatMessages) => ({
        ...prevChatMessages,
        [selectedTab]: [...prevChatMessages[selectedTab], newMessage],
      }));
      setTextInputValue("");
      setTextInputValue("");

      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const token = sessionStorage.getItem("jwtToken");
        const response = await axios.get(
          `http://localhost:8090/consultation/labReport/${selectedConsultationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach the JWT token to the Authorization header
            },
          }
        );
        const images = response.data.images.map(
          (imageData) => imageData.imageUrl
        );
        setSidebarImages(images);
        console.log(sidebarImages);
      } catch (error) {
        console.error("Error fetching images:", error);
        // Handle error, maybe show a message to the user
      }
    };

    if (selectedConsultationId) {
      fetchImages();
    }
  }, [selectedConsultationId]);

  const handleAddButtonClick = async () => {
    try {
      const token = sessionStorage.getItem("jwtToken");

      const response = await axios.get(
        "http://localhost:8090/admin/getAllRadiologist",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRadiologists(response.data); // Update state with fetched radiologists
      setShowDropdown(!showDropdown);
    } catch (error) {
      console.error("Error fetching radiologists:", error);
      // Handle error, maybe show a message to the user
    }
  };

  return (
    <div className="doctor-consulancy-view">
      <div className="scrollable-main">
        <main>
          <div className="sidebard">

            <div className="right-button">
           
              <button
                className="plus-button-inner"
                onClick={handleAddButtonClick}
              >
                +
              </button>
              
            </div>
            <div className="tab-buttonsd">
              <button
                onClick={() => handleTabClick("patient")}
                className={selectedTab === "patient" ? "active" : ""}
              >
                Patient
              </button>
              <button
                onClick={() => handleTabClick("radiologist1")}
                className={selectedTab === "radiologist1" ? "active" : ""}
              >
                Radiologist 1
              </button>
              <button
                onClick={() => handleTabClick("radiologist2")}
                className={selectedTab === "radiologist2" ? "active" : ""}
              >
                Radiologist 2
              </button>
            </div>
            <div className="dropdown">
              {showDropdown && (
                <div className="dropdown-menu">
                  <select onChange={(e) => setSelectedTab(e.target.value)}>
                    <option value="">Select Radiologist</option>
                    {Radiologists.map((radiologist) => (
                      <option key={radiologist.userId} value={radiologist.name}>
                        {radiologist.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
          <div className="content1">
            <div className="user-profile-section">
              {selectedTab && <UserProfile name={selectedTab} photoUrl="" />}
            </div>

            <div className="chat">
              {!selectedImage && selectedTab && (
                <div className="chat-box" ref={chatBoxRef}>
                  {chatMessages[selectedTab].map((message) => (
                    <div
                      key={message.id}
                      className={`message ${
                        message.sender === selectedTab ? "left" : "right"
                      }`}
                    >
                      {message.text}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="text-inputd">
              <textarea
                type="text"
                placeholder="Type your message here..."
                value={textInputValue}
                onChange={(e) => setTextInputValue(e.target.value)}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>

            {selectedImage && (
              <div
                className="image-overlay-container"
                style={overlayContainerStyle}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              >
                <div className="image-overlay">
                  <span className="close-btn" onClick={handleCloseImage}>
                    &times;
                  </span>
                  <div className="overlay-content">
                    <img
                      src={selectedImage}
                      alt="Selected"
                      className="overlay-image"
                    />
                  </div>
                  <div className="overlay-buttons">
                    <button
                      className="zoom-in-btn"
                      onClick={() =>
                        setZoomLevel((prevZoomLevel) => prevZoomLevel + 0.1)
                      }
                    >
                      Zoom In
                    </button>
                    <button
                      className="zoom-out-btn"
                      onClick={() =>
                        setZoomLevel((prevZoomLevel) => prevZoomLevel - 0.1)
                      }
                    >
                      Zoom Out
                    </button>
                    <button className="prev-btn" onClick={handlePrevImage}>
                      &lt; Previous
                    </button>
                    <button className="next-btn" onClick={handleNextImage}>
                      Next &gt;
                    </button>
                  </div>
                  <div className="annotations">
                    {/* Add your annotation content here */}
                    <p>This is an annotation for the selected image.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="sidebar2d">
            <div className="image-container">
              <div className="tab-buttons2">
                {sidebarImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      handleImageClick(selectedConsultationId, index)
                    }
                  >
                    <img src={image} alt={`Image ${index + 1}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorConsultancyView;
