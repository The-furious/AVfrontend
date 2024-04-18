import React, { useState, useEffect, useRef } from 'react';
import './RadiologistConsultancyView.css';
import image1 from "../images/image1.jpg";
import image2 from "../images/image2.jpg";
import image3 from "../images/image3.jpg";
import doctor from "../images/doctor.jpg";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTimes, faSearchPlus, faSearchMinus } from '@fortawesome/free-solid-svg-icons';

const UserProfile = ({ name, photoUrl }) => (
  <div className="user-profile">
    <img src={doctor} alt="Profile" className="profile-photo" />
    <div className="profile-name">{name}</div>
  </div>
);

export const RadiologistConsultancyView = () => {
  const [selectedTab, setSelectedTab] = useState('doctor1');
  const [selectedImage, setSelectedImage] = useState(null);
  const [chatTextInputValue, setChatTextInputValue] = useState('');
  const [annotationTextInputValue, setAnnotationTextInputValue] = useState('');
  const [overlayImages, setOverlayImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [chatMessages, setChatMessages] = useState({
    doctor1: [
      { id: 1, text: "Hi, Radiologist!", sender: "doctor" },
      { id: 2, text: "Sure, let's discuss.", sender: "doctor" },
    ],
  });
  const [annotations, setAnnotations] = useState({});
  const [zoomLevel, setZoomLevel] = useState(1);
  const [overlayPosition, setOverlayPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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
    setChatTextInputValue('');
    setAnnotationTextInputValue('');
  };

  const handleImageClick = (images, index) => {
    setOverlayImages(images);
    setCurrentIndex(index);
    setSelectedImage(images[index]);
    setAnnotationTextInputValue(annotations[index] || '');
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
    setChatTextInputValue('');
    setAnnotationTextInputValue('');
  };

  const handlePrevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? overlayImages.length - 1 : prevIndex - 1));
    setSelectedImage(overlayImages[currentIndex]);
    setAnnotationTextInputValue(annotations[currentIndex] || '');
  };

  const handleNextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex === overlayImages.length - 1 ? 0 : prevIndex + 1));
    setSelectedImage(overlayImages[currentIndex]);
    setAnnotationTextInputValue(annotations[currentIndex] || '');
  };

  const handleSendChatMessage = () => {
    if (chatTextInputValue.trim() !== "") {
      const newMessage = {
        id: chatMessages.length + 1,
        text: chatTextInputValue.trim(),
        sender: 'radiologist',
      };
      setChatMessages((prevChatMessages) => ({
        ...prevChatMessages,
        [selectedTab]: [...(prevChatMessages[selectedTab] || []), newMessage],
      }));
      setChatTextInputValue('');
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    }
  };

  const handleSendAnnotation = () => {
    if (annotationTextInputValue.trim() !== "") {
      setAnnotations((prevAnnotations) => ({
        ...prevAnnotations,
        [currentIndex]: annotationTextInputValue.trim(),
      }));
      setAnnotationTextInputValue('');
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((prevZoomLevel) => prevZoomLevel + 0.1);
  };

  const handleZoomOut = () => {
    setZoomLevel((prevZoomLevel) => prevZoomLevel - 0.1);
  };

  const handleMouseDown = (event) => {
    setIsDragging(true);
    const offsetX = event.clientX - overlayPosition.x;
    const offsetY = event.clientY - overlayPosition.y;
    setDragOffset({ x: offsetX, y: offsetY });
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      const newX = event.clientX - dragOffset.x;
      const newY = event.clientY - dragOffset.y;
      setOverlayPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  });

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
                value={chatTextInputValue}
                onChange={(e) => setChatTextInputValue(e.target.value)}
              />
              <button onClick={handleSendChatMessage}>Send Chat Message</button>
            </div>
            {selectedImage && (
              <div
                className="image-overlay-container"
                style={{ left: overlayPosition.x, top: overlayPosition.y }}
                onMouseDown={handleMouseDown}
              >
                <span className="close-btn" onClick={handleCloseImage}>
                  <FontAwesomeIcon icon={faTimes} className="close-icon" />
                </span>
                <div className="image-overlay">
                  <div className="overlay-content">
                    <img src={selectedImage} alt="Selected" className="overlay-image" style={{ transform: `scale(${zoomLevel})` }} />
                  </div>
                  <div className="icon-container left">
                    <button className="prev-btn" onClick={handlePrevImage}>
                      <FontAwesomeIcon icon={faChevronLeft} size="sm" />
                    </button>
                  </div>
                  <div className="icon-container right">
                    <button className="next-btn" onClick={handleNextImage}>
                      <FontAwesomeIcon icon={faChevronRight} size="sm" />
                    </button>
                  </div>
                  <div>
                    <div className="zoom-icon-box plus-icon" onClick={handleZoomIn}>
                      <FontAwesomeIcon icon={faSearchPlus} className="zoom-icon" />
                    </div>
                    <div className="zoom-icon-box minus-icon" onClick={handleZoomOut}>
                      <FontAwesomeIcon icon={faSearchMinus} className="zoom-icon" />
                    </div>
                  </div>
                  <div className="annotations">
                    <div className="annotation-input-container">
                      <textarea
                        type="text"
                        placeholder="Enter annotation..."
                        value={annotationTextInputValue}
                        onChange={(e) => setAnnotationTextInputValue(e.target.value)}
                      />
                      <button className="send-annotation-button" onClick={handleSendAnnotation}>Send</button>
                    </div>
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
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RadiologistConsultancyView;
