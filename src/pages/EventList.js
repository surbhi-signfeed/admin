import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import Sidebar from '../Components/Sidebar';
import Navbarfg from '../Components/Navbar';


import '../App.css';

function EventList({events}) {
  const navigate = useNavigate();
  useEffect(()=>{
    if(sessionStorage.getItem("userData") == null)
    {
      navigate('/')
    }
  },[])
    const [blogId, setBlogId] = useState(null);
  const [properties, setProperties] = useState([]);
  
  useEffect(() => {
          // Fetch data from the API when the component mounts
          const fetchProperties = async () => {
            try {
              const response = await axios.get('http://localhost:4000/api/event-list');
              setProperties(response.data);
            } catch (error) {
              console.error('Error fetching properties data:', error);
            }
          };
      
          fetchProperties();
        }, []);
      
        const handleDelete = async (id) => {
          try {
            const response = await axios.delete(`http://localhost:4000/api/delete-events/${id}`);
            if (response.data.message) {
              alert('Event deleted successfully!');
              // Remove the deleted event from the state
              setProperties(properties.filter(event => event.id !== id));
            } else {
              alert('Failed to delete the event.');
            }
          } catch (error) {
            console.error('Error deleting event:', error);
            alert('An error occurred while deleting the event.');
          }
        };
    

        const handleEdit = (propertyId) => {
          navigate(`/Editeevents/${propertyId}`);
        };
  return (
    <div>
      <div id="wrapper">
        <Sidebar />
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <Navbarfg />
            <div className="container-fluid scrollable-content">
              <div className="container-fluid">
                <div className="mb-4">
                  <div className='propertys-div'>
                    <h1 className="h3 mb-0 text-white text-center pt-3">Events Details</h1>

                  </div>
                  <div className='mt-5'>
                  <table id="example" className="table table-striped table-bordered">
        <thead>
          <tr>
            <th className="bl5">Title</th>
            <th className="bl5">Venue</th>
            <th className="bl5">Organiser</th>
            <th className="bl5">Action</th>
         
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr key={property.id}>
              <td>{property.title}</td>
              <td>{property.venue}</td>
              <td>{property.organiser}</td>
              <td> <button type="button" className="btn btn-dark mt-3 px-5 mb-3"  onClick={() => handleDelete(property.id)} >Delete</button>
              &nbsp;
    <button className="btn btn-primary" onClick={() => handleEdit(property.id)}>
                Edit
              </button></td>
        
            </tr>
          ))}
        </tbody>
      </table>
                  </div>

                </div>



              </div>
            </div>

          </div>
        </div>
        <a className="scroll-to-top rounded" href="#page-top">
          <i className="fas fa-angle-up"></i>
        </a>
      </div>
    </div>
  );
}

export default EventList;
