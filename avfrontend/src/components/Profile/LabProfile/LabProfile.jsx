import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './LabProfile.css'; // Assuming you have LabProfile.css
import Swal from 'sweetalert2';
import { Password } from '@mui/icons-material';

const LabProfile = () => {
  const [labData, setLabData] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    contactNumber: '',
    address: ''
  });

  useEffect(() => {
    const fetchLabData = async () => {
      try {
        const labId = sessionStorage.getItem('LabUserId');
        const response = await fetch(`http://localhost:8090/lab/get/${labId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch lab data');
        }
        const data = await response.json();
        setLabData(data);
        setFormData({
          email: data.email,
          contactNumber: data.contactNumber,
          address: data.address
        });
      } catch (error) {
        console.error('Error fetching lab data:', error);
      }
    };

    fetchLabData();
  }, []);

  const fetchLabData = async () => {
    try {
      const labId = sessionStorage.getItem('LabUserId');
      const response = await fetch(`http://localhost:8090/lab/get/${labId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch lab data');
      }
      const data = await response.json();
      setLabData(data);
      setFormData({
        email: data.email,
        contactNumber: data.contactNumber,
        address: data.address
      });
    } catch (error) {
      console.error('Error fetching lab data:', error);
    }
  };

  const handleImageChange = (event) => {
    setProfilePic(event.target.files[0]);
  };

  const uploadImage = async () => {
    try {
      const labId = sessionStorage.getItem('LabUserId');
      const formData = new FormData();
      formData.append('file', profilePic);
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.put(`http://localhost:8090/lab/updateProfilePic/${labId}`, formData, {
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
      fetchLabData()
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
      [name]: value,
    });
  };

  const submitForm = async (event) => {
    event.preventDefault();
    try {
      const labId = sessionStorage.getItem('LabUserId');
      const token = sessionStorage.getItem("jwtToken");
      const updatedData = { ...labData, ...formData};
      console.log(updatedData);
      const response = await axios.put(`http://localhost:8090/lab/update/${labId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
     
      if (response.data && response.data.error) {
        throw new Error('Failed to update lab details');
      }

      setLabData(updatedData);
      toggleEditMode();
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Lab details updated successfully!',
      });
    } catch (error) {
      console.error('Error updating lab details:', error);

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error updating lab details!',
      });
    }
  };

  return (
    <div className="labContainer">
      {labData && (
        <>
          <div className="lab-profilepic-Column">
            <div className="labUserData">
              <img className="labProfilePhoto" src={`${labData.profilePhotoUrl}`} alt="profile photo" />
              <p><strong>Username:</strong> {labData.username}</p>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              <button className="lab-image-Button" onClick={uploadImage}>Upload Picture</button>
            </div>
          </div>
          <div className="lab-details-Column">
            <div className="labUserData">
              <label><strong>Email:</strong></label>
              <input type="text" value={labData.email} readOnly />
              <label><strong>Name:</strong></label>
              <input type="text" value={labData.name} readOnly />
              <label><strong>Contact Number:</strong></label>
              <input type="text" value={labData.contactNumber} readOnly />
              <label><strong>Address:</strong></label>
              <input type="text" value={labData.address} readOnly />
              <label><strong>Accreditation Number:</strong></label>
              <input type="text" value={labData.accreditationNumber} readOnly />
              <button className="lab-Profile-EditButton" onClick={toggleEditMode}>Edit Details</button>
              
            </div>
          </div>
          <Modal
            isOpen={editMode}
            onRequestClose={toggleEditMode}
            contentLabel="Edit Lab Details"
          >
            <h2>Edit Lab Details</h2>
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

export default LabProfile;
