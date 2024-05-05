import React, { useContext, useState, useEffect, useRef } from "react";
import { FaDownload } from "react-icons/fa";
import "./DoctorConsultancyView.css";
import image1 from "../images/image1.jpg";
import image2 from "../images/image2.jpg";
import image3 from "../images/image3.jpg";
import patient from "../images/patient.jpeg";
import radiologist from "../images/radiologist.jpg";
import doctor from "../images/doctor.jpg";
import axios from "axios";
import useMousePosition from "../Utility/useMousePosition";
import SockJS from "sockjs-client";
import StompJs from "stompjs";
import { UserDetailContext } from "../UserDetailContext";
import useOnlineStatus from "../Utility/CloseWindowUtility";
import UserProfile from "../Utility/UserProfile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faTimes,
  faSearchPlus,
  faSearchMinus,
} from "@fortawesome/free-solid-svg-icons";
import { FcNext, FcPrevious } from "react-icons/fc";
import { RiSlideshowLine } from "react-icons/ri";
import { GrPrevious, GrNext } from "react-icons/gr";


import { useNavigate } from "react-router-dom";

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

  const [radiologistId,setRadiologistsId]= useState(null);

  const [addRadiologist, setAddRadiologist] = useState({});
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [impressionText, setImpressionText] = useState("");
  const [doublyLL, setDoublyLL] = useState([]);
  const [currentAnnotation,setCurrentAnnotation]=useState(0);
  const [selectedImageId, setSelectedImageId] = useState(null);


  const {
    dicomImage,setDicomImage,
    token,
    isLoggedIn,
    setToken,
    setUserId,
    setIsLoggedIn,
    connectedUser,
    setConnectedUser,
  } = useContext(UserDetailContext);
  let [prevConnectedUser, setPrevConnectedUser] = useState([]);

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

  const isUserConnected = (userId) => connectedUser.includes(userId);

  useEffect(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const overlayWidth = 400; // Adjust as needed
    const overlayHeight = 300; // Adjust as needed
    const initialX = (screenWidth - overlayWidth) / 2;
    const initialY = 200; // 200px from top
    setOverlayPosition({ x: initialX, y: initialY });
  }, []);
  const handleToggleAnnotations = () => {
    setShowAnnotations((prevShowAnnotations) => !prevShowAnnotations);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8090/activeUsers");
        const newUserArray = response.data; // Assuming response.data is an array of userIds

        setPrevConnectedUser((prevConnectedUser) => [
          ...prevConnectedUser,
          ...newUserArray,
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useOnlineStatus(stompClient, userId);

  useEffect(() => {
    if (!isDoctorLoggedIn) {
      navigate("/");
    }
  }, [isDoctorLoggedIn, navigate]);



  const handleTabClick = (tabname, tabid, tabUserType) => {
    const updatedTabButtons = tabButtons.map((button) =>
      button.userId === tabid ? { ...button, unreadMessages: 0 } : button
    );
    setTabButtons(updatedTabButtons);
    setRecipientName(tabname);
    setRecipientUserType(tabUserType);
    setRecipientId(tabid);
    setSelectedTab(tabid);
   

    if(tabUserType==='RADIOLOGIST')
    {
      setRadiologistsId(tabid);
    }

    console.log(selectedTab);
    // Reset selected image when switching tabs
    setSelectedImage(null);
  };

  const handleImageClick = async (consultationId,imageId, index) => {
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
      const images = response.data.images;
      const selectedImage = images[index];
      console.log(imageId);

      setDicomImage({
        ...dicomImage,
        imageId: imageId,
  
      });
      console.log(dicomImage);
    
      
        
        setSelectedImageId(imageId);
        console.log("imaged",imageId)
     
        setSelectedImage(selectedImage.imageUrl);
        setCurrentIndex(index);
        setOverlayImages(images); 
    
    } catch (error) {
      console.error("Error fetching images:", error);
      // Handle error, maybe show a message to the user
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(radiologistId)
        const response = await axios.get(`http://localhost:8090/annotations/${radiologistId}/${selectedImageId}`);
        setDoublyLL(response.data); // Assuming the response data is an array of objects
        console.log(doublyLL)

      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error, show error message to user, etc.
      }
    };

    fetchData();
  }, [currentIndex, doublyLL, radiologistId, selectedImageId]);
  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  const handlePrevImage = () => {

    if(doublyLL.length >= 1){
    if(currentAnnotation!==0){
    setCurrentAnnotation((currentAnnotation) =>
    currentAnnotation === doublyLL.length - 1 ? 0 : currentAnnotation - 1
    );
  
  }
    setSelectedImage(doublyLL[currentAnnotation].imageUrl);
    setImpressionText(doublyLL[currentAnnotation].impressionText)
}
};

