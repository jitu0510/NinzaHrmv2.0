import React,{useEffect} from 'react';
import {isUserLoggedIn} from '../Services/AuthenticationService.js'
import { useHistory } from 'react-router-dom';


const ErrorComponent = ()=>{
  const history = useHistory();

    useEffect(() => {

      if(isUserLoggedIn()){

        history.push('/dashboard')
       
          
      }
      else{
        history.push('/')
      }
      
    }, [])
    return(
        <div>
          <h1>Page Not Found</h1>
        </div>
    )
}

export default ErrorComponent