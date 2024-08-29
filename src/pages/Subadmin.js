import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import Sidebar from '../Components/Sidebar';
import Navbarfg from '../Components/Navbar';


import '../App.css';

function Subadmin() {
  const navigate = useNavigate();
  useEffect(()=>{
    if(sessionStorage.getItem("userData") == null)
    {
      navigate('/')
    }
  },[])
  const [blogId, setBlogId] = useState(null);
  const [subAdmins, setSubAdmins] = useState([]);

  const handleCreateNew = () => {
    navigate('/CreateSubadmin'); // Replace '/new-page' with the path you want to navigate to
  };

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const fetchSubAdmins = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/sub-admin');
        setSubAdmins(response.data);
      } catch (error) {
        console.error('Error fetching sub-admin data:', error);
      }
    };

    fetchSubAdmins();
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
                    <h1 className="h3 mb-0 text-white text-center pt-3">Sub Admin</h1>

                  </div>
                  <div className='mt-5'>
                    <button type="button" className="btn btn-dark mt-3 px-5 mb-3" onClick={handleCreateNew} >Create New</button>
                    <table id="example" className="table table-striped table-bordered table-responsive">
        <thead>
          <tr>
            <th className="bl5">Name</th>
            <th className="bl5">Password</th>
            <th className="bl5">User Type</th>
            <th className="bl5">Status</th>
            <th className="bl5">Action</th>
          </tr>
        </thead>
        <tbody>
          {subAdmins.map((subAdmin) => (
            <tr key={subAdmin.id}>
              <td>{subAdmin.email}</td>
              <td>{subAdmin.password}</td>
              <td>{subAdmin.usertype}</td>
              <td>{subAdmin.status}</td>
              <td>
                <button type="button" className="btn btn-dark mt-3 px-5 mb-3">
                  Block
                </button>
              </td>
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

export default Subadmin;
