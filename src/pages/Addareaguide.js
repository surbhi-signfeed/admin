import React, { useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import FroalaEditor from 'react-froala-wysiwyg';
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
import axios from 'axios';
import Sidebar from '../Components/Sidebar';
import Navbarfg from '../Components/Navbar';
import Footer from '../Components/Footer';
import Editor from '../Components/Editor';
import Swal from 'sweetalert2';

import '../App.css';

function Blogs() {
  const navigate = useNavigate();
  useEffect(()=>{
    if(sessionStorage.getItem("userData") == null)
    {
      navigate('/')
    }
  },[])
  const [froalaContent, setFroalaContent] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortTitle:'',
    featureImage: null,
  });

  const froalaConfig = {
    imageUploadURL: 'http://localhost:4000/api/upload_image', // Use your actual API URL
    imageUploadParams: {
      id: 'my_editor'
    },
    toolbarButtons: [
      'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript',
      'fontFamily', 'fontSize', '|', 'color', 'emoticons', 'inlineStyle', 'paragraphStyle',
      '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote',
      'insertHR', '-', 'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable',
      '|', 'undo', 'redo', 'clearFormatting', 'selectAll', 'html'
    ]
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('editor', froalaContent);
    data.append('shortTitle', formData.shortTitle);
    data.append('slug', formData.slug);
    data.append('seoTitle', formData.seoTitle);
    data.append('seoDesc', formData.seoDesc);
   
    data.append('seoKeyword', formData.seoKeyword);
    data.append('PageName', formData.PageName);
    if (formData.featureImage) {
      data.append('featureImage', formData.featureImage);
    }

    try {
      const response = await axios.post('http://localhost:4000/api/save-areaguide', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
//       setBlogId(response.data.id);
Swal.fire('Success', 'Data updated successfully', 'success');
//       navigate('/');
    } catch (error) {
      Swal.fire('Error', 'There was an error updating the data', 'error');
    }
    console.log("data",data)
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
                    <h1 className="h3 mb-0 text-white text-center pt-3">Area Guid Information</h1>
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
                          <div className="row pt-4">
                            <div className="col-md-2">Image</div>
                            <div className="col-md-10">
                              <input
                                type="file"
                                className="form-control form-select-sm"
                                name="featureImage"
                                accept="image/*"
                                style={{ width: 390 }}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="form-group col-md-6">
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
                      <div className="form-group col-md-6">
                        <textarea
                          className="form-control form-control-sm mt-4"
                          id="shortTitle"
                          name="shortTitle"
                          style={{ width: 500 }}
                          placeholder="short Title"
                          value={formData.shortTitle}
                          onChange={handleChange}
                        />
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
                      <div className="pt-4">
                      {/* <label htmlFor="title">SEO Keyword</label> */}
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="slug"
                        name="slug"
                        style={{ width: 500 }}
                        placeholder="Add your seo slug"
                        value={formData.slug}
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
                    </div>
                  </form>
                  <div className='mt-5'>
                    <FroalaEditor
                      tag='textarea'
                      model={froalaContent}
                      onModelChange={setFroalaContent}
                      config={froalaConfig}
                    />
                  </div>
                  <button type="button" className="btn btn-dark mt-3 px-5 mb-3" onClick={handleSubmit}>Submit</button>
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

export default Blogs;
