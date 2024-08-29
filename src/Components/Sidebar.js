// Sidebar.js

import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
    return (
          <div>
             

{/* <!-- Sidebar --> */}
<ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
{/* 
  <!-- Sidebar - Brand --> */}
  <a class="sidebar-brand d-flex align-items-center justify-content-center" href={"/Admin"}>
    
    <div class="sidebar-brand-icon ">
    <img class="img-profile rounded" src={"asserts/img/HJ.png"} style={{height:80}}/>
    </div>
  </a>
  {/* <hr class="sidebar-divider my-0"/>
  <hr class="sidebar-divider"/> */}

{/* 
  
  <!-- Nav Item - Pages Collapse Menu --> */}
  <li class="nav-item">
    <Link class="nav-link" to={"/Admin"}>
     <i class="fas fa-fw fa-cog"></i>
      <span >Dashboard </span></Link>
  </li>
  
  <li class="nav-item">
    <a class="nav-link collapsed" href="users.html" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
      <i class="fas fa-fw fa-cog"></i>
      <span>Add Propertys</span>
    </a>
    <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
      <div class="bg-white py-2 collapse-inner rounded">
        
      <Link to="/AddProperty" className="collapse-item">Add Rent/Buy</Link>
        <Link to="/AddOffplan" className="collapse-item">Add offplan</Link>
       
        
        
        
      </div>
    </div>
  </li>
  <li class="nav-item">
    <a class="nav-link collapsed" href="users.html" data-toggle="collapse" data-target="#collapseFive" aria-expanded="true" aria-controls="collapseFive">
      <i class="fas fa-fw fa-cog"></i>
      <span>View Propertys</span>
    </a>
    <div id="collapseFive" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
      <div class="bg-white py-2 collapse-inner rounded">
      <Link to="/PropertyList" className="collapse-item">Rent/Buy Propertys</Link>
      <Link to="/EventList" className="collapse-item">Events List</Link>
      <Link to="/OffplanList" className="collapse-item">Off-Plan Propertys</Link>
      <Link to="/AreaguideList" className="collapse-item">Area-Guides</Link>
      <Link to="/BlogList" className="collapse-item">Blogs</Link>


        
        
      </div>
    </div>
  </li>
  <li class="nav-item">
 

  <Link to="/Addevents" className="collapse-item nav-link ">
       <i class="fas fa-fw fa-cog"></i>
 <span >Add Events</span>
 </Link>
  </li>
   
  
  <li class="nav-item" >
  <Link to="/Addblogs" className="collapse-item nav-link ">
       <i class="fas fa-fw fa-cog"></i>
 <span >Add Blogs</span>
 </Link>
  </li>

  <li class="nav-item" >
  <Link to="/Addareaguide" className="collapse-item nav-link ">
       <i class="fas fa-fw fa-cog"></i>
 <span >Add Area-Guide</span>
 </Link>
   
  </li>

  <li class="nav-item" >
  <Link to="/Subadmin" className="collapse-item nav-link ">
       <i class="fas fa-fw fa-cog"></i>
 <span >Create Sub-Admin</span>
 </Link>
   
  </li>
  

  <li class="nav-item">
    <a class="nav-link collapsed" href="users.html" data-toggle="collapse" data-target="#collapseFour" aria-expanded="true" aria-controls="collapseFour">
      <i class="fas fa-fw fa-cog"></i>
      <span>Froms Details</span>
    </a>
    <div id="collapseFour" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
      <div class="bg-white py-2 collapse-inner rounded">
      <Link to="/EventsFrom" className="collapse-item">Events Form</Link>
      <Link to="/SellForm" className="collapse-item">SellForm From</Link>
      <Link to="/Offplanform" className="collapse-item">Off-Plan Form</Link>
      <Link to="/Rentform" className="collapse-item">Rent/Buy Form</Link>


        
        
      </div>
    </div>
  </li>
  <li class="nav-item">
    <a class="nav-link collapsed" href="users.html" data-toggle="collapse" data-target="#collapseSix" aria-expanded="true" aria-controls="collapseSix">
      <i class="fas fa-fw fa-cog"></i>
      <span>Froms Details</span>
    </a>
    <div id="collapseSix" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
      <div class="bg-white py-2 collapse-inner rounded">
      <Link to="/Contactus" className="collapse-item">Contact-us Form</Link>
      <Link to="/Career" className="collapse-item">Career From</Link>
      <Link to="/MortgageForm" className="collapse-item">Mortgage Form</Link>
      <Link to="/SubscribeForm" className="collapse-item">Subscribe Form</Link>


        
        
      </div>
    </div>
  </li>
 
{/* 
  <!-- Nav Item - Utilities Collapse Menu --> */}
  

  {/* <!-- Divider --> */}
  

  
 

 {/*  <!-- Sidebar Toggler (Sidebar) --> */}
 
</ul>
        </div>
    );
}

export default Sidebar;
