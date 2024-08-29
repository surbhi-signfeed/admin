import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import Sidebar from '../Components/Sidebar';
import Navbarfg from '../Components/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';

function SubscribeForm() {
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
        const response = await axios.get('http://localhost:4000/api/subscribe');
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties data:', error);
      }
    };

    fetchProperties();
  }, []);

  const handleCopy = (text) => {
          navigator.clipboard.writeText(text).then(
            () => {
              toast.success('Email copied to clipboard');
              console.log("jgc")
            },
            (err) => {
              toast.error('Could not copy text');
            }
          );
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
                    <h1 className="h3 mb-0 text-white text-center pt-3">Sell Form Details</h1>

                  </div>
                  <div className='mt-5'>
                  <table id="example" className="table table-striped table-bordered">
        <thead>
          <tr>
        
          <th className="bl5">ID</th>

            <th className="bl5">Mail</th>

         
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr key={property.id}>
                   <td>{property.id}</td>
              <td>{property.mail}

              <button
                  onClick={() => handleCopy(property.mail)}
                  className="btn btn-sm btn-primary ml-2"
                  style={{ marginLeft: '10px' }}
                >
                Copy
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

export default SubscribeForm;
