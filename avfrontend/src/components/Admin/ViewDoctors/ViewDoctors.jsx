import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewDoctors.css'; // Import CSS file
import EditDoctorForm from '../DoctorForm/EditDoctorForm';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { useNavigate } from 'react-router-dom';

const ViewDoctors = () => {
  const navigate = useNavigate();
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedDoctorIndex, setSelectedDoctorIndex] = useState(null);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    // Fetch all doctors when the component mounts
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:8090/admin/getAllDoctors');
      console.log(response.data);
      setDoctors(response.data);
      doctors.map((doctor, index) => {
        console.log(doctor.profilePhotoUrl); // Log the doctor object
        
      })
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleEditClick = (index) => {
    setSelectedDoctorIndex(index);
    setShowEditForm(true);
  };
 
  const handleCloseEditForm =async () => {
    setShowEditForm(false);

    try {
      const response = await axios.get('http://localhost:8090/admin/getAllDoctors');
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors after update:', error);
    }
  };



  const handleDeleteClick = async (index) => {
    // Use SweetAlert2 to confirm the deletion
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this doctor!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = sessionStorage.getItem('jwtToken');
          const response = await axios.delete(
            `http://localhost:8090/admin/deleteDoctor/${doctors[index].userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              }
            }
          );
          // Remove the deleted doctor from the state
          setDoctors(prevDoctors => prevDoctors.filter((doctor, i) => i !== index));
          Swal.fire(
            'Deleted!',
            'The doctor has been deleted.',
            'success'
          );
        } catch (error) {
          console.error('Error deleting doctor:', error);
          Swal.fire({
            title: 'Error!',
            text: 'An error occurred while deleting the doctor.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
      }
    });
  };



  return (
    <>
      {!showEditForm && 
        <div className="view-doctor-container mt-5">
          <div className="row doctor-card-container">
            {doctors.map((doctor, index) => (
              <div key={index} className="col-md-4 mb-4">
                <div className="doctor-card">
                <img 
                  src={doctor.profilePhotoUrl || 'https://bootdey.com/img/Content/avatar/avatar1.png'} 
                  onError={(e) => {e.target.onerror = null; e.target.src = 'https://bootdey.com/img/Content/avatar/avatar1.png'}} 
                  className="doctor-card-img-top" 
                   alt="Profile" 
                />
                  <div className="card-body">
                    <h5 className="doctor-card-title">{doctor.name}</h5>
                    <p className="doctor-card-text"><strong>Email:</strong> {doctor.email}</p>
                    <p className="doctor-card-text"><strong>Contact Number:</strong> {doctor.contactNumber}</p>
                    <p className="doctor-card-text"><strong>Address:</strong> {doctor.address}</p>
                    <p className="doctor-card-text"><strong>Specialty:</strong> {doctor.specialty}</p>
                    <p className="doctor-card-text"><strong>Registration Number:</strong> {doctor.registrationNumber}</p>
                    <div className="button-group">
                      <button className="update-doctor-button" onClick={() => handleEditClick(index)}>Edit</button>
                      <button className="delete-doctor-button" >Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
      {showEditForm && doctors[selectedDoctorIndex] && <EditDoctorForm doctorId={doctors[selectedDoctorIndex].userId} onCloseEditForm={handleCloseEditForm}  />}
    </>
  );
};

export default ViewDoctors;
