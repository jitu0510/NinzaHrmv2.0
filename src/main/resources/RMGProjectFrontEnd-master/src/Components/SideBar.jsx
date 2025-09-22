import React,{useEffect, useState} from 'react';
import '../CSS/SideBar.css' 
import {BrowserRouter as Router,Route,Switch,Link} from 'react-router-dom'
import { useHistory } from 'react-router-dom';

const SideBar = (propsnm) =>{
    
    
    const history = useHistory();
    useEffect(()=>{
         //history.push("/welcome")
        history.push("/dashboard/overview")
        const currentPage = localStorage.getItem('page');
        if(currentPage!== null){
        history.push(currentPage);
        
        }
    },[])

    const titleClick=()=>{
        localStorage.setItem("page","/welcome");
        history.push("/welcome")
    }
  
    //added
    const logoSrc = '../../Logo2.png';  
    const logoAlt = 'RMGYantra';
    return(
        <nav id="sidebar"  >
            

            <div className="sidebar-header" onClick={titleClick} style={{marginTop:'-20px'}}>
                <div   className="app-container">
                    <h3 style={{fontFamily:'cursive'}}>Ninza-HRM</h3>
                {/* <Logo  src={logoSrc} alt={logoAlt} /> */}

    </div>
                
            </div>

            <ul className="list-unstyled components">
                
                <li>
                    <Link onClick={titleClick}>Home</Link>
                </li>
                <li>
                   
                    <Link 
                     onClick={()=>{history.push(`/dashboard/overview`)}}
                    >Dashboard</Link>
                    
                </li>
                <li>
                     <Link onClick={()=>{history.push(`/dashboard/projects`)}}>Projects</Link> 
                    {/* <Link 
                    // onClick={()=>{history.push(`/dashboard/projects`)}}
                    >Disputes</Link> */}
                    
                </li>
                <li>
                <Link 
                 onClick={()=>{history.push(`/dashboard/users`)}}
                >Employees</Link>
                </li>

                

                {localStorage.getItem("userrole") === 'admin' && (
                    <li>
                        <Link onClick={() => { history.push(`/dashboard/payroll`) }}>Payroll</Link>
                    </li>
                )}
                    

                {/* <li>
                <Link onClick={()=>{history.push(`/dashboard/transactions`)}}>All Transactions</Link>
                </li> */}
                
                {/* <li>
                <Link >RBI Penalties</Link>
                </li>
                 */}
                <li> 
                
                <Link >Status</Link>
                </li>
               
                <li>
                 <Link >Manage</Link> 
                </li>
                 
                <li>
                <Link onClick={()=>{history.push(`/dashboard/settings`)}}>Settings</Link>
                </li>
                <li>
                    
                <Link onClick={()=>{history.push(`/dashboard/resources`)}}>Resources</Link>
                </li>
                <li>
                 <Link >About</Link> 
                </li>

                <li>
                 <Link onClick={()=>{history.push(`/dashboard/chat`)}}>Contact Admin</Link> 
                </li>
                
            </ul>
        </nav>
    )
}

export default SideBar;