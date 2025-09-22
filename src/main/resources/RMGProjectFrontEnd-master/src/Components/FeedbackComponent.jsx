import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addUser, checkUserIsPresent } from '../Services/UserService.js';
import { useHistory } from 'react-router-dom';
import '../CSS/FeedbackComponent.css'
import { addFeedback } from '../Services/FeedbackService.js';
const FeedbackComponent = () => {
  const history = useHistory();
  const { register, handleSubmit, errors, setError } = useForm();
  const [dob, setDob] = useState(null);

  const { name, email,feedback } = errors;
  const containerStyle = {
    backgroundImage: `url('../../SignIn_BG.png')`,
    // backgroundSize: 'cover',
    backgroundSize: 'auto',
    backgroundPosition: 'center',
    height: '100vh', // Adjust the height as needed
    display: 'flex',
    // alignItems: 'center',
    justifyContent: 'center',
    //color: '#fff', // Text color for better visibility
  };


  const onSubmit = (feedbackData) => {
    
    addFeedback(feedbackData)
      .then((response) => {
        
        window.alert("We have received your valuable feedback. Thank You !");
        history.push("/");
      })
      .catch((error) => {
        window.alert("Something Failed");
      });
  };

  return (
   
    <div className="my-form" style={containerStyle}>
      <div className="cotainer-flex">
        <ToastContainer />
        <div className="row justify-content-center">
          <div className="col-md-6 mt-5">
            <div className="card" style={{minWidth:'700px',marginBottom:'50px'}}>
              <div className="card-header" style={{ backgroundColor: "#435d7d", color: "white" }}>
                Feedback Form
                <button className="close-button" style={{marginLeft:'520px'}} onClick={()=>{history.push('/')}}>
        &#10006;
      </button>
              </div>
              <div className="card-body">
                <form name="my-form" onSubmit={handleSubmit(onSubmit)}>
                  <div className="form-group row">
                    <label htmlFor="full_name" className="col-md-4 col-form-label text-md-right">
                       Name   <label className="red-star">*</label>
                    </label>
                    <div className="col-md-6">
                      <input
                        type="text"
                        id="full_name"
                        className="form-control"
                        name="name"
                        ref={register({ required: true, minLength: 6 })}
                      />
                      {name && name.type === "required" && (
                        <p className="mt-3 text-danger">The field is required</p>
                      )}
                      {name && name.type === "minLength" && (
                        <p className="mt-3 text-danger">The length should be min 6 characters</p>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label htmlFor="email_address" className="col-md-4 col-form-label text-md-right">
                      E-Mail Address*                    </label>
                    <div className="col-md-6">
                      <input
                        type="text"
                        id="email_address"
                        className="form-control"
                        name="email"
                        ref={register({
                          required: true,
                          pattern: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
                        })}
                      />
                      {email && email.type === "required" && (
                        <p className="mt-3 text-danger">The field is required</p>
                      )}
                      {email && email.type === "pattern" && (
                        <p className="mt-3 text-danger">Invalid Email ID</p>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label htmlFor="present_address" className="col-md-4 col-form-label text-md-right">
                      Feedback <label className="red-star">*</label>
                    </label>
                    <div className="col-md-6">
                      <input
                        type="text"
                        id="feedback"
                        name="feedback"
                        className="form-control"
                        ref={register({ required: true })}
                      />
                      {feedback && feedback.type === "required" && (
                        <p className="mt-3 text-danger">The field is required</p>
                      )}
                    </div>
                  </div>
                  <div className="form-group row" style={{justifyContent:"center"}}>
                    <div className="col-md-6 offset-md-4">
                      <input type="submit" name="submit" className="btn btn-primary" />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default FeedbackComponent;
