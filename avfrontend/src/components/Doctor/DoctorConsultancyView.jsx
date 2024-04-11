import React, { useState, useEffect, useRef } from "react";
import "./DoctorConsultancyView.css";
import image1 from "../images/image1.jpg";
import image2 from "../images/image2.jpg";
import image3 from "../images/image3.jpg";
import patient from "../images/patient.jpeg";
import radiologist from "../images/radiologist.jpg";
import doctor from "../images/doctor.jpg"
import axios from "axios";
import useMousePosition from "../Utility/useMousePosition";
import SockJS from "sockjs-client";
import StompJs from "stompjs";

import { useNavigate } from "react-router-dom";

const UserProfile = ({ name, userType, photoUrl }) => {
  let profileImage;

  if (userType === "PATIENT") {
    profileImage = patient;
  } else if (userType === "RADIOLOGIST") {
    profileImage = radiologist;
  } else {
    // Default image or handle other user types
    profileImage = ""; // Set a default image or leave it empty
  }

  return (
    <div className="user-profile">
      <img src={profileImage} alt="Profile" className="profile-photo" />
      <div className="profile-name">{name}</div>
    </div>
  );
};

export const DoctorConsultancyView = () => {
  const [selectedTab, setSelectedTab] = useState();
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
  const [tabButtons, setTabButtons] = useState([]);
  const [defaultSelectedTab, setDefaultSelectedTab] = useState();
  const [socketUrl, setSocketUrl] = useState("http://localhost:8090/ws"); // Change this to your WebSocket server URL
  const [stompClient, setStompClient] = useState(null);

  const chatBoxRef = useRef(null);

  const selectedConsultationId = sessionStorage.getItem(
    "selectedConsultationId"
  );
  const userId = sessionStorage.getItem("userId");
  const senderId = userId;
  const [RecipientName, setRecipientName] = useState();
  const [RecipientUserType, setRecipientUserType] = useState();
  const [RecipientPhoto, setRecipientPhoto] = useState();

  const [RecipientId, setRecipientId] = useState();
  const [chatMessages, setChatMessages] = useState([]);
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

 let left;

  if (RecipientUserType === "PATIENT") {
    left = patient;
  } else if (RecipientUserType=== "RADIOLOGIST") {
    left = radiologist;
  } 







  const handleTabClick = (tabname, tabid, tabUserType) => {
    setSelectedTab(tabid);
    setRecipientName(tabname);
    setRecipientUserType(tabUserType);
    setRecipientId(tabid);

    console.log(selectedTab);
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
  useEffect(() => {
    const socket = new SockJS(socketUrl);
    const stompClient = StompJs.over(socket);
    stompClient.connect({}, () => {
      console.log("WebSocket connected");
      setStompClient(stompClient);
    });
  }, [socketUrl]);

  useEffect(() => {
    if (stompClient) {
      const subscription = stompClient.subscribe(
        `/user/${userId}/queue/messages`,
        (message) => {
          const newMessage = JSON.parse(message.body);
          setChatMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [stompClient, userId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8090/messages/${selectedConsultationId}/${userId}/${RecipientId}`
        );
        setChatMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
        // Handle error, maybe show a message to the user
      }
    };

    if (selectedConsultationId && userId && RecipientId) {
      fetchMessages();
    }
  }, [selectedConsultationId, userId, RecipientId]);

  const handleSendMessage = async () => {
    const consultationId = sessionStorage.getItem("selectedConsultationId");
    const senderId = sessionStorage.getItem("userId");
    const recipientId = RecipientId;
    const content = textInputValue;

    if (stompClient && stompClient.connected) {
      const newMessage = {
        senderId,
        recipientId,
        consultationId,
        content,
      };
      stompClient.send("/app/chat", {}, JSON.stringify(newMessage));
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
      setTextInputValue("");
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

  useEffect(() => {
    const fetchConsultationData = async () => {
      try {
        const token = sessionStorage.getItem("jwtToken");
        const response = await axios.get(
          `http://localhost:8090/consultation/${selectedConsultationId}/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach the JWT token to the Authorization header
            },
          }
        );
        const consultationData = response.data;
        // Assuming the response is an array of objects with keys: givenConsent, name, userId, userType
        const tabButtons = consultationData.map((data) => ({
          name: data.name,
          userId: data.userId,
          givenConsent: data.givenConsent,
          userType: data.userType,
        }));
        // Filter the tabButtons array based on givenConsent value
        // const filteredTabButtons = tabButtons.filter(
        //   (button) => button.givenConsent
        // );
        // Set the filtered tabButtons to state
        setTabButtons(tabButtons);
        if (tabButtons.length > 0) {
          setDefaultSelectedTab(tabButtons[0].userId);
          setRecipientName(tabButtons[0].name);
          setRecipientUserType(tabButtons[0].userType);
        }
      } catch (error) {
        console.error("Error fetching consultation data:", error);
        // Handle error, maybe show a message to the user
      }
    };

    if (selectedConsultationId) {
      fetchConsultationData();
    }
  }, [selectedConsultationId]);

  useEffect(() => {
    setSelectedTab(defaultSelectedTab);
  }, [defaultSelectedTab]);

  const handleSelectButtonClick = async (RadiologistId) => {
    try {
      const token = sessionStorage.getItem("jwtToken");

      const response = await axios.post(
        `http://localhost:8090/doctor/add/radiologist/${selectedConsultationId}/${RadiologistId}`,
        {}, // Add an empty object or the data you want to send in the request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle the response as needed
      console.log("Radiologist assigned:", response.data);
      window.location.reload();
      

      // Optionally, you can update some state or show a success message
    } catch (error) {
      console.error("Error assigning radiologist:", error);
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
              {tabButtons.map((button) => (
                <button
                  key={button.userId}
                  onClick={() => {
                    if (button.givenConsent) {
                      handleTabClick(
                        button.name,
                        button.userId,
                        button.userType
                      );
                    }
                  }}
                  className={`${
                    selectedTab === button.userId ? "active" : ""
                  } ${!button.givenConsent ? "disabled" : ""}`}
                  disabled={!button.givenConsent}
                >
                  {button.name}
                </button>
              ))}
            </div>
            <div className="dropdown">
              {showDropdown && (
                <div className="dropdown-menu">
                  <select
                    onChange={(e) => handleSelectButtonClick(e.target.value)}
                  >
                    <option value="">Select Radiologist</option>
                    {Radiologists.map((radiologist) => (
                      <option
                        key={radiologist.userId}
                        value={radiologist.userId}
                      >
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
              {selectedTab && (
                <UserProfile
                  name={RecipientName}
                  userType={RecipientUserType}
                  photoUrl=""
                />
              )}
            </div>

            <div className="chat">
              {!selectedImage && selectedTab && (
                <div className="chat-box" ref={chatBoxRef}>
                  {chatMessages.map((message) => (
  <div
    key={message.chatId}
    className={`message ${
      message.senderId.toString() === senderId
        ? "right"
        : "left"
    }`}
  > 
    
    <div className="message-content">
      {message.content}
    </div>
    {message.senderId.toString() !== senderId && (
      <div className="profile-container">
        <img
          src={ message.sender ||left}// Assuming RecipientPhoto is the URL from the backend
          alt="Recipient Profile"
          className="profile-photo"
        />
      </div>
    )}
    {message.senderId.toString() === senderId && (
      <div className="profile-container2">
        <img
          src= {doctor}
          alt="Sender Profile"
          className="profile-photo"
        />
      </div>
    )}
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
