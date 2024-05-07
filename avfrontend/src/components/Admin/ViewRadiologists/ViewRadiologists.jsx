import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditRadiologistForm from '../RadiologistForm/EditRadiologistForm';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './ViewRadiologists.css'

const ViewRadiologists = () => {
  const navigate = useNavigate();
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedRadiologistIndex, setSelectedRadiologistIndex] = useState(null);
  const [radiologists, setRadiologists] = useState([]);

  useEffect(() => {
    fetchRadiologists();
  }, []);

  const fetchRadiologists = async () => {
    try {
      const response = await axios.get('http://localhost:8090/admin/getAllRadiologist');
      console.log(response);
      setRadiologists(response.data);
    } catch (error) {
      console.error('Error fetching radiologists:', error);
    }
  };

  const handleEditClick = (index) => {
    setSelectedRadiologistIndex(index);
    setShowEditForm(true);
  };

  const handleDeleteClick = async (index) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this radiologist!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`http://localhost:8090/admin/deleteRadiologist/${radiologists[index].userId}`);
          setRadiologists(prevRadiologists => prevRadiologists.filter((radiologist, i) => i !== index));
          Swal.fire('Deleted!', 'The radiologist has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting radiologist:', error);
          Swal.fire({ title: 'Error!', text: 'An error occurred while deleting the radiologist.', icon: 'error', confirmButtonText: 'Ok' });
        }
      }
    });
  };

  const handleCloseEditForm =async () => {
    setShowEditForm(false);

    try {
      const response = await axios.get('http://localhost:8090/admin/getAllRadiologist');
      setRadiologists(response.data);
    } catch (error) {
      console.error('Error fetching radiologists after update:', error);
    }
  };

  return (
    <>
      {!showEditForm && 
        <div className="view-radiologist-container mt-5">
        
          <div className="row radiologist-card-container">
            {radiologists.map((radiologist, index) => (
              <div key={index} className="col-md-4 mb-4">
                <div className="radiologist-card">
                  
                <img 
                 src={radiologist.profilePhotoUrl || 'https://bootdey.com/img/Content/avatar/avatar1.png'} 
                 onError={(e) => {e.target.onerror = null; e.target.src = 'https://bootdey.com/img/Content/avatar/avatar1.png'}} 
                 className="doctor-card-img-top" 
                 alt="Profile" 
               />
                  <div className="card-body">
                    <h5 className="radiologist-card-title">{radiologist.name}</h5>
                    <p className="radiologist-card-text"><strong>Email:</strong> {radiologist.email}</p>
                    <p className="radiologist-card-text"><strong>Contact Number:</strong> {radiologist.contactNumber}</p>
                    <p className="radiologist-card-text"><strong>Address:</strong> {radiologist.address}</p>
                    <p className="radiologist-card-text"><strong>Specialization:</strong> {radiologist.specialization}</p>
                    <p className="radiologist-card-text"><strong>License Number:</strong> {radiologist.licenseNumber}</p>
                    <div className="button-group">
                      <button className="update-radiologist-button" onClick={() => handleEditClick(index)}>Edit</button>
                      <button className="delete-radiologist-button" >Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
      {showEditForm && radiologists[selectedRadiologistIndex] && <EditRadiologistForm radiologistId={radiologists[selectedRadiologistIndex].userId}  onCloseEditForm={handleCloseEditForm} />}
    </>
  );
};

export default ViewRadiologists;
