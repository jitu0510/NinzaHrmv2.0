import React, { Component,useEffect,useState} from 'react';
import {getUserName} from '../Services/AuthenticationService.js'
import {getEmpDetails} from '../Services/UserService'
import '../CSS/profiledashboard.css'
import Logo from './Logo';
import { useHistory, Link } from 'react-router-dom';
import acoe from './ACOE3.png';
const DashBoardContent =()=>{

    const history = useHistory();   
  const [userName,setUsername]= useState('')
  const [userDetails,setUserDetails] = useState({})

  const logoSrc = '../../emp.png'; 
  const logoAlt = 'Your Logo Alt Text';

  useEffect(() => {

      const pageUrl =  localStorage.getItem("page");
      if(pageUrl!=null){
        history.push(pageUrl);
        localStorage.setItem("page","/welcome");
      }
      console.log('PageUrl:'+pageUrl);
        setUsername(getUserName())
        const name = getUserName().substr(1,getUserName().length-2)
    
       getEmpDetails(name).then((response)=>{
           setUserDetails(response.data)
       })

  }, [])
        return(
         
          <div class="container-fluid emp-profile">
                <div class="row">
                    <div class="col-md-4">
                        <div class="profile-img">
                       <a href="/"> <Logo  src={logoSrc} alt={logoAlt} /></a>
                            {/* <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS52y5aInsxSm31CvHOFHWujqUx_wWTS9iM6s7BAm21oEN_RiGoog" alt=""/> */}
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="profile-head">
                                    <h3>
                                       {userDetails.empName}
                                    </h3>
                                    <h4>
                                        {userDetails.designation}
                                    </h4>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-8">
                        <div class="tab-content profile-tab" id="myTabContent">
                            <div style={{padding: 40}} id="home"  aria-labelledby="home-tab">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <label>User Id</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>{userDetails.empId}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <label>Username</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>{userDetails.username}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <label>Name</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>{userDetails.empName}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <label>Email</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>{userDetails.email}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <label>Phone</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>{userDetails.mobileNo}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <label>Profession</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>{userDetails.designation}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <label>Experience</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>{userDetails.designation}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <label>Role</label>
                                            </div>
                                            <div class="col-md-6">
                                                <p>{userDetails.role}</p>
                                            </div>
                                        </div>
                            </div>
                        </div>
                    </div>
                </div>   
                <div style={{marginLeft:"35%",marginTop:"0%"}}>
<footer>Designed and Developed by  <img src={acoe} alt="" width="40px" /> </footer>

</div>      
        </div>
        )


}

export default DashBoardContent