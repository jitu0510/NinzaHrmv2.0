import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { Field, Form } from 'formik';
import { Formik } from 'formik';
import { useHistory } from 'react-router-dom';
import "../CSS/DemoRequestComponent.css"
import { data } from 'jquery';
import {  toast } from 'react-toastify';
import { requestDemo } from '../Services/demoRequest';
const DemoRequestComponent = () => {
  const { register, handleSubmit } = useForm();
  const [phoneNumber, setPhoneNumber] = useState();
  const history = useHistory();
  const containerStyle = {
    backgroundImage: `url('../../SignIn_BG.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh', // Adjust the height as needed
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
    //color: '#fff', // Text color for better visibility
  };

  const initialValues = {
    name: '',
    email: '',
    countryCode:'',
    contact: '',
    notify: false
  };
  const dataObject = {name: '',email: '',contact: '',notify: false}
  const onSubmit = (values) => {
    console.log('Form Data:', values);
    console.log('Contact',values.countryCode)
    // Perform any other actions you need here
    
    dataObject.name = values.name;
    dataObject.email = values.email;
    if ((values.contact.countryCode)==undefined) {
      values.contact.countryCode = '+91';
    }
    
    dataObject.contact = values.contact.countryCode+''+values.contact.phoneNumber;
    dataObject.notify = values.notify;
    console.log(dataObject);

    requestDemo(dataObject)
      .then((resp)=>{
        console.log(resp);
        toast.success('Hey ' + dataObject.name + ', We have received your request ');
      })
      .catch(error =>{
        console.log("Something Went Wrong");
        toast.error("Something Went Wrong !!!")
      })

  };
  return (
    <div className="my-form" style={containerStyle}>
      <div className="container-flex" style={{borderRadius:'10px'}}>
        <ToastContainer />
        <div className="row justify-content-center">
          <div className="col-md-6 mt-5">
            <div className="card" style={{ minWidth: '700px', marginBottom: '50px' }}>
              <div className="card-header" style={{ backgroundColor: "#435d7d", color: "white",borderRadius:'10px' }}>
                Demo Request
                <button className="close-button" style={{marginLeft:'520px',padding:'5px 10px'}} onClick={() => { history.push('/') }}>
                  &#10006;
                </button>
              </div>
              <div className="card-body">
                <Formik initialValues={initialValues} onSubmit={onSubmit}>
                  <Form name="my-form">
                    <div className="form-group row">
                      <label htmlFor="full_name" className="col-md-4 col-form-label text-md-right">
                        Name*
                      </label>
                      <div className="col-md-6">
                        <Field
                          type="text"
                          id="full_name"
                          className="form-control"
                          name="name"
                          required="true"
                          ref={register({ required: true, minLength: 6 })}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label htmlFor="email_address" className="col-md-4 col-form-label text-md-right">
                        E-Mail Address*
                      </label>
                      <div className="col-md-6">
                        <Field
                          type="email"
                          id="email_address"
                          className="form-control"
                          name="email"
                          required="true"
                          ref={register({
                            required: true,
                            pattern: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
                          })}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label htmlFor="phone_number" className="col-md-4 col-form-label text-md-right">
                        Phone Number
                      </label>
                      <div className="col-md-6">
                      <Field name="contact">
  {(props) => (
    <div className="phone-input-container">
      <select
        id="country_code"
        className="country-code-select"
         value={props.field.value.countryCode}
        onChange={(e) =>
          props.form.setFieldValue("contact", {
            countryCode: e.target.value,
            phoneNumber: props.field.value.phoneNumber,
          })
        }
      >
        {/* Add country code options as needed */}
        <option value="+91">+91 (India)</option>
        <option value="+1">+1 (United States)</option>
<option value="+44">+44 (United Kingdom)</option>
<option value="+81">+81 (Japan)</option>
<option value="+86">+86 (China)</option>
<option value="+33">+33 (France)</option>
<option value="+49">+49 (Germany)</option>
<option value="+7">+7 (Russia)</option>
<option value="+55">+55 (Brazil)</option>
<option value="+61">+61 (Australia)</option>
<option value="+234">+234 (Nigeria)</option>
<option value="+52">+52 (Mexico)</option>
<option value="+27">+27 (South Africa)</option>
<option value="+82">+82 (South Korea)</option>
<option value="+1">+1 (Canada)</option>
<option value="+65">+65 (Singapore)</option>
<option value="+62">+62 (Indonesia)</option>
<option value="+20">+20 (Egypt)</option>
<option value="+49">+49 (Germany)</option>
<option value="+30">+30 (Greece)</option>
<option value="+81">+81 (Japan)</option>
<option value="+39">+39 (Italy)</option>
<option value="+64">+64 (New Zealand)</option>
<option value="+47">+47 (Norway)</option>
<option value="+63">+63 (Philippines)</option>
<option value="+7">+7 (Russia)</option>
<option value="+34">+34 (Spain)</option>
<option value="+46">+46 (Sweden)</option>
<option value="+41">+41 (Switzerland)</option>
<option value="+90">+90 (Turkey)</option>
<option value="+971">+971 (United Arab Emirates)</option>
<option value="+598">+598 (Uruguay)</option>
<option value="+998">+998 (Uzbekistan)</option>
<option value="+58">+58 (Venezuela)</option>
<option value="+84">+84 (Vietnam)</option>

       
        {/* Add more options based on your requirements */}
      </select>
      <input
        type="tel"
        id="phone_number"
        className="form-control"
        name="phoneNumber"
        placeholder="Enter phone number"
        pattern="[0-9]{10}" // Customize the pattern based on your requirements
        value={props.field.value.phoneNumber}
        onChange={(e) =>
          props.form.setFieldValue("contact", {
            countryCode: props.field.value.countryCode,
            phoneNumber: e.target.value,
          })
        }
        
      />
    </div>
  )}
</Field>


                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-md-6 offset-md-4">
                        <div className="form-check">
                          <Field
                            className="form-check-input"
                            type="checkbox"
                            id="notify"
                            name="notify"
                            ref={register({ required: false })}
                          />
                          <label className="form-check-label" htmlFor="terms">
                            &nbsp; &nbsp; &nbsp; &nbsp; Notify me through email
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="form-group row" style={{ justifyContent: "center" }}>
                      <div className="col-md-6 offset-md-4">
                        <button type="submit" name="submit" className="btn btn-primary">
                          Submit
                        </button>
                      </div>
                    </div>
                  </Form>
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoRequestComponent;
