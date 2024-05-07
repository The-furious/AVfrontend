import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; 
import { useNavigate } from 'react-router-dom';

function EditDoctorForm({ doctorId, onCloseEditForm }) {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    contactNumber: '',
    address: '',
    specialty: '',
    registrationNumber: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`http://localhost:8090/doctor/get/${doctorId}`);
        const doctorData = response.data;
        setFormData({
          ...doctorData,
          email: doctorData.email || '',
          contactNumber: doctorData.contactNumber || '',
          address: doctorData.address || ''
        });
      } catch (error) {
        console.error('Error fetching doctor:', error);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('jwtToken');
      const response = await axios.put(`http://localhost:8090/admin/updateDoctor/${doctorId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate(`/admin-dashboard/:admin/`);
      onCloseEditForm();
      setErrorMessage('');
      
      // Show success alert
      Swal.fire({
        title: 'Success!',
        text: 'Doctor details updated successfully!',
        icon: 'success',
        confirmButtonText: 'Ok'
      });
    } catch (error) {
      console.error('Error submitting form:', error.response);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('An error occurred while submitting the form. Please try again later.');
      }
      onCloseEditForm();
      navigate(`/admin-dashboard/:admin/`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="container">
      <h1>Edit Doctor Details</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="contactNumber">Contact Number:</label>
          <input
            type="text"
            id="contactNumber"
            className="form-control"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            className="form-control"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Update</button>
      </form>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
}

export default EditDoctorForm;
