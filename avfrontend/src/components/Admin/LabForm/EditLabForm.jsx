import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; 
import { useNavigate } from 'react-router-dom';

function EditLabForm({ labId, onCloseEditForm }) {
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
    const fetchLab = async () => {
      try {
        const response = await axios.get(`http://localhost:8090/lab/get/${labId}`);
        const labData = response.data;
        setFormData({
          ...labData,
          email: labData.email || '',
          contactNumber: labData.contactNumber || '',
          address: labData.address || ''
        });
      } catch (error) {
        console.error('Error fetching lab:', error);
      }
    };

    fetchLab();
  }, [labId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('jwtToken');
      const response = await axios.put(`http://localhost:8090/lab/update/${labId}`, formData, {
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
        text: 'Lab details updated successfully!',
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
      <h1>Edit Lab Details</h1>
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

export default EditLabForm;
