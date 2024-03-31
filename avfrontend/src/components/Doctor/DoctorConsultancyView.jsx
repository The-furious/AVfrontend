import React, { useState,useEffect ,useRef } from 'react';
import './DoctorConsultancyView.css';
import image1 from "../images/image1.jpg";
import image2 from "../images/image2.jpg";
import image3 from "../images/image3.jpg";
import { useNavigate } from 'react-router-dom';


export const DoctorConsultancyView = () => {
    const [selectedTab, setSelectedTab] = useState('patient');
    const [selectedImage, setSelectedImage] = useState(null);
    const [textInputValue, setTextInputValue] = useState('');
    const [overlayImages, setOverlayImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
   
    const [zoomLevel, setZoomLevel] = useState(1);
    const [overlayPosition, setOverlayPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const navigate = useNavigate();
    const isDoctorLoggedIn = sessionStorage.getItem('isDoctorLoggedIn') === 'true';
    const chatBoxRef = useRef(null);

    const [chatMessages, setChatMessages] = useState([
        { id: 1, text: "Hello!", sender: "patient" },
        { id: 2, text: "Hi, Doctor!", sender: "doctor" },
        { id: 3, text: "How can I help you today?", sender: "doctor" },
        { id: 4, text: "I have some medical reports to discuss.", sender: "patient" },
        { id: 5, text: "Sure, please send them over.", sender: "doctor" },
    ]);

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
          navigate('/');
      }
  }, [isDoctorLoggedIn, navigate]);
  
    const handleTabClick = (tab) => {
      setSelectedTab(tab);
      // Reset selected image when switching tabs
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

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - overlayPosition.x, y: e.clientY - overlayPosition.y });
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
        cursor: isDragging ? 'grabbing' : 'grab',
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
                sender: 'doctor', // Assuming the sender is the doctor
            };
            setChatMessages([...chatMessages, newMessage]);
            setTextInputValue('');

            if (chatBoxRef.current) {
                chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
            }


            
        }
    };
  
    return (
      <div className="doctor-consulancy-view">
        <div className="scrollable-main">
        <main>
          <div className="sidebar1">
            <div className="tab-buttons">
              <button onClick={() => handleTabClick('patient')} className={selectedTab === 'patient' ? 'active' : ''}>Patient</button>
              <button onClick={() => handleTabClick('radiologist1')} className={selectedTab === 'radiologist1' ? 'active' : ''}>Radiologist 1</button>
              <button onClick={() => handleTabClick('radiologist2')} className={selectedTab === 'radiologist2' ? 'active' : ''}>Radiologist 2</button>
            </div>
          </div>
          <div className="content1">
          
          {selectedImage && (
    <div className="image-overlay-container" style={overlayContainerStyle} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <div className="image-overlay">
        <span className="close-btn" onClick={handleCloseImage}>&times;</span>
        <div className="overlay-content">
          <img src={selectedImage} alt="Selected" className="overlay-image" />
        </div>
        <div className="overlay-buttons">
                                    <button className="zoom-in-btn" onClick={() => setZoomLevel((prevZoomLevel) => prevZoomLevel + 0.1)}>Zoom In</button>
                                    <button className="zoom-out-btn" onClick={() => setZoomLevel((prevZoomLevel) => prevZoomLevel - 0.1)}>Zoom Out</button>
                                    <button className="prev-btn" onClick={handlePrevImage}>&lt; Previous</button>
                                    <button className="next-btn" onClick={handleNextImage}>Next &gt;</button>
                                </div>
        <div className="annotations">
          {/* Add your annotation content here */}
          <p>This is an annotation for the selected image.</p>
        </div>
      </div>
    </div>
  )}
  {!selectedImage && (
    <div className="chat-box"  ref={chatBoxRef}>
    {chatMessages.map((message) => (
        <div key={message.id} className={`message ${message.sender === 'doctor' ? 'right' : 'left'}`}>
            {message.text}
        </div>
    ))}
</div>
    )}
  
  
  
             <div className="text-input">
              <textarea
                type="text"
                placeholder="Type your message here..."
                value={textInputValue}
                onChange={(e) => setTextInputValue(e.target.value)}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
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
  }
  
export default DoctorConsultancyView;
