import React, { useEffect } from 'react'
import ImageUploadForm from './ImageUploadForm'
import { useNavigate } from 'react-router-dom';
import "./LabTechnician.css";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
export const LabTechnicianDashboard = () => {
  const isLabLoggedIn = sessionStorage.getItem('isLabLoggedIn') === 'true';
    const LabId=sessionStorage.getItem('LabId'); 
    const navigate = useNavigate(); 
    useEffect(() => {
      if (!isLabLoggedIn) {
          navigate('/');
      }
  }, [isLabLoggedIn, navigate]);
  return (
      <div className="container-fluid" >
            <div className="lab-dashboard-sidebar">
            <ul className="lab-sidebar-list" style={{ listStyle: 'none'}}>
                  <li>
                    <button className='sidebar-tab'>
                      <span>
                        <AccessTimeIcon />
                      </span>
                      History
                    </button>
                  </li>
            </ul>
            </div>
            <div className="lab-dashboard-content">
              <h2>Upload Image</h2>
              <ImageUploadForm/>
            </div>
        </div>
  )
}
