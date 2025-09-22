import React,{Component} from 'react';
import {isUserLoggedIn} from '../Services/AuthenticationService.js'
import { Route, Redirect } from 'react-router-dom';




const AuthenticatedRoute =({component:Component,...rest})=>{
   
    return(
       <Route 
       {...rest}
       render={props=>{
           if(isUserLoggedIn())
           {return <Component {...props} />}
           else
           {
               return <Redirect to="/" />
           }
       }}
    />
    );
}

export default AuthenticatedRoute;