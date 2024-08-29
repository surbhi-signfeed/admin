import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios for making HTTP requests

import Sidebar from '../Components/Sidebar';
import Navbarfg from '../Components/Navbar';
import Footer from '../Components/Footer';
import Editor from '../Components/Editor';
import FroalaEditor from 'react-froala-wysiwyg';
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
import Swal from 'sweetalert2';



import '../App.css';

function Admin() {
  const navigate = useNavigate();
  useEffect(()=>{
    if(sessionStorage.getItem("userData") == null)
    {
      navigate('/')
    }
  },[])
  const [froalaContent, setFroalaContent] = useState('');
  const froalaConfig = {
    placeholderText: 'Edit Your Content Here!',
    charCounterCount: false,
    toolbarButtons: [
      'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript',
      'fontFamily', 'fontSize', '|', 'color', 'emoticons', 'inlineStyle', 'paragraphStyle',
      '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote',
      'insertHR', '-', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable',
      '|', 'undo', 'redo', 'clearFormatting', 'selectAll', 'html'
    ]
  };

// Function to get the current date in 'dd-MM-yy' format
const getCurrentDate = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = String(date.getFullYear()).slice(-2); // Get the last two digits of the year
  return `${day}-${month}-${year}`;
};


  // Initialize state for form fields
  const [formData, setFormData] = useState({

    title: '',
    description: '',
    images: [],
    size: '',
    approve: '0',
    date: getCurrentDate(), 
    propertyType: '',
    price: '',
    bedrooms: '',
    features: [],
    city: '',
    country: '',
    location: '',
    feature_image: null,
    log: '',
    lat: '',
    qr: null,
    bathroom: '',
    slug: '',
    status: '',
    area: '',
    editor: '',
    shortTitle:'',
    seoTitle:'',
    seoDes:'',
    seoKeyword:'',
    PageName:'',
  });

  const handleChange = (event) => {
    const { name, value, type, files, checked } = event.target;

    if (type === 'checkbox') {
      // Update checkbox values
      let updatedFeatures;

      if (checked) {
        updatedFeatures = [...formData.features, value];
      } else {
        updatedFeatures = formData.features.filter(f => f !== value);
      }

      setFormData(prevFormData => ({
        ...prevFormData,
        features: updatedFeatures
      }));
    } else if (type === 'file') {
      // Update file input values
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: files
      }));
      console.log(name, files);
    } else {
      // Update other input values
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value
      }));
    }
  };

  const handleEditorChange = (froalaContent) => {
    // Update Froala Editor content
    setFormData(prevFormData => ({
      ...prevFormData,
      editor: froalaContent
    }));
    console.log("Editor content:", froalaContent);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Validate if any file field is null
    if (!formData.images || !formData.qr || !formData.feature_image) {
      alert('One of the file fields is null. Cannot submit the form.');
      return;
    }
  
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) { // Only append if the field is not null
        if (key === 'images' || key === 'qr' || key === 'feature_image') {
          for (let i = 0; i < formData[key].length; i++) {
            data.append(key, formData[key][i]);
          }
        } else {
          data.append(key, formData[key]);
        }
      }
    });
  
    try {
      const response = await axios.post('http://localhost:4000/api/upload-rent', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
     
//       setBlogId(response.data.id);
Swal.fire('Success', 'Data updated successfully', 'success');      // navigate('/success'); // Redirect to a success page after submission
    } catch (error) {
      Swal.fire('Error', 'There was an error updating the data', 'error');
      console.error('There was an error submitting the form!', error.response ? error.response.data : error.message);
    }
  };
  
  console.log("bf0", formData)
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
                    <h1 className="h3 mb-0 text-white text-center pt-3">Property Information</h1>

                  </div>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className='row'>
                    <h3 className="pt-3">Property Basic Information</h3>
                    <div className="form-groups col-md-6">
                      <label htmlFor="title">Title</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="title"
                        name="title"
                        style={{ width: 500 }}
                        placeholder="Add your title"
                        value={formData.title}
                        onChange={handleChange}
                      />
                      <div className="pt-4">
                        <select
                          className="form-select form-select-sm"
                          aria-label=".form-select-sm example"
                          style={{ width: 500 }}
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <option value="" selected>Property Status</option>
                          <option value="Buy">Buy</option>
                          <option value="Rent">Rent</option>
                        </select>
                        <div className="row pt-4">
                          <div className="col-md-2">QR Code</div>
                          <div className="col-md-10">
                            <input
                              type="file"
                              className="form-control form-select-sm"
                              name="qr"
                              accept="image/*"
                              multiple
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
                      <input
                        type="text"
                        className="form-control form-control-sm mt-4"
                        id="price"
                        name="price"
                        style={{ width: 500 }}
                        placeholder="Add your Price"
                        value={formData.price}
                        onChange={handleChange}
                      />
                      <div className="pt-4">
                        <select
                          className="form-select form-select-sm"
                          aria-label=".form-select-sm example"
                          style={{ width: 500 }}
                          name="propertyType"
                          value={formData.propertyType}
                          onChange={handleChange}
                        >
                          <option value="" selected>Property Type</option>
                          <option value="Office">Office</option>
                          <option value="Labor Camp">Labor Camp</option>
                          <option value="Commercial Building">Commercial Building</option>
                          <option value="Apartment">Apartment</option>
                           
                        
                        </select></div>

                      {formData.status === 'Rent' && (
                        <div className="pt-4">
                          <div>
                            <label>Rental Period</label>
                            <div>
                              <input type="radio" id="weekly" name="rentalPeriod" value="W" onChange={handleChange} /> &nbsp;
                              <label htmlFor="weekly">Weekly</label>
                            </div>
                            <div>
                              <input type="radio" id="monthly" name="rentalPeriod" value="M" onChange={handleChange} /> &nbsp;
                              <label htmlFor="monthly">Monthly</label>
                            </div>
                            <div>
                              <input type="radio" id="yearly" name="rentalPeriod" value="Y" onChange={handleChange} /> &nbsp;
                              <label htmlFor="yearly">Yearly</label>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='row mt-4'>
                    <h3 className="pt-3">Property Details</h3>
                    <div className="form-groups col-md-6">
                      <div className='row'>
                        <div className='col-md-5'>
                          <div className="pt-4">
                            <select
                              className="form-select form-select-sm"
                              aria-label=".form-select-sm example"
                              style={{ width: 220 }}
                              name="bedrooms"
                              value={formData.bedrooms}
                              onChange={handleChange}
                            >
                              <option value="" selected>Bedrooms</option>
                              <option value="Studio">Studio</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                              <option value="6">6</option>
                            </select>
                          </div>
                        </div>
                        <div className='col-md-5'>
                          <div className="pt-4">
                            <select
                              className="form-select form-select-sm"
                              aria-label=".form-select-sm example"
                              style={{ width: 225 }}
                              name="bathroom"
                              value={formData.bathroom}
                              onChange={handleChange}
                            >
                              <option value="" selected>Bathroom</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                             
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="row pt-4">
                        <div className="col-md-3">Feature image</div>
                        <div className="col-md-9">

                          <input
                            type="file"
                            className="form-control form-select-sm"
                            name="feature_image"
                            accept="image/*"
                            style={{ width: 338 }}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="row pt-4">
                        <div className="col-md-3">Gallery images</div>
                        <div className="col-md-9">
                          <input
                            type="file"
                            className="form-control form-select-sm"
                            name="images"
                            accept="image/*"
                            multiple
                            style={{ width: 338 }}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="area">Size</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="area"
                        name="area"
                        style={{ width: 500 }}
                        placeholder="Area"
                        value={formData.area}
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
                          <input
                        type="text"
                        className="form-control form-control-sm mt-4"
                        id="shortTitle"
                        name="shortTitle"
                        style={{ width: 500 }}
                        placeholder="Short Title"
                        value={formData.shortTitle}
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
                          {/* <label htmlFor="country">Country</label> */}
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="country"
                            name="country"
                            placeholder="country"
                            value={formData.country}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-md-5">
                          {/* <label htmlFor="city">City</label> */}
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="city"
                            name="city"
                            placeholder="city"
                            value={formData.city}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='col-md-6 pt-4'>
                      <textarea
                        className="form-control form-control-sm mt-4"
                        id="location"
                        name="location"
                        style={{ width: 500 }}
                        placeholder="Location Description"
                        value={formData.location}
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
                        id="seoDes"
                        name="seoDes"
                        style={{ width: 500 }}
                        placeholder="Add your seo Des"
                        value={formData.seoDes}
                        onChange={handleChange}
                      />
                     

                
                    </div>
                  </div>
                  <h3 className="pt-3">Features & Amenities</h3>
                  <div className='pt-4 col-md-12'>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="inlineCheckbox1"
                        name="features"
                        value="Electricity Back up"
                        onChange={handleChange}
                        checked={formData.features.includes('Electricity Back up')}
                      />
                      <label className="form-check-label" htmlFor="inlineCheckbox1">Electricity Back up</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="inlineCheckbox2"
                        name="features"
                        value="Centrally air-conditioned"
                        onChange={handleChange}
                        checked={formData.features.includes('Centrally air-conditioned')}
                      />
                      <label className="form-check-label" htmlFor="inlineCheckbox2">Centrally air-conditioned</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="inlineCheckbox3"
                        name="features"
                        value="Central Heating"
                        onChange={handleChange}
                        checked={formData.features.includes('Central Heating')}
                      />
                      <label className="form-check-label" htmlFor="inlineCheckbox3">Central Heating</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="inlineCheckbox3"
                        name="features"
                        value="Cafeteria or Canteen"
                        onChange={handleChange}
                        checked={formData.features.includes('Cafeteria or Canteen')}
                      />
                      <label className="form-check-label" htmlFor="inlineCheckbox3">Cafeteria or Canteen</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="inlineCheckbox3"
                        name="features"
                        value="First aid medical center"
                        onChange={handleChange}
                        checked={formData.features.includes('First aid medical center')}
                      />
                      <label className="form-check-label" htmlFor="inlineCheckbox3">First aid medical center</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="inlineCheckbox3"
                        name="features"
                        value="Double glazed window"
                        onChange={handleChange}
                        checked={formData.features.includes('Double glazed window')}
                      />
                      <label className="form-check-label" htmlFor="inlineCheckbox3">Double glazed window</label>
                    </div>

                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="inlineCheckbox3"
                        name="features"
                        value="Waste Disposal"
                        onChange={handleChange}
                        checked={formData.features.includes('Waste Disposal')}
                      />
                      <label className="form-check-label" htmlFor="inlineCheckbox3">Waste Disposal</label>
                    </div>

                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="inlineCheckbox3"
                        name="features"
                        value="Maintenance staff"
                        onChange={handleChange}
                        checked={formData.features.includes('Maintenance staff')}
                      />
                      <label className="form-check-label" htmlFor="inlineCheckbox3">Maintenance staff</label>
                    </div>
                    
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="inlineCheckbox3"
                        name="features"
                        value="Security staff"
                        onChange={handleChange}
                        checked={formData.features.includes('Security staff')}
                      />
                      <label className="form-check-label" htmlFor="inlineCheckbox3">Security staff</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="inlineCheckbox3"
                        name="features"
                        value="Conference room"
                        onChange={handleChange}
                        checked={formData.features.includes('Conference room')}
                      />
                      <label className="form-check-label" htmlFor="inlineCheckbox3">Conference room</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="inlineCheckbox3"
                        name="features"
                        value="CCTV surveillance"
                        onChange={handleChange}
                        checked={formData.features.includes('CCTV surveillance')}
                      />
                      <label className="form-check-label" htmlFor="inlineCheckbox3">CCTV surveillance</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="inlineCheckbox3"
                        name="features"
                        value="Broadband internet"
                        onChange={handleChange}
                        checked={formData.features.includes('Broadband internet')}
                      />
                      <label className="form-check-label" htmlFor="inlineCheckbox3">Broadband internet</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="inlineCheckbox3"
                        name="features"
                        value="Intercom"
                        onChange={handleChange}
                        checked={formData.features.includes('Intercom')}
                      />
                      <label className="form-check-label" htmlFor="inlineCheckbox3">Intercom</label>
                    </div>
                  </div>

                  <div className='mt-4 col-md-11'>
                    <h3 className='pt-2 pb-2'>Description</h3>
                   
                        <FroalaEditor
        tag='textarea'
        model={formData.editor}
        onModelChange={handleEditorChange}
        config={froalaConfig}
      />

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

export default Admin;

