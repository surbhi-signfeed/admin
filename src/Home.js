import { Form, Button, Container, Nav } from 'react-bootstrap';
import React, { Component, useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Route, Link, Router, Routes, Navigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-select/dist/css/bootstrap-select.min.css';

import { fetch } from 'whatwg-fetch';
import Admin from './pages/Admin';
import PropertyList from './pages/PropertyList';
import AddProperty from './pages/AddProperty';
import AddOffplan from './pages/AddOffplan';
import Addevents from './pages/Addevents';
import Addblogs from './pages/Addblogs';
import ViewBlog from './pages/ViewBlog';
import Subadmin from './pages/Subadmin'; 
import CreateSubadmin from './pages/CreateSubadmin'; 
import Rentform from './pages/Rentform';  
import Offplanform from './pages/Offplanform';
import SellForm from './pages/SellForm'; 
import EventsFrom from './pages/EventsFrom'; 
import Addareaguide from './pages/Addareaguide'; 
import OffplanList from './pages/OffplanList';  
import EventList from './pages/EventList';
import Editeevents from './pages/Editeevents';  
import AreaguideList from './pages/AreaguideList';   
import EditeBRproperty from './pages/EditeBRproperty';  
import Login from './pages/Login';  
import BlogList from './pages/BlogList';  
import EditeOffplan from './pages/EditeOffplan';  
import Editeareaguide from './pages/Editeareaguide';  
import Editeblogs from './pages/Editeblogs';  
import Contactus from './pages/Contactus';  
import Career from './pages/Career';  
import MortgageForm from './pages/MortgageForm'; 
import SubscribeForm from './pages/SubscribeForm';  
import './App.css';

function Home() {


  return (


    <div>



      <Routes >
        <Route exact path="/Admin" element={<Admin />}></Route>
        <Route exact path="/PropertyList" element={<PropertyList />}></Route>
        <Route exact path="/AddProperty" element={<AddProperty />}></Route>
        <Route exact path="/AddOffplan" element={<AddOffplan />}></Route>
        <Route exact path="/Addevents" element={<Addevents />}></Route>
        <Route exact path="/Addblogs" element={<Addblogs />}></Route>
        <Route exact path="/ViewBlog/:id" element={<ViewBlog />}></Route> 
        <Route exact path="/Subadmin" element={<Subadmin />}></Route>
        <Route exact path="/CreateSubadmin" element={<CreateSubadmin />}></Route> 
        <Route exact path="/Rentform" element={<Rentform />}></Route>  
        <Route exact path="/Offplanform" element={<Offplanform />}></Route>    
        <Route exact path="/SellForm" element={<SellForm />}></Route>  
        <Route exact path="/EventsFrom" element={<EventsFrom />}></Route> 
        <Route exact path="/Addareaguide" element={<Addareaguide />}></Route> 
        <Route exact path="/OffplanList" element={<OffplanList />}></Route>  
        <Route exact path="/EventList" element={<EventList />}></Route>  
        <Route exact path="/AreaguideList" element={<AreaguideList />}></Route>  
        <Route exact path="/EditeBRproperty/:id" element={<EditeBRproperty />}></Route>
        <Route exact path="/Editeevents/:id" element={<Editeevents />}></Route> 
        <Route exact path="/EditeOffplan/:id" element={<EditeOffplan />}></Route>  
        <Route exact path="/Editeareaguide/:id" element={<Editeareaguide />}></Route>   
        <Route exact path="/Editeblogs/:id" element={<Editeblogs />}></Route>    
        <Route exact path="/BlogList" element={<BlogList />}></Route> 
        <Route exact path="/Contactus" element={<Contactus />}></Route> 
        <Route exact path="/Career" element={<Career />}></Route> 
        <Route exact path="/MortgageForm" element={<MortgageForm />}></Route>
        <Route exact path="/SubscribeForm" element={<SubscribeForm />}></Route>  
        <Route exact path="/" element={<Login />}></Route> 
      </Routes> 

    </div>



  );

}

export default Home;
