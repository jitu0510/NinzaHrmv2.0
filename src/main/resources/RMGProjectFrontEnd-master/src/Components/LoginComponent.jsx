import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
// import { TextField } from "@mui/material";
// import { TextField } from "@mui/material";
import LabeledPasswordInput from "./PasswordInput";
// import {signInRequest,signOutReq} from "../api/api_services";
import { login, registerSuccessfulLogin } from "../Services/AuthenticationService";
import { Link, NavLink, useHistory, useLocation } from "react-router-dom";

// import { makeStyles } from '@mui/styles';
// import fireflinkwhitelogo from "../../ACOE3.png"
import { useForm } from 'react-hook-form';
import '../CSS/LoginComponent.css';
import LoginWithDelay from "./LoginWithDelay";


const DOMAIN_URL = process.env.REACT_APP_MANAGEMENT_DOMAIN_NAME;

const  LoginComponent = () => {
  const [showError, setShowError] = useState(false);
  const [errorContent, setErrorContent] = React.useState();
  const [callingAPI,setCallingAPI]=useState(false);
  // const [captcha, setCaptcha] = useState(generateCaptcha());
  const [userAnswer, setUserAnswer] = useState('');
  
  
  const { register, handleSubmit, errors } = useForm();
  // const field = useStyles();

  const containerStyle = {
    backgroundImage: `url('../../SignIn_BG.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh', // Adjust the height as needed
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    //color: '#fff', // Text color for better visibility
  };
  
  
 
  const onSubmit = (data) => {
    // const expectedAnswer = evalCaptcha(captcha);

    // console.log(expectedAnswer);
    login(data)
      .then((response) => {
        const { role, username, access_token,refresh_token } = response.data;
        // console.log(role+" "+username+" "+access_token+" "+refresh_token);
        registerSuccessfulLogin(username, role, access_token,refresh_token);
        history.push("/dashboard");
      })
      .catch((error) => {
        window.alert("Invalid Credentials");
        console.error(error);
      });
  };
  

  function handleKeyDown(event) {
    if (event.key === " ") {
      event.preventDefault();
    }
  }const history = useHistory();

  // function generateCaptcha() {
  //   const num1 = Math.floor(Math.random() * 10);
  //   const num2 = Math.floor(Math.random() * 10);
  //   const sum = num1+num2;
  //   console.log(`Sum of ${num1} and ${num2} is: ${sum}`);
  //   return `${num1} + ${num2} = ?`;
  // }
/*
  const history = useHistory();
  const formik = useFormik({
    initialValues: {
      userName: "",
      password: "",
      feedback: ""
    },
    validationSchema: Yup.object({
      userName: Yup.string()
        .matches(
          /[A-Za-z0-9]+@[a-zA-Z]+\.[A-Za-z]{2,3}/,
          "Enter valid email Id"
        )
        .email("Enter valid email Id")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: (values) => {
      setCallingAPI(true)
      let data={
        userName: values.userName,
        password: values.password
      }
      login(data).then((res)=>{
        //added
        const { role, username, jwtToken } = res.data;
        registerSuccessfulLogin(username, role, jwtToken);
        history.push("/dashboard");
        


      }).catch((error)=>{
        setCallingAPI(false)
        console.log("error",error)
      })
      console.log("onsubmit",values)
     
     
    },
  });*/
  return (
    <div style={containerStyle}>
    <section className="sign_up">
      <div className="container">
      
        <div className="row">
          <div className="col-lg-6 mt_100">
           
          {/* <h1>THE ALL-IN-ONE INTEGRATED TESTING PLATFORM</h1> */}
            <p className="mt_30">
                
            </p>
            <h2 className="mt_10">
             <b> <h1 style={{fontSize:"60px",marginTop:"90px",marginLeft:"-40px",fontWeight:'bold',color:"#FFFFFF",WebkitTextStroke:'2px grey'}}>Ninza HRM</h1> </b>
              <LoginWithDelay ></LoginWithDelay>
            </h2>
          </div>
          <div className="col-lg-6 mt_100">
            
      
          
      
        <div className="col-sm-9 col-md-9 col-lg-12">
          <div className="card shadow-lg" style={{borderRadius:"10px"}}>
            <div className="card-body p-4" >
              {/* Company Logo */}
              
  
              <h2 className="card-title text-center mb-4" style={{color:"black"}} >Sign In</h2>
              <form className="form-signin" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-floating mb-3">
                <label  htmlFor="username">Username</label>
                  <input 
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Enter Your UserName"
                    className={`form-control ${errors.username && 'is-invalid'}`}
                    // placeholder="Username"
                    ref={register({ required: true })}
                  />
                  
                  {errors.username && errors.username.type === "required" && (
                    <div className="invalid-feedback">Username is required</div>
                  )}
                </div>
  
                <div className="form-floating mb-3">
                <label htmlFor="inputPassword">Password </label>
                  <input
                    
                    type="password"
                    id="inputPassword"
                    name="password"
                    p
                    className={`form-control ${errors.password && 'is-invalid'}`}
                    placeholder="Enter Your Password"
                    ref={register({ required: true })}
                  />
                  
                  {errors.password && errors.password.type === "required" && (
                    <div className="invalid-feedback">Password is required</div>
                  )}
                </div>
{/* 
                <div className="form-floating mb-3">
          <label htmlFor="captcha">CAPTCHA: {captcha}</label>
          <input
            type="text"
            id="captcha"
            name="captcha"
            placeholder="Enter the result of the CAPTCHA"
            className={`form-control ${errors.captcha && 'is-invalid'}`}
            onChange={(e) => setUserAnswer(e.target.value)}
            ref={register({ required: true })}
          />
          {errors.captcha && errors.captcha.type === "required" && (
            <div className="invalid-feedback">CAPTCHA is required</div>
          )}
        </div> */}



                <b><a hidden='true' href="" className="underlined-link">forgot password?</a></b>
  
                <button className="btn btn-primary btn-lg btn-block" type="submit">
                  Sign in
                </button>
                <hr className="my-4"></hr>
                {/* <a href=""
                  // className="btn btn-outline-secondary btn-lg btn-block"
                  // onClick={() => history.push('/signup')}
                >
                  Create Account
                </a> */}
                <b hidden='true' className="createAccount">Don't have an account?<a href="/signup" className="underlined-link">Create Account</a></b>
                <hr style={{color:'black',width:'100%'}} />
                
                <button id="request-demo" className="btn btn-info btn-lg btn-block" onClick={()=> history.push("/demo")}>
                  Request For Demo
                </button>
                
              </form>
            </div>
          </div>
        
      
  
  
                    


      </div>
                 
       
  
  
        
  
          </div>
        </div>
        
      </div>
      
    </section>
    </div>
  );
};
export default LoginComponent;
