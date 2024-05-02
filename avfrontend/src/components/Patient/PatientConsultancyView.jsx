import React, { useContext,useState, useEffect, useRef } from "react";
import { FaDownload } from "react-icons/fa";
import "./PatientConsultancyView.css";
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
import { UserDetailContext } from "../UserDetailContext";
import useOnlineStatus  from "../Utility/CloseWindowUtility"
import UserProfile from '../Utility/UserProfile';




import { useNavigate } from "react-router-dom";


export const PatientConsultancyView = () => {
  const [selectedTab, setSelectedTab] = useState();
  const [sidebarImages, setSidebarImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [textInputValue, setTextInputValue] = useState("");
  const [overlayImages, setOverlayImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [overlayPosition, setOverlayPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const navigate = useNavigate();
  const isPatientLoggedIn =
    sessionStorage.getItem("isPatientLoggedIn") === "true";
  const [showDropdown, setShowDropdown] = useState(false);
  const [tabButtons, setTabButtons] = useState([]);
  const [defaultSelectedTab, setDefaultSelectedTab] = useState();
  const [socketUrl, setSocketUrl] = useState("http://localhost:8090/ws"); // Change this to your WebSocket server URL
  const [stompClient, setStompClient] = useState(null);
  

  const { token, isLoggedIn, setToken, setUserId, setIsLoggedIn,connectedUser, setConnectedUser  } =
  useContext(UserDetailContext);
  let [prevConnectedUser,setPrevConnectedUser]=useState([]);


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
  const [isDragging, setIsDragging] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);



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
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8090/activeUsers");
        const newUserArray = response.data; // Assuming response.data is an array of userIds

        setPrevConnectedUser((prevConnectedUser) => [...prevConnectedUser, ...newUserArray]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  useOnlineStatus(stompClient, userId);

  useEffect(() => {
    if (!isPatientLoggedIn) {
      navigate("/");
    }
  }, [isPatientLoggedIn, navigate]);










  const handleTabClick = (tabname, tabid, tabUserType) => {
    const updatedTabButtons = tabButtons.map((button) =>
    button.userId === tabid ? { ...button, unreadMessages: 0 } : button
  );
  setTabButtons(updatedTabButtons);
    setRecipientName(tabname);
    setRecipientUserType(tabUserType);
    setRecipientId(tabid);
    setSelectedTab(tabid);

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
          }
          else{
           
  
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
  
let temp=false;
  useEffect(() => {
    if (stompClient && temp === false) {
      const subscription = stompClient.subscribe(
        `/topic/activeUser`,
        (message) => {
          var user = JSON.parse(message.body);
          console.log("Received message:", message.body);
          if(user.status==='ONLINE'){
          handleSetConnectedUser(user.userId);
          }
          else{
            handleRemoveConnectedUser(user.userId);          }
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
          unreadMessages:data.unreadMessages,
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
  }, [selectedConsultationId,userId]);

  useEffect(() => {
    setSelectedTab(defaultSelectedTab);
  }, [defaultSelectedTab]);

  
  const handleEnterKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent new line on Enter
      handleSendMessage(); // Call handleSendMessage when Enter is pressed
    }
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


  return (
    <div className="doctor-consulancy-view">
      <div className="scrollable-main">
        <main>
          <div className="sidebard">
            
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
                <span className="red-notification">{button.unreadMessages}</span>
               )}
                {isUserConnected(button.userId) && <span className="green-dot" />}

                </button>
              ))}
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
                        message.senderId.toString() === senderId ? "right" : "left"
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
                  </div>
                  <div className="overlay-buttons">
                    <button className="prev-btn" onClick={handlePrevImage}>
                      &lt;
                    </button>
                    <button className="next-btn" onClick={handleNextImage}>
                      &gt;
                    </button>
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

export default PatientConsultancyView;
