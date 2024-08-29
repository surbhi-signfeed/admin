import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import Sidebar from '../Components/Sidebar';
import Navbarfg from '../Components/Navbar';


import '../App.css';

function Career() {
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
        const response = await axios.get('http://localhost:4000/api/career');
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties data:', error);
      }
    };

    fetchProperties();
  }, []);
    
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
                    <h1 className="h3 mb-0 text-white text-center pt-3">Career Form Details</h1>

                  </div>
                  <div className='mt-5'>
                  <table id="example" className="table table-striped table-bordered  table-responsive">
        <thead>
          <tr>
          
            <th className="bl5">Name</th>
            <th className="bl5">Phone</th>
            <th className="bl5">Email</th>
            <th className="bl5">CV</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr key={property.id}>
            
              <td>{property.name}</td>
              <td>{property.phone}</td>
              <td>{property.email}</td>
              <td>    {property.cv && (
          <div>
            <i className="fas fa-file-pdf"></i>
            <a href={property.cv} target="_blank" rel="noopener noreferrer">
              {property.cv.split('/').pop()}
            </a>
          </div>
        )}</td>
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

export default Career;
