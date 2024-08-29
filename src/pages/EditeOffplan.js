import React, { useState ,useEffect, useRef} from 'react';

import axios from 'axios'; // Import Axios for making HTTP requests
import FroalaEditor from 'react-froala-wysiwyg';
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
import Select from 'react-select';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';
import Navbarfg from '../Components/Navbar';
import Footer from '../Components/Footer';
import Editor from '../Components/Editor';

import '../App.css';

function EditOffplan() {
  const navigate = useNavigate();
  useEffect(()=>{
    if(sessionStorage.getItem("userData") == null)
    {
      navigate('/')
    }
  },[])
    const { id } = useParams();

  const [feature_image, setFeature_image] = useState('');
  const [qr, setQr] = useState('');   
  const [images, setImages] = useState([]);   


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

  
useEffect(() => {
          const fetchProperty = async () => {
            try {
              const response = await axios.get(`http://localhost:4000/api/get-offplan/${id}`);
              const property = response.data[0];
              console.log("kl",property)
              setFormData({
                title: property.title,
                description: property.description || '',
                images: property.images || [],
                builder: property.builder || '',
                approve: property.approve || '0',
                date: property.date || getCurrentDate(),
                propertyType: property.propertyType || '',
                bcommunity: property.bcommunity || '',
                price: property.price || '',
                handover: property.handover || '',
                construction: property.construction || '',
                booking: property.booking || '',
                city: property.city || '',
                country: property.country || '',
                exectLocation: property.exectLocation || '',
                feature_image: property.feature_image || null,
                log: property.log || '',
                lat: property.lat || '',
                qr: property.qr || null,
                slug: property.slug || '',
                sizeStart: property.sizeStart || '',
                sizeEnd: property.sizeEnd || '',
                editor: property.editor || '',
                logo: property.logo || null,
                community: property.community || [],
                aboveBg: property.aboveBg || null,
                lowerBg: property.lowerBg || null,
                pos: property.pos || '',
                amenitiesTitle: property.amenitiesTitle || '',
                amenitiesDsc: property.amenitiesDsc || '',
                amenitiesAll: property.amenitiesAll || [],
                plansTitle: property.plansTitle || '',
                plansDsc: property.plansDsc || '',
                locationTitle: property.locationTitle || '',
                locationDsc: property.locationDsc || '',
                time: property.time || '',
                locationAllinput: property.locationAllinput || '',
                tm: property.tm || [],
                locationAll: property.locationAll || [],
                plans: property.plans || '',
                plansImage: property.plansImage || '',
                plansAll: property.plansAll || [],
                plansImg: property.plansImg || [],
                qus: property.qus || '',
                ans: property.ans || '',
                qusList: property.qusList || [],
                ansList: property.ansList || [],
                shortTitle: property.shortTitle || ''
              });
              
                setImages(property.images ? property.images.split(',') : []);
              setFeature_image(property.feature_image);
              setQr(property.qr); 
          
            } catch (error) {
              console.error('Failed to fetch property data', error);
            }
          };
      
          fetchProperty();
        }, [id]);
        
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
    builder: '',
    approve: '0',
    date: getCurrentDate(), 
    propertyType: '',
    bcommunity: '',
    price: '',
    handover: '',
    construction: '',
    booking: '',
    city: '',
    country: '',
    exectLocation: '',
    feature_image: null,
    log: '',
    lat: '',
    qr: null,
    slug: '',
    sizeStart: '',
    sizeEnd: '',
    editor: '',
    logo: null,
    community: [],
    aboveBg: null,
    lowerBg: null,
    pos: '',
    amenitiesTitle: '',
    amenitiesDsc: '',
    amenitiesAll: [],
    plansTitle: '',
    plansDsc: '',
    locationTitle: '',
    locationDsc: '',
    time: '',
    locationAllinput: '',
    tm: [],
    locationAll: [],
    plans: '',
    plansImage: '',
    plansAll: [],
    plansImg: [],
    qus: '',
    ans: '',
    qusList: [],
    ansList: []
  });
  

  const handleChange = (event) => {
    const { name, value, type, files, checked } = event.target;
  
    if (type === 'checkbox') {
      let updatedFeatures;
  
      if (checked) {
        updatedFeatures = [...formData.amenitiesAll, value];
      } else {
        updatedFeatures = formData.amenitiesAll.filter(f => f !== value);
      }
  
      setFormData(prevFormData => ({
        ...prevFormData,
        amenitiesAll: updatedFeatures
      }));
    } else if (type === 'file') {

      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: files
      }));
      console.log(name, files);
    } else {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value
      }));
    }
  };

  const handleAddQusAns = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      qusList: [...prevFormData.qusList, prevFormData.qus],
      ansList: [...prevFormData.ansList, prevFormData.ans],
      qus: '',
      ans: ''
    }));
  };

  const handleAddFloorPlan = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      plansAll: [...prevFormData.plansAll, prevFormData.plans],
      plansImg: [...prevFormData.plansImg, prevFormData.plansImage],
      plans: '',
      plansImage: ''
    }));
  };

  
  const handleAddTime = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      tm: [...prevFormData.tm, prevFormData.time],
      locationAll: [...prevFormData.locationAll, prevFormData.locationAllinput],
      time: '',
      locationAllinput: ''
    }));
  };
  const handleEditorChange = (froalaContent) => {
    // Update Froala Editor content
    setFormData(prevFormData => ({
      ...prevFormData,
      editor: froalaContent
    }));
    console.log("Editor content:", froalaContent);
  };


  const handleSelectChange = (selectedOptions, actionMeta) => {
    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setFormData(prevFormData => ({
      ...prevFormData,
      [actionMeta.name]: selectedValues
    }));
    console.log(actionMeta.name, selectedValues);
  };

  const bedroomOptions = [
    { value: 'Studio', label: 'Studio' },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData();
  
    // Flatten the plansImg array to extract individual files
    // const flattenedPlansImg = formData.plansImg.reduce((acc, fileList) => {
    //   return acc.concat(Array.from(fileList));
    // }, []);
  
    // Object.keys(formData).forEach((key) => {
    //   if (key === 'images' || key === 'qr' || key === 'feature_image' || key === 'aboveBg' || key === 'lowerBg' || key === 'logo') {
    //     // Append each file in the array to FormData
    //     for (let i = 0; i < formData[key].length; i++) {
    //       data.append(key, formData[key][i]);
    //     }
    //   } else if (key === 'plansImg') {
    //     // Append each file from flattenedPlansImg to FormData
    //     for (let i = 0; i < flattenedPlansImg.length; i++) {
    //       data.append(key, flattenedPlansImg[i]);
    //     }
    //   } else {
    //     // Append non-file data directly to FormData
    //     data.append(key, formData[key]);
    //   }
    // });
  
    // Validate required fields before sending the request
    if (!formData.images || !formData.qr || !formData.feature_image || !formData.plansImg) {
      alert('Missing required fields: images, qr, feature_image, or plansImg');
      return;
    }
  
    try {
      const response = await axios.put(`http://localhost:4000/api/update-offplan/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Form submitted successfully!');
      console.log('Form submitted successfully!', response.data);
      // navigate('/success'); // Redirect to a success page after submission
    } catch (error) {
      alert('There was an error submitting the form!');
      console.error('There was an error submitting the form!', error.response ? error.response.data : error.message);
    }
  };
  

  console.log("bf0",formData)
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
                    <div className="form-groups col-md-5">
                      <label htmlFor="title">Title</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="title"
                        name="title"
                        placeholder="Add your title"
                        value={formData.title}
                        onChange={handleChange}
                      />
                      <div className="pt-4">
                  
                        <div className="row ">
                          <div className="col-md-2">QR Code</div>
                          <div className="col-md-10">
                            <input
                              type="file"
                              className="form-control form-select-sm"
                              name="qr"
                              accept="image/*"
                              multiple
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        
                        <div className="row pt-3">
                          <div className="col-md-2">Logo</div>
                          <div className="col-md-10">
                            <input
                              type="file"
                              className="form-control form-select-sm"
                              name="logo"
                              accept="image/*"
                              multiple
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='col-md-1'></div>
                    <div className="form-group col-md-5">

                      <label htmlFor="slug">Slug</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="slug"
                        name="slug"
                    
                        placeholder="Slug"
                        value={formData.slug}
                        onChange={handleChange}
                      />
                      <input
                        type="text"
                        className="form-control form-control-sm mt-4"
                        id="price"
                        name="price"
                
                        placeholder="Add your Price"
                        value={formData.price}
                        onChange={handleChange}
                      />
                          <div className='row'>
                        <div className='col-md-6'>
                        <div className="pt-4">
                        <Select
      // className="form-select form-select-sm"
      aria-label=".form-select-sm example"
      style={{ width: 220 }}
      name="community"
      value={bedroomOptions.filter(option => formData.community.includes(option.value))}
      onChange={handleSelectChange}
      options={bedroomOptions}
      isMulti
    />
  {/* <select
    multiple // Add the `multiple` attribute
    className="form-select form-select-sm"
    aria-label=".form-select-sm example"
    style={{ width: 220 }}
    name="community"
    value={formData.community} // Set the value based on selected options
    onChange={handleChange}
  >
    <option value="" selected>BR</option>
    <option value="1">1BR</option>
    <option value="2BR">2BR</option>
    <option value="3BR">3BR</option>
    <option value="4BR">4BR</option>
    <option value="5BR">5BR</option>
  </select> */}
</div>
                        </div>
                        <div className='col-md-6'>
                          <div className="pt-4">
                            <select
                              className="form-select form-select-sm"
                              aria-label=".form-select-sm example"
                              style={{ width: 225 }}
                              name="propertyType"
                              value={formData.propertyType}
                              onChange={handleChange}
                            >
                              <option value="" selected>Property Type</option>
                              <option value="Villa">Villa</option>
                              <option value="APARTMENT">APARTMENT</option> 
                              <option value="TOWNHOUSE">TOWNHOUSE</option>  
                              <option value="TOWNHOUSE">PENTHOUSE</option>  

                            </select>
                          </div>
                        </div>
                      </div>
              
                    </div>
                   
                  </div>
                  <div className='row pt-2'>
                 
                  Payment Plan
                  <div className='col-md-3'>     <input
                        type="text"
                        className="form-control form-control-sm"
                        id="booking"
                        name="booking"
                     
                        placeholder="On Booking"
                        value={formData.booking}
                        onChange={handleChange}
                      /></div>
                         <div className='col-md-3'>     <input
                        type="text"
                        className="form-control form-control-sm"
                        id="construction"
                        name="construction"
                     
                        placeholder="During Construction"
                        value={formData.construction}
                        onChange={handleChange}
                      /></div>
                          <div className='col-md-3'>   
                              <input
                        type="text"
                        className="form-control form-control-sm "
                        id="handover"
                        name="handover"
                     
                        placeholder="On Handover"
                        value={formData.handover}
                        onChange={handleChange}
                        
                      /> 
                      </div>
                      <div className='col-md-6'>
                          <div className="pt-4">
                            <select
                              className="form-select form-select-sm"
                              aria-label=".form-select-sm example"
                              style={{ width: 225 }}
                              name="bcommunity"
                              value={formData.bcommunity}
                              onChange={handleChange}
                            >
                              <option value="" selected>community Type</option>
                              <option value="Danube">Danube</option>
                              <option value="Emaar">Emaar</option> 
                              {/* <option value="TOWNHOUSE">TOWNHOUSE</option>  
                              <option value="TOWNHOUSE">PENTHOUSE</option>   */}

                            </select>
                          </div>
                        </div>
                                              
                  </div>
                  <div className='row mt-4'>
                    <h3 className="pt-3">Property Details</h3>
                    <div className="form-groups col-md-6">
                      <div className='row'>
                        <div className='col-md-5'>
                          <div className="pt-4">
                          <label htmlFor="sizeStart">Start Size</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="sizeStart"
                        name="sizeStart"
                     
                        placeholder="Size"
                        value={formData.sizeStart}
                        onChange={handleChange}
                      />
                          </div>
                        </div>
                        <div className='col-md-5'>
                          <div className="pt-4">
                          <label htmlFor="sizeEnd">End Size</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="sizeEnd"
                        name="sizeEnd"
                    
                        placeholder="End size"
                        value={formData.sizeEnd}
                        onChange={handleChange}
                      />
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
                    <div className="form-group col-md-6 pt-4">
                    <div className='row'>
                        <div className='col-md-5'>
                          <div >
                          <label htmlFor="pos">Possession</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="pos"
                        name="pos"
                     
                        placeholder="Possession"
                        value={formData.pos}
                        onChange={handleChange}
                      />
                          </div>
                        </div>
                        <div className='col-md-5'>
                          <div >
                          <label htmlFor="builder">Builder Name</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="builder"
                        name="builder"
                    
                        placeholder="Builder"
                        value={formData.builder}
                        onChange={handleChange}
                      />
                          </div>
                        </div>
                        <div className="row pt-4">
                        <div className="col-md-3">Above image</div>
                        <div className="col-md-9">
                          <input
                            type="file"
                            className="form-control form-select-sm"
                            name="aboveBg"
                            accept="image/*"
                            style={{ width: 338 }}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="row pt-4">
                        <div className="col-md-3">Below images</div>
                        <div className="col-md-9">
                          <input
                            type="file"
                            className="form-control form-select-sm"
                            name="lowerBg"
                            accept="image/*"
                            multiple
                            style={{ width: 338 }}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      </div>

                   
                    </div>
                    <div className='col-md-11'>
                    <textarea
                        className="form-control form-control-sm mt-4"
                        id="description"
                        name="description"
                      
                        placeholder="Top Description"
                        value={formData.description}
                        onChange={handleChange}
                      />
                      </div>
                  </div>
                  
                  <div className='row pt-5'>
                    <h3 className="pt-3">Property Amenities </h3>
                    <div className='col-md-6 pt-4'>
                      <div className='row'>
                        <div className="form-group col-md-10">
                          <label htmlFor="amenitiesTitle">Amenities Title</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="amenitiesTitle"
                            name="amenitiesTitle"
                            placeholder="Amenities"
                            value={formData.amenitiesTitle}
                            onChange={handleChange}
                          />


                        </div>
                  
   
                        
                      </div>
                    </div>

                    
                    <div className='col-md-6 pt-4'>
                      <textarea
                        className="form-control form-control-sm mt-4"
                        id="amenitiesDsc"
                        name="amenitiesDsc"
                        style={{ width: 500 }}
                        placeholder="Amenities Description"
                        value={formData.amenitiesDsc}
                        onChange={handleChange}
                      />

                    </div>
                  </div>
                  <div className='pt-4'>
  <div className="form-check form-check-inline">
    <input
      className="form-check-input"
      type="checkbox"
      id="inlineCheckbox1"
      name="amenitiesAll"
      value="Sky Garden Paddle"
      onChange={handleChange}
      checked={formData.amenitiesAll.includes('Sky Garden Paddle')}
    />
    <label className="form-check-label" htmlFor="inlineCheckbox1">Sky Garden Paddle</label>
  </div>
  <div className="form-check form-check-inline">
    <input
      className="form-check-input"
      type="checkbox"
      id="inlineCheckbox2"
      name="amenitiesAll"
      value="Gymnasium"
      onChange={handleChange}
      checked={formData.amenitiesAll.includes('Gymnasium')}
    />
    <label className="form-check-label" htmlFor="inlineCheckbox2">Gymnasium</label>
  </div>
  <div className="form-check form-check-inline">
    <input
      className="form-check-input"
      type="checkbox"
      id="inlineCheckbox3"
      name="amenitiesAll"
      value="Beach Access"
      onChange={handleChange}
      checked={formData.amenitiesAll.includes('Beach Access')}
    />
    <label className="form-check-label" htmlFor="inlineCheckbox3">Beach Access</label>
  </div>
  <div className="form-check form-check-inline">
    <input
      className="form-check-input"
      type="checkbox"
      id="inlineCheckbox3"
      name="amenitiesAll"
      value="Cycling Trails"
      onChange={handleChange}
      checked={formData.amenitiesAll.includes('Cycling Trails')}
    />
    <label className="form-check-label" htmlFor="inlineCheckbox3">Cycling Trails</label>
  </div>
  <div className="form-check form-check-inline">
    <input
      className="form-check-input"
      type="checkbox"
      id="inlineCheckbox3"
      name="amenitiesAll"
      value="24*7 Security"
      onChange={handleChange}
      checked={formData.amenitiesAll.includes('24*7 Security')}
    />
    <label className="form-check-label" htmlFor="inlineCheckbox3">24*7 Security</label>
  </div>
  <div className="form-check form-check-inline">
    <input
      className="form-check-input"
      type="checkbox"
      id="inlineCheckbox3"
      name="amenitiesAll"
      value="Swimming Pool"
      onChange={handleChange}
      checked={formData.amenitiesAll.includes('Swimming Pool')}
    />
    <label className="form-check-label" htmlFor="inlineCheckbox3">Swimming Pool</label>
  </div>
  <div className="form-check form-check-inline">
    <input
      className="form-check-input"
      type="checkbox"
      id="inlineCheckbox3"
      name="amenitiesAll"
      value="Kids Play Area"
      onChange={handleChange}
      checked={formData.amenitiesAll.includes('Kids Play Area')}
    />
    <label className="form-check-label" htmlFor="inlineCheckbox3">Kids Play Area</label>
  </div>
  <div className="form-check form-check-inline">
    <input
      className="form-check-input"
      type="checkbox"
      id="inlineCheckbox3"
      name="amenitiesAll"
      value="Running Track"
      onChange={handleChange}
      checked={formData.amenitiesAll.includes('Running Track')}
    />
    <label className="form-check-label" htmlFor="inlineCheckbox3">Running Track</label>
  </div>
  <div className="form-check form-check-inline">
    <input
      className="form-check-input"
      type="checkbox"
      id="inlineCheckbox3"
      name="amenitiesAll"
      value="Retail Outlets"
      onChange={handleChange}
      checked={formData.amenitiesAll.includes('Retail Outlets')}
    />
    <label className="form-check-label" htmlFor="inlineCheckbox3">Retail Outlets</label>
  </div> 
  <div className="form-check form-check-inline">
    <input
      className="form-check-input"
      type="checkbox"
      id="inlineCheckbox3"
      name="amenitiesAll"
      value="Barbeque Areas"
      onChange={handleChange}
      checked={formData.amenitiesAll.includes('Barbeque Areas')}
    />
    <label className="form-check-label" htmlFor="inlineCheckbox3">Barbeque Areas</label>
  </div>
  <div className="form-check form-check-inline">
    <input
      className="form-check-input"
      type="checkbox"
      id="inlineCheckbox3"
      name="amenitiesAll"
      value="Walking And Jogging Tracks"
      onChange={handleChange}
      checked={formData.amenitiesAll.includes('Walking And Jogging Tracks')}
    />
    <label className="form-check-label" htmlFor="inlineCheckbox3">Walking And Jogging Tracks</label>
  </div>
  <div className="form-check form-check-inline">
    <input
      className="form-check-input"
      type="checkbox"
      id="inlineCheckbox3"
      name="amenitiesAll"
      value="Wave Swimming Pool"
      onChange={handleChange}
      checked={formData.amenitiesAll.includes(' Wave Swimming Pools')}
    />
    <label className="form-check-label" htmlFor="inlineCheckbox3"> Wave Swimming Pool</label>
  </div>
  <div className="form-check form-check-inline">
    <input
      className="form-check-input"
      type="checkbox"
      id="inlineCheckbox3"
      name="amenitiesAll"
      value="Outdoor Gyms"
      onChange={handleChange}
      checked={formData.amenitiesAll.includes('Outdoor Gyms')}
    />
    <label className="form-check-label" htmlFor="inlineCheckbox3">  Outdoor Gyms</label>
  </div>
  <div className="form-check form-check-inline">
    <input
      className="form-check-input"
      type="checkbox"
      id="inlineCheckbox3"
      name="amenitiesAll"
      value="Skate Park"
      onChange={handleChange}
      checked={formData.amenitiesAll.includes('Skate Park')}
    />
    <label className="form-check-label" htmlFor="inlineCheckbox3">Skate Park</label>
  </div> 
  <div className="form-check form-check-inline">
    <input
      className="form-check-input"
      type="checkbox"
      id="inlineCheckbox3"
      name="amenitiesAll"
      value="Retail Outlets"
      onChange={handleChange}
      checked={formData.amenitiesAll.includes('Retail Outlets')}
    />
    <label className="form-check-label" htmlFor="inlineCheckbox3">Retail Outlets</label>
  </div>  
  <div className="form-check form-check-inline">
    <input
      className="form-check-input"
      type="checkbox"
      id="inlineCheckbox3"
      name="amenitiesAll"
      value="Restaurants"
      onChange={handleChange}
      checked={formData.amenitiesAll.includes('Restaurants')}
    />
    <label className="form-check-label" htmlFor="inlineCheckbox3">Restaurants</label>
  </div> 
  <div className="form-check form-check-inline">
    <input
      className="form-check-input"
      type="checkbox"
      id="inlineCheckbox3"
      name="amenitiesAll"
      value="Health Care Centre"
      onChange={handleChange}
      checked={formData.amenitiesAll.includes('Health Care Centre')}
    />
    <label className="form-check-label" htmlFor="inlineCheckbox3">  Health Care Centre</label>
  </div>  
  <div className="form-check form-check-inline">
    <input
      className="form-check-input"
      type="checkbox"
      id="inlineCheckbox3"
      name="amenitiesAll"
      value="Basketball Court"
      onChange={handleChange}
      checked={formData.amenitiesAll.includes('Basketball Court')}
    />
    <label className="form-check-label" htmlFor="inlineCheckbox3">Basketball Court</label>
  </div> 
  <div className="form-check form-check-inline">
    <input
      className="form-check-input"
      type="checkbox"
      id="inlineCheckbox3"
      name="amenitiesAll"
      value="BBQ Areas"
      onChange={handleChange}
      checked={formData.amenitiesAll.includes('BBQ Areas')}
    />
    <label className="form-check-label" htmlFor="inlineCheckbox3">BBQ Areas</label>
  </div> 
  <div className="form-check form-check-inline">
    <input
      className="form-check-input"
      type="checkbox"
      id="inlineCheckbox3"
      name="amenitiesAll"
      value="Flower Garden"
      onChange={handleChange}
      checked={formData.amenitiesAll.includes('Flower Garden')}
    />
    <label className="form-check-label" htmlFor="inlineCheckbox3">Flower Garden</label>
  </div> 
  <div className="form-check form-check-inline">
    <input
      className="form-check-input"
      type="checkbox"
      id="inlineCheckbox3"
      name="amenitiesAll"
      value="Outdoor Dining Areas"
      onChange={handleChange}
      checked={formData.amenitiesAll.includes('Outdoor Dining Areas')}
    />
    <label className="form-check-label" htmlFor="inlineCheckbox3">Outdoor Dining Areas</label>
  </div> 

</div>

                  <div className='row pt-5'>
                    <h3 className="pt-3">Floor Planining </h3>
                    <div className='col-md-6 pt-4'>
                      <div className='row'>
                        <div className="form-group col-md-10">
                          <label htmlFor="plansTitle">Floor Title</label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="plansTitle"
                            name="plansTitle"
                            placeholder="Floor Planining Title"
                            value={formData.plansTitle}
                            onChange={handleChange}
                          />

                        </div>
                  
   
                        
                      </div>
                    </div>
                    <div className='col-md-6 pt-4'>
                      <textarea
                        className="form-control form-control-sm mt-4"
                        id="plansDsc"
                        name="plansDsc"
                        style={{ width: 500 }}
                        placeholder="Floor Planining Description"
                        value={formData.plansDsc}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="pt-4">
                      <div className='row'> 
                        <div className='col-md-6'>
                            <select
                              className="form-select form-select-sm"
                              aria-label=".form-select-sm example"
                              style={{ width: 510 }}
                              name="plans"
                              value={formData.plans}
                              onChange={handleChange}
                            >
                              <option value="" selected>Floors</option>
                              <option value="1BR">1BR</option>
                              <option value="2BR">2BR</option>
                            </select>
                            
                            </div>
                            <div className="col-md-4">
                          <input
                            type="file"
                            className="form-control form-select-sm"
                            name="plansImage"
                            accept="image/*"
                            style={{ width: 338 }}
                            onChange={handleChange}
                            multiple  
                          />
                        </div>
                        <div className='col-md-2'>
                          <button type="button" onClick={handleAddFloorPlan} className="btn btn-dark  mb-3">Add</button>
                        </div>
                        
                        </div>
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
                      <div className='row'>
                        <div className="form-group col-md-5">
                          {/* <label htmlFor="log"></label> */}
                        
                        </div>
                        <div className="form-group col-md-5">
                          {/* <label htmlFor="lat">Lat</label> */}
                      
                        </div>
                        <div className='col-md-10'>
                      <input
                            type="text"
                            className="form-control form-control-sm"
                            id="exectLocation"
                            name="exectLocation"
                            placeholder="Exect location"
                            value={formData.exectLocation}
                            onChange={handleChange}
                          />
                          </div>
                      </div>
                 
                    </div>
                    <div className='col-md-5 pt-4'>
                    <label htmlFor="log">Location Title</label>
                          <input
                            type="text"
                            className="form-control form-control-sm "
                            id="locationTitle"
                            name="locationTitle"
                            placeholder="Location"
                            value={formData.locationTitle}
                            onChange={handleChange}
                          />   
                      <textarea
                        className="form-control form-control-sm mt-4"
                        id="locationDsc"
                        name="locationDsc"
                        style={{ width: 500 }}
                        placeholder="Location Description"
                        value={formData.locationDsc}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className='row pt-4'>
                 
                 Location with Time 
                 <div className='col-md-3'>    <input
                            type="text"
                            className="form-control form-control-sm"
                            id="time"
                            name="time"
                            placeholder="Location time"
                            value={formData.time}
                            onChange={handleChange}
                          /></div>
                        <div className='col-md-3'>         <input
                            type="text"
                            className="form-control form-control-sm"
                            id="locationAllinput"
                            name="locationAllinput"
                            placeholder="Location name"
                            value={formData.locationAllinput}
                            onChange={handleChange}
                          /></div>
                         <div className='col-md-3'>   
                         <button type="button" onClick={handleAddTime} className="btn btn-dark  mb-3">Add</button>
                     </div>
                                             
                 </div>
                  <div className='row pt-5'>
                    <h3 className="pt-3">Qus Ans </h3>
                  
                      <div className='row'>
                        <div className='col-md-11'>
                      <label htmlFor="qus">Qus</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="qus"
                        name="qus"
                        placeholder="Add Qustion"
                        value={formData.qus}
                        onChange={handleChange}
                      />
                             <textarea
                        className="form-control form-control-sm mt-4"
                        id="ans"
                        name="ans"
                     
                        placeholder="Answer "
                        value={formData.ans}
                        onChange={handleChange}
                      />

<button type="button"    onClick={handleAddQusAns} className="btn btn-dark mt-3 px-5 mb-3">Add</button>
                  
   
                        
                      </div>
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

export default EditOffplan;