const handleNextImage = () => {
  setCurrentAnnotation((currentAnnotation) =>
  currentAnnotation=== doublyLL.length - 1 ? 0 : currentAnnotation + 1
  );
  setSelectedImage(doublyLL[currentAnnotation].imageUrl);
  setImpressionText(doublyLL[currentAnnotation].impressionText)

 
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
          // Check if the message is not from the currently selected tab
          if (newMessage.senderId !== selectedTab) {
            // Find the tab button corresponding to the senderId
            const updatedTabButtons = tabButtons.map((button) =>
              button.userId === newMessage.senderId
                ? { ...button, unreadMessages: button.unreadMessages + 1 }
                : button
            );
            setTabButtons(updatedTabButtons);
          } else {
            setChatMessages((prevMessages) => [...prevMessages, newMessage]);
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [stompClient, userId, selectedTab, tabButtons]);
  const handleSetConnectedUser = (userId) => {
    setConnectedUser((prevConnectedUser) => [...prevConnectedUser, userId]);
    console.log(setConnectedUser);
  };

  const handleRemoveConnectedUser = (userIdToRemove) => {
    setConnectedUser((prevConnectedUser) =>
      prevConnectedUser.filter((userId) => userId !== userIdToRemove)
    );
  };

  let temp = false;
  useEffect(() => {
    if (stompClient && temp === false) {
      const subscription = stompClient.subscribe(
        `/topic/activeUser`,
        (message) => {
          var user = JSON.parse(message.body);
          console.log("Received message:", message.body);
          if (user.status === "ONLINE") {
            handleSetConnectedUser(user.userId);
          } else {
            handleRemoveConnectedUser(user.userId);
          }
        }
      );
      temp = true;

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [connectedUser, stompClient, temp]);
  useEffect(() => {
    // Update connectedUser after prevConnectedUser has been updated
    setConnectedUser(prevConnectedUser);
  }, [prevConnectedUser, setConnectedUser]);

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
        const images = response.data.images.map((imageData) => ({
          imageUrl: imageData.imageUrl,
          imageId: imageData.id,
        }));

        console.log(images);
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
          unreadMessages: data.unreadMessages,
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
  }, [selectedConsultationId, addRadiologist, userId]);

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
      setAddRadiologist(response);
      setShowDropdown(false);

      // Optionally, you can update some state or show a success message
    } catch (error) {
      console.error("Error assigning radiologist:", error);
      // Handle error, maybe show a message to the user
    }
  };
  const handleEnterKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent new line on Enter
      handleSendMessage(); // Call handleSendMessage when Enter is pressed
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

                  {button.unreadMessages > 0 && (
                    <span className="red-notification">
                      {button.unreadMessages}
                    </span>
                  )}
                  {isUserConnected(button.userId) && (
                    <span className="green-dot" />
                  )}
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
                  RecipientId={RecipientId}
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
                      {message.content}
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
                onKeyDown={handleEnterKeyPress}
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

                    <div className="overlay-buttons">
                      <div className="zoom-buttons">
                        <FontAwesomeIcon
                          icon={faSearchPlus}
                          className="zoom-icon"
                          onClick={() =>
                            setZoomLevel((prevZoomLevel) => prevZoomLevel + 0.1)
                          }
                        />
                        <FontAwesomeIcon
                          icon={faSearchMinus}
                          className="zoom-icon"
                          onClick={() =>
                            setZoomLevel((prevZoomLevel) => prevZoomLevel - 0.1)
                          }
                        />
                      </div>
                      <GrPrevious
                        className="prev-btn"
                        onClick={handlePrevImage}
                      />
                      <GrNext className="next-btn" onClick={handleNextImage} />
                      <div
                        className="showana"
                        style={{
                          display: "flex",
                          height: "50px",
                          width: "50px",
                        }}
                      >
                        <RiSlideshowLine
                          className="slideshow-icon"
                          style={{
                            width: "100%",
                            height: "100%",
                            fontSize: "50px",
                          }}
                          onClick={handleToggleAnnotations}
                        />
                        {!showAnnotations && (
                          <span className="showana-tooltip">
                            Show Annotation
                          </span>
                        )}
                        {showAnnotations && (
                          <span className="showana-tooltip">
                            unshow Annotation
                          </span>
                        )}
                      </div>
                    </div>
                    {showAnnotations && (
                      <div className="annotations">
                        {/* Add your annotation content here */}
                        <p>{impressionText}</p>
                      </div>
                    )}
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
                      handleImageClick(selectedConsultationId,image.imageId, index)
                    }
                  >
                    <img src={image.imageUrl} alt={`Image ${index + 1}`} />
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
