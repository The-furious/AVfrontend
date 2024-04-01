import React, { useState, useEffect, useRef } from 'react';
import './RadiologistConsultancyView.css';
import image1 from "../images/image1.jpg";
import image2 from "../images/image2.jpg";
import image3 from "../images/image3.jpg";
import { useNavigate } from 'react-router-dom';
import doctor from "../images/doctor.jpg";

const UserProfile = ({ name, photoUrl }) => (
  <div className="user-profile">
    <img src={doctor} alt="Profile" className="profile-photo" />
    <div className="profile-name">{name}</div>
  </div>
);

export const RadiologistConsultancyView = () => {
  const [selectedTab, setSelectedTab] = useState('doctor1');
  const [selectedImage, setSelectedImage] = useState(null);
  const [textInputValue, setTextInputValue] = useState('');
  const [overlayImages, setOverlayImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [chatMessages, setChatMessages] = useState({
    doctor1: [
      { id: 1, text: "Hi, Radiologist!", sender: "doctor" },
      { id: 2, text: "Sure, let's discuss.", sender: "doctor" },
    ],
  });
  const [overlayPosition, setOverlayPosition] = useState({ x: 0, y: 0 });

  const navigate = useNavigate();
  const isRadiologistLoggedIn = sessionStorage.getItem('isRadiologistLoggedIn') === 'true';
  const chatBoxRef = useRef(null);
  const RadiologistId = sessionStorage.getItem('radiologistId');

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
    if (!isRadiologistLoggedIn) {
      navigate('/');
    }
  }, [isRadiologistLoggedIn, navigate]);

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    setSelectedImage(null);
  };

  const handleImageClick = (images, index) => {
    setOverlayImages(images);
    setCurrentIndex(index);
    setSelectedImage(images[index]);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  const handlePrevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? overlayImages.length - 1 : prevIndex - 1));
    setSelectedImage(overlayImages[currentIndex]);
  };

  const handleNextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === overlayImages.length - 1 ? 0 : prevIndex + 1));
    setSelectedImage(overlayImages[currentIndex]);
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  });

  const handleSendMessage = () => {
    if (textInputValue.trim() !== "") {
      const newMessage = {
        id: chatMessages.length + 1,
        text: textInputValue.trim(),
        sender: 'radiologist',
      };
      setChatMessages((prevChatMessages) => ({
        ...prevChatMessages,
        [selectedTab]: [...(prevChatMessages[selectedTab] || []), newMessage],
      }));
      setTextInputValue('');
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    }
  };

  return (
    <div className="radiologist-consulancy-view">
      <div className="scrollable-main">
        <main>
          <div className="sidebar1r">
            <div className="tab-buttonsr">
              <button onClick={() => handleTabClick('doctor1')} className={selectedTab === 'doctor1' ? 'active' : ''}>DOCTOR</button>
            </div>
          </div>
          <div className="content1">
            <div className="user-profile-section">
              {selectedTab && <UserProfile name={selectedTab} photoUrl="" />}
            </div>
            <div className="chat">
              {!selectedImage && selectedTab && (
                <div className="chat-box" ref={chatBoxRef}>
                  {(chatMessages[selectedTab] || []).map((message) => (
                    <div key={message.id} className={`message ${message.sender === 'radiologist' ? 'right' : 'left'}`}>
                      {message.text}
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
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
            {selectedImage && (
              <div className="image-overlay-container">
                <div className="image-overlay">
                  <span className="close-btn" onClick={handleCloseImage}>&times;</span>
                  <div className="overlay-content">
                    <img src={selectedImage} alt="Selected" className="overlay-image" />
                  </div>
                  <div className="overlay-buttons">
                    <button className="prev-btn" onClick={handlePrevImage}>&lt; Previous</button>
                    <button className="next-btn" onClick={handleNextImage}>Next &gt;</button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="sidebar2">
            <div className="image-container">
              <div className="tab-buttons2">
                <button onClick={() => handleImageClick([image1, image2, image3], 0)}><img src={image1} alt="Image 1" /></button>
                <button onClick={() => handleImageClick([image1, image2, image3], 1)}><img src={image2} alt="Image 2" /></button>
                <button onClick={() => handleImageClick([image1, image2, image3], 2)}><img src={image3} alt="Image 3" /></button>
                <button onClick={() => handleImageClick([image1, image2, image3], 0)}><img src={image1} alt="Image 1" /></button>
                <button onClick={() => handleImageClick([image1, image2, image3], 1)}><img src={image2} alt="Image 2" /></button>
                <button onClick={() => handleImageClick([image1, image2, image3], 2)}><img src={image3} alt="Image 3" /></button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RadiologistConsultancyView;
