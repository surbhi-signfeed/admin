import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const BlogView = ({ blogId }) => {
  const navigate = useNavigate();
  useEffect(()=>{
    if(sessionStorage.getItem("userData") == null)
    {
      navigate('/')
    }
  },[])
  const [blogContent, setBlogContent] = useState('');
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/blog/${id}`);
        setBlogContent(response.data);
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError('Error fetching blog. Please try again later.');
      }
    };

    fetchBlog();
  }, [id]);

  console.log("details",blogContent)
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2 className='text-center'  style={{ padding: "30px" }} >Blog View</h2>
      <div className='row mt-5'>
        <hr/>
    
          <div className='col-md-2 col-1'></div>
   
          <div className='col-md-8 col-10'>
            <h1 className='blogDsc-h1'>
                   {blogContent.title}
                   </h1>
                   <p className="mt-3 mb-3" style={{    fontSize: "80%"}}>{blogContent.date}</p>
          </div>
          <div className='col-md-2 col-1'></div>
          <hr/>
        
       
        </div>
    
   <div className='row'>
    
    <div className='col-md-2 col-0'></div>
    <div className='col-md-8 col-12'>
   <div dangerouslySetInnerHTML={{ __html: blogContent.content}} /> 
   </div>
   <div className='col-md-2 col-0'></div>
   </div>
    </div>
  );
};

export default BlogView;
