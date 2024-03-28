import React, { useState,useEffect } from 'react';
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
    const navigate = useNavigate();
    const isDoctorLoggedIn = sessionStorage.getItem('isDoctorLoggedIn') === 'true';
    

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
  
    const handleSendMessage = () => {
      if (textInputValue.trim() !== "") {
        // Handle sending message here
        console.log("Message sent:", textInputValue);
        // Clear text input after sending message
        setTextInputValue('');
      }
    };
  
    const handlePrevImage = () => {
      setCurrentIndex((prevIndex) => (prevIndex === 0 ? overlayImages.length - 1 : prevIndex - 1));
      setSelectedImage(overlayImages[currentIndex]);
    };
  
    const handleNextImage = () => {
      setCurrentIndex((prevIndex) => (prevIndex === overlayImages.length - 1 ? 0 : prevIndex + 1));
      setSelectedImage(overlayImages[currentIndex]);
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
        <div className="annotations">
          {/* Add your annotation content here */}
          <p>This is an annotation for the selected image.</p>
        </div>
      </div>
    </div>
  )}
  {!selectedImage && (
    <div className="chat-box">
              {/* Render chat messages here */}
              <div className="message">Chat message 1</div>
              <div className="message">Chat message 2</div>
              <div className="message">Chat message 2</div>
              <div className="message">Chat message 2</div>
              <div className="message">Chat message 2</div>
              <div className="message">Chat message 2</div>
              <div className="message">Chat message 2</div>
              <div className="message">Chat message 2</div>
              <div className="message">Chat message 1</div>
              <div className="message">Chat message 2</div>
              <div className="message">Chat message 2</div>
              <div className="message">Chat message 2</div>
              <div className="message">Chat message 2</div>
              <div className="message">Chat message 2</div>
              <div className="message">Chat message 2</div>
              <div className="message">Chat message 2</div>
              <div className="message">Chat message 1</div>
              <div className="message">Chat message 2</div>
              <div className="message">Chat message 2</div>
              <div className="message">Chat message 2</div>
              <div className="message">Chat message 2</div>
              <div className="message">Chat message 2</div>
              <div className="message">Chat message 2</div>
              <div className="message">Chat message 2</div>

              {/* Add more chat messages as needed */}
    </div>
    )}
  
  
  
             <div className="text-input">
              <input
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
