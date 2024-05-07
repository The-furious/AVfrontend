import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewLabs.css'; // Import CSS file
import EditLabForm from '../LabForm/EditLabForm';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { useNavigate } from 'react-router-dom';

const ViewLabs = () => {
  const navigate = useNavigate();
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedLabIndex, setSelectedLabIndex] = useState(null);
  const [labs, setLabs] = useState([]);

  useEffect(() => {
    // Fetch all labs when the component mounts
    fetchLabs();
  }, []);

  const fetchLabs = async () => {
    try {
      const response = await axios.get('http://localhost:8090/admin/getAllLabs');
      console.log(response.data);
      setLabs(response.data);
    } catch (error) {
      console.error('Error fetching labs:', error);
    }
  };

  const handleCloseEditForm =async () => {
    setShowEditForm(false);

    try {
      const response = await axios.get('http://localhost:8090/admin/getAllLabs');
      setLabs(response.data);
    } catch (error) {
      console.error('Error fetching labs after update:', error);
    }
  };


  const handleEditClick = (index) => {
   
   
    setSelectedLabIndex(index);
    setShowEditForm(true);
  };

  const handleDeleteClick = async (index) => {
    // Use SweetAlert2 to confirm the deletion
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this lab!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`http://localhost:8090/admin/deleteLab/${labs[index].userId}`);
          console.log('Lab deleted successfully:', response.data);
          // Remove the deleted lab from the state
          setLabs(prevLabs => prevLabs.filter((lab, i) => i !== index));
          Swal.fire(
            'Deleted!',
            'The lab has been deleted.',
            'success'
          );
        } catch (error) {
          console.error('Error deleting lab:', error);
          Swal.fire({
            title: 'Error!',
            text: 'An error occurred while deleting the lab.',
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
        <div className="view-lab-container mt-5">
          <div className="row lab-card-container">
            {labs.map((lab, index) => (
              <div key={index} className="col-md-4 mb-4">
                <div className="lab-card">
                <img 
                 src={lab.profilePhotoUrl || 'https://bootdey.com/img/Content/avatar/avatar1.png'} 
                 onError={(e) => {e.target.onerror = null; e.target.src = 'https://bootdey.com/img/Content/avatar/avatar1.png'}} 
                 className="lab-card-img-top" 
                 alt="Profile" 
               />
                  <div className="card-body">
                    <h5 className="lab-card-title">{lab.name}</h5>
                    <p className="lab-card-text"><strong>Email:</strong> {lab.email}</p>
                    <p className="lab-card-text"><strong>Contact Number:</strong> {lab.contactNumber}</p>
                    <p className="lab-card-text"><strong>Address:</strong> {lab.address}</p>
                    <p className="lab-card-text"><strong>Accreditation Number:</strong> {lab.accreditationNumber}</p>
                    <div className="button-group">
                      <button className="update-lab-button" onClick={() => handleEditClick(index)}>Edit Lab</button>
                      <button className="delete-lab-button" >Delete Lab</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
      {showEditForm && labs[selectedLabIndex] && <EditLabForm labId={labs[selectedLabIndex].userId} onCloseEditForm={handleCloseEditForm} />}
    </>
  );
};

export default ViewLabs;
