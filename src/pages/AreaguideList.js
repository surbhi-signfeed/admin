import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import Sidebar from '../Components/Sidebar';
import Navbarfg from '../Components/Navbar';
import Swal from 'sweetalert2';


import '../App.css';

function AreaguideList({events}) {
  const navigate = useNavigate();
  useEffect(()=>{
    if(sessionStorage.getItem("userData") == null)
    {
      navigate('/')
    }
  },[])
  
  
function Out(){
  sessionStorage.removeItem('data');
  navigate("/Login")
}

  const [blogId, setBlogId] = useState(null);
  const [properties, setProperties] = useState([]);
  useEffect(() => {
          // Fetch data from the API when the component mounts
          const fetchProperties = async () => {
            try {
              const response = await axios.get('http://localhost:4000/api/get-areaguide');
              setProperties(response.data);
            } catch (error) {
              console.error('Error fetching properties data:', error);
            }
          };
      
          fetchProperties();
        }, []);
      
        const handleDelete = async (property) => {
          // Show confirmation dialog
          const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete the property with ID ${property.id}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
          });
      
          if (result.isConfirmed) {
            try {
              // Make DELETE request to the API
              const response = await axios.delete(`http://localhost:4000/api/areaguide/${property.id}`);
              
              if (response.status === 200) {
                setProperties(properties.filter((p) => p.id !== property.id));
                // Show success message
                Swal.fire('Deleted!', 'The property has been deleted.', 'success');
              } else {
                // Show error message if the response is not successful
                Swal.fire('Error!', 'There was a problem deleting the property.', 'error');
              }
            } catch (error) {
              console.error('Failed to delete data', error);
              // Show error message
              Swal.fire('Error!', 'There was a problem deleting the property.', 'error');
            }
          }
        };
            
        const handleEdit = (propertyId) => {
          navigate(`/Editeareaguide/${propertyId}`);
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
                    <h1 className="h3 mb-0 text-white text-center pt-3">Area-Guide Details</h1>

                  </div>
                  <div className='mt-5'>
                  <table id="example" className="table table-striped table-bordered table-responsive">
        <thead>
          <tr>
            <th className="bl5">Title</th>
            <th className="bl5">description</th>
            <th className="bl5">image</th>
            <th className="bl5">Action</th>
            <th className="bl5">Edit</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr key={property.id}>
              <td>{property.title}</td>
              <td>{property.description}</td>
              <td>{<img src={property.featureImage} style={{width:"100px",height:"auto"}}></img>}</td>

              <td>
              <button className="btn btn-danger" onClick={() => handleDelete(property)}>
     Delete
    </button>
   
   </td>
   <td>   <button className="btn btn-primary" onClick={() => handleEdit(property.id)}>
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

export default AreaguideList;
