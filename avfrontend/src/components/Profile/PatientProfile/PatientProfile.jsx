import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './PatientProfile.css'; // Assuming you have PatientProfile.css
import Swal from 'sweetalert2';

const PatientProfile = () => {
  const [userData, setUserData] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    contactNumber: '',
    address: '',
    weight: '',
    height: '',
    bloodGroup: '',
    emergencyContact: '',
    state: '',
    country: '',
    pincode: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = sessionStorage.getItem('PatientUserId');
        const response = await fetch(`http://localhost:8090/patient/get/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUserData(data);
        setFormData({
          email: data.email,
          contactNumber: data.contactNumber,
          address: data.address,
          weight: data.weight,
          height: data.height,
          bloodGroup: data.bloodGroup,
          emergencyContact: data.emergencyContact,
          state: data.state,
          country: data.country,
          pincode: data.pincode
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleImageChange = (event) => {
    setProfilePic(event.target.files[0]);
  };

  const uploadImage = async () => {
    try {
      const userId = sessionStorage.getItem('PatientUserId');
      const formData = new FormData();
      formData.append('file', profilePic);
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.put(`http://localhost:8090/patient/updateProfilePic/${userId}`, formData, {
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
      const userId = sessionStorage.getItem('PatientUserId');
      const token = sessionStorage.getItem("jwtToken");
      const updatedData = { ...userData, ...formData };
      console.log(updatedData)
      const response = await axios.put(`http://localhost:8090/patient/update/${userId}`, updatedData, {
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
    <div className="patientContainer">
      {userData && (
        <>
          <div className="patient-profilepic-Column">
            <div className="patientUserData">
              <img className="patientProfilePhoto" src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="https://bootdey.com/img/Content/avatar/avatar1.png" />
              <p><strong>Username:</strong> {userData.username}</p>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              <button className="patient-image-Button" onClick={uploadImage}>Upload Picture</button>
            </div>
          </div>
          <div className="patient-details-Column">
            <div className="patientUserData">
              <label><strong>Email:</strong></label>
              <input type="text" value={userData.email} readOnly />
              <label><strong>Name:</strong></label>
              <input type="text" value={userData.name} readOnly />
              <label><strong>Contact Number:</strong></label>
              <input type="text" value={userData.contactNumber} readOnly />
              <label><strong>Address:</strong></label>
              <input type="text" value={userData.address} readOnly />
              <label><strong>Weight:</strong></label>
              <input type="text" value={userData.weight} readOnly />
              <label><strong>Height:</strong></label>
              <input type="text" value={userData.height} readOnly />
              <label><strong>Blood Group:</strong></label>
              <input type="text" value={userData.bloodGroup} readOnly />
              <label><strong>Emergency Contact:</strong></label>
              <input type="text" value={userData.emergencyContact} readOnly />
              <label><strong>State:</strong></label>
              <input type="text" value={userData.state} readOnly />
              <label><strong>Country:</strong></label>
              <input type="text" value={userData.country} readOnly />
              <label><strong>Pincode:</strong></label>
              <input type="text" value={userData.pincode} readOnly />
              <button className="patient-Profile-EditButton" onClick={toggleEditMode}>Edit Details</button>
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
              <label>Weight:</label>
              <input type="text" name="weight" value={formData.weight} onChange={handleInputChange} />
              <label>Height:</label>
              <input type="text" name="height" value={formData.height} onChange={handleInputChange} />
              <label>Blood Group:</label>
              <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} />
              <label>Emergency Contact:</label>
              <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} />
              <label>State:</label>
              <input type="text" name="state" value={formData.state} onChange={handleInputChange} />
              <label>Country:</label>
              <input type="text" name="country" value={formData.country} onChange={handleInputChange} />
              <label>Pincode:</label>
              <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} />
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

export default PatientProfile;
