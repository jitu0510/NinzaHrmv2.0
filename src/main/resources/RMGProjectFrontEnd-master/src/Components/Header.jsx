import React,{useState} from 'react';
import { Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faHome, faUsers, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';
import '../CSS/SideBar.css';

const UserIcon = ({ onClick }) => (
  <div className="user-icon" onClick={onClick}>
    <FontAwesomeIcon icon={faUser} />
  </div>
);




const Header = () => {
  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.clear();
    window.location.reload(false);
  };
  const history = useHistory();

  return (
    <nav className="navbar navbar-expand-lg  "  style={{marginLeft:"0px"}}>
    <div className="container-fluid container-color">
      {/* Brand/logo */}
      {/* <Link  className="navbar-brand" style={{fontSize:'25px',marginLeft:"50px"}}>
        Project 
      </Link> */}

      {/* Navbar toggler button for small screens */}
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Navbar links */}
      <div className="collapse navbar-collapse" id="navbarNav" style={{ fontSize:'15px'}}>
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link onClick={() =>{localStorage.setItem("page","/welcome"); history.push("/welcome")}}  className="nav-link">
              <FontAwesomeIcon icon={faHome} /> Home
            </Link>
          </li>
          <li className="nav-item">
            <Link 
             to="/dashboard/users" 
            className="nav-link">
              <FontAwesomeIcon icon={faUsers} /> Profiles
            </Link>
          </li>
          <li className="nav-item">
            <Link 
             to="/dashboard/settings"
             className="nav-link">
              <FontAwesomeIcon icon={faCog} /> Settings
            </Link>
          </li>
        </ul>

        {/* Logout icon */}
        <div className="nav-item ">
          <div className="user-icon" title="Logout" onClick={handleLogout}>
            {/* <FontAwesomeIcon icon={faUser} /> */}
            
        <FontAwesomeIcon icon={faSignOutAlt} /> 
      
          </div>
         
        </div>
        
      </div>
      
    </div>
    
  </nav>
  
    

);
};

export default Header;
