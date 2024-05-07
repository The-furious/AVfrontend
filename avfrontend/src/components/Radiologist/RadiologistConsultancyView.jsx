/* eslint-disable no-template-curly-in-string */
import React, { useContext, useState, useEffect, useRef } from "react";
import "./RadiologistConsultancyView.css";
import image1 from "../images/image1.jpg";
import image2 from "../images/image2.jpg";
import image3 from "../images/image3.jpg";
import { useNavigate } from "react-router-dom";
import doctor from "../images/doctor.jpg";
import useMousePosition from "../Utility/useMousePosition";
import axios from "axios";
import DwvComponent from "../DicomViewer/DwvComponent";

// import io from "socket.io-client";
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
import { LiaImagesSolid } from "react-icons/lia";
import { GrPrevious, GrNext } from "react-icons/gr";
import DicomViewer from "../DicomViewer/DicomViewer";

export const RadiologistConsultancyView = () => {
  var [selectedTab, setSelectedTab] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [sidebarImages, setSidebarImages] = useState([{}]);
  const [textInputValue, setTextInputValue] = useState("");
  const [overlayImages, setOverlayImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [tabButtons, setTabButtons] = useState([]);
  const [defaultSelectedTab, setDefaultSelectedTab] = useState();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [sendAnnotation, setSendAnnotation] = useState(false);
  const [impressionText, setImpressionText] = useState("");
  const [doublyLL, setDoublyLL] = useState([]);
  const [currentAnnotation, setCurrentAnnotation] = useState(0);

  const selectedConsultationId = sessionStorage.getItem(
    "selectedConsultationId"
  );

  const [socketUrl, setSocketUrl] = useState("https://localhost:8090/wss"); // Change this to your WebSocket server URL
  const [stompClient, setStompClient] = useState(null);
  const userId = sessionStorage.getItem("userId");
  const senderId = userId;
  const [RecipientName, setRecipientName] = useState();
  let [RecipientId, setRecipientId] = useState();
  const [chatMessages, setChatMessages] = useState([]);
  const [overlayPosition, setOverlayPosition] = useState({ x: 0, y: 0 });
  const [selectedImageId, setSelectedImageId] = useState(null);

  const {
    dicomImage,
    setDicomImage,
    token,
    isLoggedIn,
    setToken,
    setUserId,
    setIsLoggedIn,
    connectedUser,
    setConnectedUser,
  } = useContext(UserDetailContext);

  const navigate = useNavigate();
  const isRadiologistLoggedIn =
    sessionStorage.getItem("isRadiologistLoggedIn") === "true";
  const chatBoxRef = useRef(null);

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
    setSendAnnotation(false);
  };
  const handleToggleSendAnnotation = () => {
    setSendAnnotation((prevSendAnnotation) => !prevSendAnnotation);
    setShowAnnotations(false);
    // Clear annotation text when hiding the annotation section
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
    if (!isRadiologistLoggedIn) {
      navigate("/");
    }
  }, [isRadiologistLoggedIn, navigate]);

  const handleTabClick = (tabname, tabid) => {
    const updatedTabButtons = tabButtons.map((button) =>
      button.userId === tabid ? { ...button, unreadMessages: 0 } : button
    );
    console.log(tabid);
    setTabButtons(updatedTabButtons);

    setRecipientName(tabname);
    setRecipientId(tabid);
    console.log(RecipientId);

    // Reset selected image when switching tabs
    setSelectedImage(null);
  };

  const handleImageClick = async (consultationId, imageId,imageUrlDCM, index) => {
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.get(
        `https://localhost:8090/consultation/labReport/${selectedConsultationId}`,
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
        imageUrl:imageUrlDCM,
        radiologistId: userId,
      });
      console.log(dicomImage);

      setSelectedImageId(imageId);
      console.log("imaged", imageId);

      setSelectedImage(selectedImage.imageUrlDCM);
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
        const response = await axios.get(
          `https://localhost:8090/annotations/${userId}/${selectedImageId}`
        );
        setDoublyLL(response.data); // Assuming the response data is an array of objects
        console.log(doublyLL);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error, show error message to user, etc.
      }
    };

    fetchData();
  }, [currentIndex]);

  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  const handlePrevImage = () => {
    if (doublyLL.length >= 1) {
      if (currentAnnotation !== 0) {
        setCurrentAnnotation((currentAnnotation) =>
          currentAnnotation === doublyLL.length - 1 ? 0 : currentAnnotation - 1
        );
      }
      setSelectedImage(doublyLL[currentAnnotation].imageUrl);
      setImpressionText(doublyLL[currentAnnotation].impressionText);
    }
  };

  const handleNextImage = () => {
    if (doublyLL.length > 0) {
      setCurrentAnnotation((currentAnnotation) =>
        currentAnnotation === doublyLL.length - 1 ? 0 : currentAnnotation + 1
      );
      setSelectedImage(doublyLL[currentAnnotation].imageUrl);
      setImpressionText(doublyLL[currentAnnotation].impressionText);
    }  };
  useEffect(() => {
    setCurrentAnnotation(0);
  }, [currentIndex]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  });

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const token = sessionStorage.getItem("jwtToken");
        const response = await axios.get(
          `https://localhost:8090/consultation/labReport/${selectedConsultationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach the JWT token to the Authorization header
            },
          }
        );
        const images = response.data.images.map((imageData) => ({
          imageUrl: imageData.imageUrlDCM,
          imageId: imageData.id,
          imageUrlDCM:imageData.imageUrl
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

  useEffect(() => {
    const fetchConsultationData = async () => {
      try {
        const token = sessionStorage.getItem("jwtToken");
        const response = await axios.get(
          `https://localhost:8090/consultation/${selectedConsultationId}/${userId}`,
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
          setRecipientId(tabButtons[0].userId);
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

  useEffect(() => {
    const socket = new SockJS(socketUrl);
    const stompClient = StompJs.over(socket);
    stompClient.connect({}, () => {
      console.log("WebSocket connected");
      setStompClient(stompClient);
    });
  }, [socketUrl]);

  // Inside the `useEffect` that sets up WebSocket connection
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
          }

          setChatMessages((prevMessages) => [...prevMessages, newMessage]);
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
    setConnectedUser((prevConnectedUser) => {
      prevConnectedUser.filter((userId) => userId !== userIdToRemove);
      console.log("remove", prevConnectedUser);
    });
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
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `https://localhost:8090/messages/${selectedConsultationId}/${userId}/${RecipientId}`
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
  const handleEnterKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent new line on Enter
      handleSendMessage(); // Call handleSendMessage when Enter is pressed
    }
  };

  useEffect(() => {
    if (sendAnnotation === true) {
      navigate("/dicom-viewer");
    }
  }, [navigate, sendAnnotation]);

  useOnlineStatus(stompClient, userId);

  return (
    <div className="radiologist-consulancy-view">
      <div className="scrollable-main">
        <main>
          <div className="sidebar1r">
            <div className="tab-buttonsr">
              {tabButtons.map((button) => (
                <button
                  key={button.userId}
                  onClick={() => {
                    if (button.givenConsent) {
                      handleTabClick(button.name, button.userId);
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
                </button>
              ))}
            </div>
          </div>
          <div className="content1">
            <div className="user-profile-section">
              {selectedTab && (
                <UserProfile
                  userType="DOCTOR"
                  RecipientId={RecipientId}
                  name={RecipientName}
                  photoUrl=""
                />
              )}{" "}
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
            <div className="text-inputr">
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
                        className="send-annotation"
                        style={{
                          display: "flex",
                          height: "50px",
                          width: "50px",
                        }}
                      >
                        <LiaImagesSolid
                          className="slideshow-icon"
                          style={{
                            width: "100%",
                            height: "100%",
                            fontSize: "50px",
                          }}
                          onClick={handleToggleSendAnnotation}
                        />
                        
                          <span className="showana-tooltip">
                            Open Dicom-Viewer
                          </span>
                       
                      
                        
                      </div>
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
                    {sendAnnotation}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="sidebar2">
            <div className="image-container">
              <div className="tab-buttons2">
                {sidebarImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      handleImageClick(
                        selectedConsultationId,
                        image.imageId,
                        image.imageUrlDCM,
                        index
                      )
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

export default RadiologistConsultancyView;
