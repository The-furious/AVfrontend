import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './RadiologistProfile.css'; // Assuming you have RadiologistProfile.css
import Swal from 'sweetalert2';

const RadiologistProfile = () => {
  const [userData, setUserData] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    contactNumber: '',
    address: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = sessionStorage.getItem('RadiologistUserId');
        const response = await fetch(`http://localhost:8090/radiologist/get/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUserData(data);
        setFormData({
          email: data.email,
          contactNumber: data.contactNumber,
          address: data.address
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);
  const fetchUserData = async () => {
    try {
      const userId = sessionStorage.getItem('RadiologistUserId');
      const response = await fetch(`http://localhost:8090/radiologist/get/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setUserData(data);
      setFormData({
        email: data.email,
        contactNumber: data.contactNumber,
        address: data.address
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  const handleImageChange = (event) => {
    setProfilePic(event.target.files[0]);
  };

  const uploadImage = async () => {
    try {
      const userId = sessionStorage.getItem('RadiologistUserId');
      const formData = new FormData();
      formData.append('file', profilePic);
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.put(`http://localhost:8090/radiologist/updateProfilePic/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.error) {
        throw new Error('Failed to upload image');
      }
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Profile image uploaded successfully!',
      });
      fetchUserData()
    } catch (error) {
      console.error('Error uploading image:', error);

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error uploading profile image!',
      });
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const submitForm = async (event) => {
    event.preventDefault();
    try {
      const userId = sessionStorage.getItem('RadiologistUserId');
      const token = sessionStorage.getItem("jwtToken");
      const updatedData = { ...userData, ...formData };
      console.log(updatedData)
      const response = await axios.put(`http://localhost:8090/radiologist/update/${userId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data && response.data.error) {
        throw new Error('Failed to update user details');
      }

      setUserData(updatedData);
      toggleEditMode();
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'User details updated successfully!',
      });
    } catch (error) {
      console.error('Error updating user details:', error);

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error updating user details!',
      });
    }
  };

  return (
    <div className="radiologistContainer">
      {userData && (
        <>
          <div className="radiologist-profilepic-Column">
            <div className="radiologistUserData">
              <img className="radiologistProfilePhoto" src={`${userData.profilePhotoUrl}`}  alt="https://bootdey.com/img/Content/avatar/avatar1.png" />
              <p><strong>Username:</strong> {userData.username}</p>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              <button className="radiologist-image-Button" onClick={uploadImage}>Upload Picture</button>
            </div>
          </div>
          <div className="radiologist-details-Column">
            <div className="radiologistUserData">
              <label><strong>Email:</strong></label>
              <input type="text" value={userData.email} readOnly />
              <label><strong>Name:</strong></label>
              <input type="text" value={userData.name} readOnly />
              <label><strong>Contact Number:</strong></label>
              <input type="text" value={userData.contactNumber} readOnly />
              <label><strong>Address:</strong></label>
              <input type="text" value={userData.address} readOnly />
              <label><strong>License Number:</strong></label>
              <input type="text" value={userData.licenseNumber} readOnly />
              <button className="radiologist-Profile-EditButton" onClick={toggleEditMode}>Edit Details</button>
            </div>
          </div>
          <Modal
            isOpen={editMode}
            onRequestClose={toggleEditMode}
            contentLabel="Edit User Details"
           
          >
            <h2>Edit User Details</h2>
            <form onSubmit={submitForm}>
              <label>Email:</label>
              <input type="text" name="email" value={formData.email} onChange={handleInputChange} />
              <label>Contact Number:</label>
              <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} />
              <label>Address:</label>
              <input type="text" name="address" value={formData.address} onChange={handleInputChange} />
              <div className="modal-buttons">
                <button type="submit">Save</button>
                <button type="button" onClick={toggleEditMode}>Cancel</button>
              </div>
            </form>
          </Modal>
        </>
      )}
    </div>
  );
};

export default RadiologistProfile;
