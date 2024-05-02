// LiaImagesSolid.js
import React from "react";
import PropTypes from "prop-types";

const LiaImagesSolid = ({ setSelectedImage, overlayImages }) => {
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  return (
    <div>
      {overlayImages.map((image, index) => (
        <img
          key={index}
          src={image.imageUrl}
          alt={image.alt}
          onClick={() => handleImageClick(image.imageUrl)}
        />
      ))}
    </div>
  );
};

LiaImagesSolid.propTypes = {
  setSelectedImage: PropTypes.func.isRequired,
  overlayImages: PropTypes.arrayOf(
    PropTypes.shape({
      imageUrl: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default LiaImagesSolid;
