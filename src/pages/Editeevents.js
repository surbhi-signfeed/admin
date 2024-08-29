import React, { useState,useEffect} from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import axios from 'axios'; // Import Axios for making HTTP requests

import Sidebar from '../Components/Sidebar';
import Navbarfg from '../Components/Navbar';
import Footer from '../Components/Footer';

import '../App.css';
import Swal from 'sweetalert2';

function Addevents() {
  const navigate = useNavigate();
  useEffect(()=>{
    if(sessionStorage.getItem("userData") == null)
    {
      navigate('/')
    }
  },[]) 
  const { id } = useParams();
  const [images, setImages] = useState([]);   
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null, // Only one image, not an array
    time: '',
    endtime: '',
    eddate: '',
    stdate: '',
    log: '',
    lat: '',
    city: '',
    slug: '',
    country: '',
    venue: '',
    locationdsc: '',
    organiser: '',
    seoTitle:'',
    seoDesc:'',
    seoKeyword:'',
    PageName:'',
    
  });
  useEffect(() => {
    if (id) {
      const fetchEvent = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/eventsDsc/${id}`);
          const event = response.data;
          setFormData({
            title: event.title,
            description: event.description,
          
            time: event.time,
            endtime: event.endtime,
            eddate: event.eddate,
            stdate: event.stdate,
            log: event.log,
            lat: event.lat,
            city: event.city,
            slug: event.slug,
            country: event.country,
            venue: event.venue,
            locationdsc: event.locationdsc,
            organiser: event.organiser,
            seoTitle:event.seoTitle,
            seoDesc:event.seoDesc,
            seoKeyword:event.seoKeyword,
            PageName:event.PageName,
          });
          setImages(event.image ? event.image.split(',') : []);
        } catch (error) {
          console.error('Failed to fetch event data', error);
        }
      };

      fetchEvent();
    }
  }, [id]);


  // Handle change in form inputs
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
      console.log('File selected: ', files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
      console.log(`${name} changed: `, value);
    }
  };

// Handle form submission

const handleSubmit = async (e) => {
  e.preventDefault();


   const data = new FormData();
   Object.keys(formData).forEach((key) => {
     data.append(key, formData[key]);
   });

  // Log FormData contents
  // for (let pair of form.entries()) {
  //   console.log(pair[0], pair[1]);
  // }

  try {
    const response = await axios.put(`http://localhost:4000/api/update-event/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('Data updated successfully', response.data);
    Swal.fire('Success', 'Data updated successfully', 'success');
   
  } catch (error) {
    console.error('Error updating data', error);
    Swal.fire('Error', 'There was an error updating the data', 'error');
  }
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
                    <h1 className="h3 mb-0 text-white text-center pt-3">Events Information</h1>
                  </div>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className='row'>
                    <h3 className="pt-3">Event Basic Information</h3>
                    <div className="form-groups col-md-6">
                      <label htmlFor="title">Title</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="title"
                        name="title"
                        style={{ width: 515 }}
                        placeholder="Add your title"
                        value={formData.title}
                        onChange={handleChange}
                      />
                      <div className="">
                        <div className='row'>
                          <div className='col-md-5'>
                            <div className="pt-4">
                              <input
                                type="date"
                                className="form-control form-control-sm"
                                id="stdate"
                                name="stdate"
                                placeholder="Starting Date"
                                value={formData.stdate}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className='col-md-5'>
                            <div className="pt-4">
                              <input
                                type="date"
                                className="form-control form-control-sm"
                                id="eddate"
                                name="eddate"
                                placeholder="Ending Date"
                                value={formData.eddate}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className='col-md-5'>
                            <div className="pt-4">
                              <input
                                type="time"
                                className="form-control form-control-sm"
                                id="time"
                                name="time"
                                placeholder="Time"
                                value={formData.time}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className='col-md-5'>
                            <div className="pt-4">
                              <input
                                type="time"
                                className="form-control form-control-sm"
                                id="endtime"
                                name="endtime"
                                placeholder="endtime"
                                value={formData.endtime}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                        </div>
                        <div className="row pt-4">
                          <div className="col-md-2">Image</div>
                          <div className="col-md-10">
                          <input
                              type="file"
                              className="form-control form-select-sm"
                              name="image"
                              accept="image/*"
                              style={{ width: 390 }}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="slug">Slug</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="slug"
                        name="slug"
                        style={{ width: 500 }}
                        placeholder="Slug"
                        value={formData.slug}
                        onChange={handleChange}
                      />
                      <textarea
                        className="form-control form-control-sm mt-4"
                        id="description"
                        name="description"
                        style={{ width: 500 }}
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className='row pt-5'>
                    <h3 className="pt-3">Property Location</h3>
                    <div className='col-md-6 pt-4'>
                      <div className='row'>
                        <div className="form-group col-md-5">
                          <label htmlFor="log">Long</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="log"
                            name="log"
                            placeholder="Long"
                            value={formData.log}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-md-5">
                          <label htmlFor="lat">Lat</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="lat"
                            name="lat"
                            placeholder="Lat"
                            value={formData.lat}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className='row'>
                        <div className="form-group col-md-5">
                          <label htmlFor="country">Country</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="country"
                            name="country"
                            placeholder="Country"
                            value={formData.country}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-md-5">
                          <label htmlFor="city">City</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="city"
                            name="city"
                            placeholder="City"
                            value={formData.city}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='col-md-6 pt-4'>
                      <textarea
                        className="form-control form-control-sm mt-4"
                        id="locationdsc"
                        name="locationdsc"
                        style={{ width: 500 }}
                        placeholder="Location Description"
                        value={formData.locationdsc}
                        onChange={handleChange}
                      />
                      <textarea
                        className="form-control form-control-sm mt-4"
                        id="venue"
                        name="venue"
                        style={{ width: 500 }}
                        placeholder="Venue Details"
                        value={formData.venue}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className='row'>
                    <h3 className="pt-3">Property SEO Details</h3>
                    <div className="form-groups col-md-6">
                      <label htmlFor="title">SEO Title</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="seoTitle"
                        name="seoTitle"
                        style={{ width: 500 }}
                        placeholder="Add your seo Title"
                        value={formData.seoTitle}
                        onChange={handleChange}
                      />
                      <div className="pt-4">
                      {/* <label htmlFor="title">SEO Keyword</label> */}
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="seoKeyword"
                        name="seoKeyword"
                        style={{ width: 500 }}
                        placeholder="Add your seo Keyword"
                        value={formData.seoKeyword}
                        onChange={handleChange}
                      />
                   
                      </div>
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="slug">SEO PageName</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="PageName"
                        name="PageName"
                        style={{ width: 500 }}
                        placeholder="PageName"
                        value={formData.PageName}
                        onChange={handleChange}
                      />
                      <input
                        type="text"
                        className="form-control form-control-sm mt-4"
                        id="seoDesc"
                        name="seoDesc"
                        style={{ width: 500 }}
                        placeholder="Add your seo Des"
                        value={formData.seoDesc}
                        onChange={handleChange}
                      />
                     

                  
                    </div>
                  </div>
                  <div className='row pt-5'>
                    <h3 className="pt-3">Organisers </h3>
                    <div className='col-md-6 pt-4 text-center'>
                      <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="organiser" id="organiser1" value="jasbir siingh sachdeva" onChange={handleChange} />
                        <label className="form-check-label" htmlFor="organiser1">Jasbir Siingh Sachdeva</label>
                      </div>
                    </div>
                    <div className='col-md-6 pt-4 text-center'>
                      <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="organiser" id="organiser2" value="Sathbir Siingh Sachdeva" onChange={handleChange} />
                        <label className="form-check-label" htmlFor="organiser2">Sathbir Siingh Sachdeva</label>
                      </div>
                    </div>
                  </div>
                  <div className='px-4'>
                    <button type="submit" className="btn btn-dark mt-3 px-5 mb-3">Submit</button>
                  </div>
                </form>
              </div>
            </div>
            {/* <Footer /> */}
          </div>
        </div>
        <a className="scroll-to-top rounded" href="#page-top">
          <i className="fas fa-angle-up"></i>
        </a>
      </div>
    </div>
  );
}

export default Addevents;
