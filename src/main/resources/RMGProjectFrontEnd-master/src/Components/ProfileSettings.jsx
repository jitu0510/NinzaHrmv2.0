import React, { useEffect, useRef, useState } from "react";
import { getNewToken } from "../Services/KeycloakService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import acoe from './ACOE3.png';
const ProfileSettings = () => {
  let [token, setToken] = useState(localStorage.getItem("jwt"));
  let [popup, setPopup] = useState({ content: "", type: false, status: "" });
  const inputRef = useRef(null);

  const changeToken = () => {
    let myToken = localStorage.getItem("refresh_token");
    getNewToken(myToken)
      .then((data) => {
        if (data.status === 200) {
          setToken(data.data);
          setPopup({
            content: "Token Generated Successfully",
            type: true,
            status: "success",
          });
        } else {
          setPopup({
            content: "Token Generation failed",
            type: true,
            status: "danger",
          });
        }
        setTimeout(() => {
          setPopup({ content: "", type: false, status: "" });
        }, 3000);
      })
      .catch(() => {
        setPopup({
          content: "Token Generation failed",
          type: true,
          status: "danger",
        });
        setTimeout(() => {
          setPopup({ content: "", type: false, status: "" });
        }, 15000);
      });
  };

  // const copyToClipboard = () => {
  //   if (!navigator.clipboard) {
  //     fallbackCopyTextToClipboard(token);
  //     return;
  //   }
  //   navigator.clipboard.writeText(token).then(() => {
  //     alert("Token copied to clipboard!");
  //   }).catch(err => {
  //     console.error("Failed to copy token: ", err);
  //     alert("Failed to copy token.");
  //   });
  // };
  
  // function fallbackCopyTextToClipboard(text) {
  //   const textArea = document.createElement("textarea");
  //   textArea.value = text;
  //   textArea.style.position = "fixed";  // Avoid scrolling to bottom
  //   document.body.appendChild(textArea);
  //   textArea.focus();
  //   textArea.select();
  
  //   try {
  //     const successful = document.execCommand('copy');
  //     if (successful) {
  //       alert('Token copied to clipboard!');
  //     } else {
  //       alert('Failed to copy token.');
  //     }
  //   } catch (err) {
  //     console.error('Fallback: Oops, unable to copy', err);
  //   }
  
  //   document.body.removeChild(textArea);
  // }
  

  useEffect(() => {
    localStorage.setItem("jwt", token);
  }, [token]);

  useEffect(() => {
    localStorage.setItem("page", "/dashboard/settings");
  }, []);

  const handleFocus = () => {
    if (inputRef.current) {
      // Set the cursor to the end of the input value
      inputRef.current.setSelectionRange(token.length, token.length);
      // Scroll to the end of the input value
      inputRef.current.scrollLeft = inputRef.current.scrollWidth;
    }
  };

  return (
    <div className="container-fluid register-form">
      <div className="form" style={{ width: "500px", margin: "auto" }}>
        <div className="form-content">
          <div className="row">
            <div className="col-md-12">
              <div
                className="form-group formGroup"
                style={{ display: "flex", alignItems: "center", marginBottom: "0px !important" }}
              >
                <label htmlFor="" style={{ width: "180px" }}>
                  Bearer Token
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                  value={token}
                  readOnly
                  ref={inputRef}
                  onFocus={handleFocus}
                  style={{ marginRight: "10px" }}
                />
                {/* <button onClick={copyToClipboard} style={{
                  background: "none",
                  backgroundColor: "grey",
                  marginTop: "-12px",
                  marginLeft: "5px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "22px", // Adjust the font size for a larger icon
                  padding: "2px",
                }}>
                  <FontAwesomeIcon icon={faCopy} />
                </button> */}
              </div>
            </div>
            {popup.type ? (
              <div className="col-md-12" style={{ display: "flex", justifyContent: "center", marginBottom: "25px" }}>
                <span className={`badge bg-${popup.status}`}>{popup.content}</span>
              </div>
            ) : null}
            <div className="col-md-12">
              <div
                className="form-group"
                style={{ display: "flex", alignItems: "center" }}
              >
                <label htmlFor="" style={{ width: "165px" }}>
                  Token Lifespan
                </label>
                <select className="form-control">
                  <option value="empId" defaultChecked>
                    Select Lifespan
                  </option>
                  <option value="5min">5 min</option>
                  <option value="10min">10 min</option>
                  <option value="15min">15 min</option>
                  <option value="25min">25 min</option>
                </select>
              </div>
            </div>

            <div className="col-md-12">
              <div
                className="form-group formGroup"
                style={{ display: "flex", alignItems: "center", marginBottom: "0px !important" }}
              >
                <label htmlFor="" style={{ width: "125px", marginTop: "12px" }}>
                  Authorization:
                </label>
              </div>
            </div>

            {/* For Projects */}
            <div className="col-md-12">
              <div
                className="form-group formGroup"
                style={{ display: "flex", alignItems: "center", marginBottom: "0px !important" }}
              >
                <label htmlFor="" style={{ width: "125px", marginTop: "12px" }}>
                  Projects
                </label>
                <div style={{ display: "flex" }}>
                  <div style={{ display: "flex", alignItems: "center", marginRight: "15px" }}>
                    <input type="checkbox" id="read" name="permission" value="read" />
                    <label htmlFor="read" style={{ marginLeft: "4px", marginTop: "12px" }}>Read</label>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", marginRight: "15px" }}>
                    <input type="checkbox" id="Create" name="permission" value="Create" />
                    <label htmlFor="Create" style={{ marginLeft: "4px", marginTop: "12px" }}>Create</label>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", marginRight: "15px" }}>
                    <input type="checkbox" id="update" name="permission" value="update" />
                    <label htmlFor="update" style={{ marginLeft: "4px", marginTop: "12px" }}>Update</label>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input type="checkbox" id="delete" name="permission" value="delete" />
                    <label htmlFor="delete" style={{ marginLeft: "4px", marginTop: "12px" }}>Delete</label>
                  </div>
                </div>
              </div>
            </div>

            {/* For Employees */}
            <div className="col-md-12">
              <div
                className="form-group formGroup"
                style={{ display: "flex", alignItems: "center", marginBottom: "0px !important" }}
              >
                <label htmlFor="" style={{ width: "125px", marginTop: "12px" }}>
                  Employees
                </label>
                <div style={{ display: "flex" }}>
                  <div style={{ display: "flex", alignItems: "center", marginRight: "15px" }}>
                    <input type="checkbox" id="read" name="permission" value="read" />
                    <label htmlFor="read" style={{ marginLeft: "4px", marginTop: "12px" }}>Read</label>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", marginRight: "15px" }}>
                    <input type="checkbox" id="Create" name="permission" value="Create" />
                    <label htmlFor="Create" style={{ marginLeft: "4px", marginTop: "12px" }}>Create</label>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", marginRight: "15px" }}>
                    <input type="checkbox" id="update" name="permission" value="update" />
                    <label htmlFor="update" style={{ marginLeft: "4px", marginTop: "12px" }}>Update</label>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input type="checkbox" id="delete" name="permission" value="delete" />
                    <label htmlFor="delete" style={{ marginLeft: "4px", marginTop: "12px" }}>Delete</label>
                  </div>
                </div>
              </div>
            </div>

            {/* For Payroll */}
            <div className="col-md-12">
              <div
                className="form-group formGroup"
                style={{ display: "flex", alignItems: "center", marginBottom: "0px !important" }}
              >
                <label htmlFor="" style={{ width: "125px", marginTop: "12px" }}>
                  Payroll
                </label>
                <div style={{ display: "flex" }}>
                  <div style={{ display: "flex", alignItems: "center", marginRight: "15px" }}>
                    <input type="checkbox" id="read" name="permission" value="read" />
                    <label htmlFor="read" style={{ marginLeft: "4px", marginTop: "12px" }}>Read</label>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", marginRight: "15px" }}>
                    <input type="checkbox" id="Create" name="permission" value="Create" />
                    <label htmlFor="Create" style={{ marginLeft: "4px", marginTop: "12px" }}>Create</label>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", marginRight: "15px" }}>
                    <input type="checkbox" id="update" name="permission" value="update" />
                    <label htmlFor="update" style={{ marginLeft: "4px", marginTop: "12px" }}>Update</label>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input type="checkbox" id="delete" name="permission" value="delete" />
                    <label htmlFor="delete" style={{ marginLeft: "4px", marginTop: "12px" }}>Delete</label>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={changeToken}
              >
                Generate New Token
              </button>
            </div>
          </div>
        </div>
      </div>
      <div style={{marginLeft:"40%",marginTop:"14%"}}>
<footer>Designed and Developed by  <img src={acoe} alt="" width="40px" /> </footer>

</div>
    </div>
    
  );
};

export default ProfileSettings;
