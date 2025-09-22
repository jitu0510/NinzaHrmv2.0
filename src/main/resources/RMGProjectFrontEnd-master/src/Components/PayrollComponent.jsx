import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {  getPaginatedPayroll, getAllPayrolls, updatePayroll } from './../Services/PayrollService';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import { useHistory, Link } from 'react-router-dom';
import Pagination from "react-js-pagination";
import { parseString } from 'xml2js';
import axios from 'axios';
import { decryptData, encryptData } from '../Services/AESService';
import { json } from 'd3';
import acoe from './ACOE3.png';
toast.configure();
Modal.setAppElement('#root');

const PayrollComp = () => {
  const [modelIsOpen, setmodelIsOpen] = useState(false);
  const [payrolls, setPayrolls] = useState([]);
  const [allPayrolls, setAllPayrolls] = useState([]);
  const [deleteProjId, setDeleteProjId] = useState('');
  const [deleteProjName, setDeleteProjName] = useState('');
  const [editPayroll, setEditPayroll] = useState({ payroll_id: '',employeeId: '', basicPlusVda: '', hra: '', stat_bonus: '', lta: '' ,pf: '',pt: '',insurance: '',lwf:'',netPay: '',status:''});
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('empId'); // Default search criteria

  // Pagination
  const [totalPages, setTotalPages] = useState(0);
  const [itemsCountPerPage, SetItemsCountPerPage] = useState(0);
  const [totalItemsCount, SetTotalItemsCount] = useState(0);
  const [activePage, SetActivePage] = useState(1);

  const [data, setData] = useState([]);

  useEffect(() => {
    refreshPayrolls(activePage);
    //requestLocationPermission();
    const encryptedData = encryptData(`{
      "payroll_id": 6,
      "basicPlusVda": 5000,
      "hra": 0.0,
      "stat_bonus": 0.0,
      "lta": 0.0,
      "pf": 0.0,
      "pt": 0.0,
      "insurance": 0.0,
      "lwf": 0.0,
      "netPay": 0.0,
      "status": null,
      "employee": {
          "empId": "NH_00014",
          "empName": "abc",
          "mobileNo": "1234567890",
          "email": "abc1@gmail.com",
          "dob": null,
          "experience": 2.0,
          "username": "csdcsdc",
          "designation": "csdcfasd",
          "password": "$2a$10$js.yd5mnQygwteod.w0gTObiInEIqttnskqMl52EKcoh.baWhmKua",
          "role": null,
          "project": "NP_0001"
      }
  }`);
    console.log("Encrypted Data: "+encryptedData);
    const decryptedData = decryptData("dK/1HK1CXpF7BtyThypbbiaym3O5tdaszDDdDk5OqmpnKSvgH3wuqabiuuFV78/P02xcgQmmlW/Tt6BrbrpyxJvpMLw8i5ciACBVQJorCwWhxFt+wnkzr06I3DFlPbQ34nPVycpvkPoRHuaIEeXBxidea6YcCEFWM3nMbZyet9OBl8qMcq93LLIu3XE7hvQrZzNBSqI0Fd9jF1ipJjzlDsUntMmzNaYB1qOjCd39TtdiCEzG+V0IdBfpDYHtuuk389OiXMmGoqFi+R1IRzzzUQ==");
    console.log("Decrypted Data: "+decryptedData);
}, [activePage]);

  const refreshPayrolls = (activePage) => {
    getPaginatedPayroll(activePage)
      .then((resp) => {
        const tp = resp.data.totalPages
        setPayrolls(resp.data.content);
        setTotalPages(tp);
        SetItemsCountPerPage(resp.data.size);
        SetTotalItemsCount(resp.data.totalElements);
       // setProjects(response.data);
        //localStorage.setItem('currentPage', page);
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
      });
  };
  const customStyles = {
	content : {
	  top                   : '50%',
	  left                  : '50%',
	  right                 : 'auto',
	  bottom                : 'auto', 
	  marginRight           : '-50%',
	  transform             : 'translate(-50%, -50%)',
	  width                 : '40%'
	}
  };

  const toastCustamize = () => {
    
  };

  const handlePageChange = (pageNumber) => {
    SetActivePage(pageNumber);
    refreshPayrolls(pageNumber);
};

  const initialValues = {
    projectName: '',
    teamSize: 0,
    createdBy: '',
    status: '',
  };

  

  const validationSchema = Yup.object({
    projectName: Yup.string().required('Project Name is Required'),
    // createdBy: Yup.string().required('createdBy Name is Required'),
  });

  

  const editPayrollData = () => {
   
    updatePayroll(editPayroll)
      .then(resp => {
        toast.success(editPayroll.employeeId + ' Payroll Successfully Updated ', toastCustamize);
        refreshPayrolls();
        refreshPayrollsList();
      })
      .catch(error => {
        toast.error(editPayroll.employeeId + ' Payroll Has Not Updated ', toastCustamize);
      });
  };

  const handleSearchChange = e => {
    setSearchQuery(e.target.value);
  };


  useEffect(() => {
    localStorage.setItem("page","/dashboard/payroll");
    refreshPayrollsList(activePage);
}, [activePage])

const refreshPayrollsList = () => {
  getAllPayrolls()
        .then((resp) => {
            setAllPayrolls(resp.data);
            console.log(resp.data);
        })
        .catch((e) => {
            console.log("something went wrong");
            console.log(e);
        })
}
const handleSearchCriteriaChange = e => {
  setSearchCriteria(e.target.value);
};

let filteredPayrolls;
if (searchQuery.trim() !== '') {
  filteredPayrolls = allPayrolls.filter(payroll =>
    payroll.employee.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payroll.employee.empName.toLowerCase().includes(searchQuery.toLowerCase())
  );
} else {
  filteredPayrolls = payrolls;
}

let calculateSum=()=>{
  let total= (Number(editPayroll.basicPlusVda) + Number(editPayroll.hra)
                + Number(editPayroll.stat_bonus) + Number(editPayroll.lta) -Number(editPayroll.lwf) - Number(editPayroll.pf)
                - Number(editPayroll.insurance) - Number(editPayroll.pt))

  setEditPayroll({...editPayroll,netPay:total})
  return total
}


  return (
    <>
      <div className="container-fluid">
        <div className="table-wrapper">
          <div className="table-title">
            <div className="row">
              <div className="col-sm-6">
                <h2>View<b> Payrolls</b></h2>
              </div>
              
              <div className="col-sm-6">
                {/* <button className="btn btn-success" onClick={() => setmodelIsOpen(true)}>
                  <i className="material-icons">&#xE147;</i> <span>Create Project</span>
                </button> */}
                {/* <a onClick={()=>{history.push(`/dashboard/export`)}} className="btn btn-primary" data-toggle="modal">
                                <span>Export Projects</span>
                            </a> */}
              </div><div className="col-sm-6">
                            <select
                                className="form-control"
                                value={searchCriteria}
                                onChange={handleSearchCriteriaChange}
                            >
                                <option value="empId">Search by Employee Id</option>
                                <option value="empName">Search by Employee Name</option>
                            </select>
                        </div>
                        <div className="col-sm-6">
                            <input
                                type="text"
                                className="form-control"
                                placeholder={`Search by ${searchCriteria === 'empId' ? 'Employee Id' :  'Employee Name'}`}
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>
            </div>
          </div>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>EmployeeId</th>
                <th>Employee Name</th>
                <th>Earnings<br/>(Basic+VDA+HRA+Bonus+LTA)</th>
                <th>Deductions<br/>(PF+PT+INS+LWF)</th>
                <th>Net Pay</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayrolls.map(payroll => (
                <tr className="tr" key={payroll.projectId}>
                  {/* to={`/dashboard/modules/${project.projectId}`} */}
                  <td>{payroll.employee.empId}</td> 
                  <td>{payroll.employee.empName}</td>
                  <td>{payroll.basicPlusVda+payroll.hra+payroll.stat_bonus+payroll.lta}</td>
                  <td>{payroll.pf+payroll.pt+payroll.insurance+payroll.lwf}</td>
                  <td>{payroll.netPay}</td>
                  <td>{payroll.status}</td>

                  
                  <td>
                    <Link to="#editProjectModal" className="edit" data-toggle="modal" onClick={() => {
                      setEditPayroll({
                        payroll_id: payroll.payroll_id,
                        employeeId: payroll.employee.empId,
                        basicPlusVda:payroll.basicPlusVda,
                        pf:payroll.pf,
                        pt:payroll.pt,
                        hra: payroll.hra,
                        insurance: payroll.insurance,
                        lta: payroll.lta,
                        lwf:payroll.lwf,
                        netPay: payroll.netPay,
                        stat_bonus:payroll.stat_bonus,
                        status:payroll.status
                      });
                    }}>
                      <i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i>
                    </Link>
                    {/* <Link to="#deleteProjectModal" className="delete" data-toggle="modal" onClick={() => {
                      setDeleteProjId(payroll.projectId);
                      setDeleteProjName(payroll.projectName);
                    }}>
                      <i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i>
                    </Link> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <Pagination
              activePage={activePage}
              itemsCountPerPage={itemsCountPerPage}
              totalItemsCount={totalItemsCount}
              pageRangeDisplayed={5}
              onChange={handlePageChange}
              itemClass="page-item"
              linkClass="page-link"
            />
          </div>
        </div>
      
      </div>
      {/* ... existing code for modals */}
	  <div id="editProjectModal" className="modal fade">
		<div className="modal-dialog">
			<div className="modal-content">
				<form>
					<div className="modal-header">						
						<h4 className="modal-title">Edit Payroll</h4>
						<button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
					</div>
					<div className="modal-body">					
						<div className="form-group">
							<label>Employee Id</label>
							<input type="text" className="form-control" value={editPayroll.employeeId} onChange={(e)=>{setEditPayroll({...editPayroll,employeeId:e.target.value})}} disabled/>
						</div>
            EARNINGS
            <div style={{display:"flex", justifyContent:"space-evenly",borderTop:"1px solid grey",paddingTop:"15px"}}>
            <div className="form-group" style={{marginRight:"5px"}}>
							<label>Basic + VDA</label>
							<input type="text" className="form-control" value={editPayroll.basicPlusVda} onChange={(e)=>{setEditPayroll({...editPayroll,basicPlusVda:e.target.value})}} />
						</div>
						<div className="form-group" style={{marginLeft:"5px"}}>
							<label>HRA</label>
							<input className="form-control" value={editPayroll.hra} onChange={(e)=>{setEditPayroll({...editPayroll,hra:e.target.value})}} required></input>
						</div>
            </div>
            <div style={{display:"flex", justifyContent:"space-evenly"}}>
            <div className="form-group" style={{marginRight:"5px"}}>
							<label>Stat-Bonus</label>
							<input className="form-control" value={editPayroll.stat_bonus} onChange={(e)=>{setEditPayroll({...editPayroll,stat_bonus:e.target.value})}} required></input>
						</div>
              <div className="form-group" style={{marginLeft:"5px"}}>
							<label>LTA</label>
							<input className="form-control" value={editPayroll.lta} onChange={(e)=>{setEditPayroll({...editPayroll,lta:e.target.value})}} required></input>
						</div>
            </div>
            DEDUCTIONS
            <div style={{display:"flex", justifyContent:"space-evenly",borderTop:"1px solid grey",paddingTop:"15px"}}>
            <div className="form-group" style={{marginRight:"5px"}}>
							<label>PF</label>
							<input className="form-control" value={editPayroll.pf} onChange={(e)=>{setEditPayroll({...editPayroll,pf:e.target.value})}} required></input>
						</div>
            <div className="form-group" style={{marginLeft:"5px"}}>
							<label>PT</label>
							<input className="form-control" value={editPayroll.pt} onChange={(e)=>{setEditPayroll({...editPayroll,pt:e.target.value})}} required></input>
						</div>
            </div>
            <div style={{display:"flex", justifyContent:"space-evenly"}}>
            <div className="form-group" style={{marginRight:"5px"}}>
							<label>Insurance</label>
							<input className="form-control" value={editPayroll.insurance} onChange={(e)=>{setEditPayroll({...editPayroll,insurance:e.target.value})}} required></input>
						</div>
            <div className="form-group" style={{marginLeft:"5px"}}>
							<label>LWF</label>
							<input className="form-control" value={editPayroll.lwf} onChange={(e)=>{setEditPayroll({...editPayroll,lwf:e.target.value})}} required></input>
						</div>
            </div>
				    <div className="form-group" >
							<label>NetPay</label>
							<input className="form-control" value={(Number(editPayroll.basicPlusVda) + Number(editPayroll.hra)
                + Number(editPayroll.stat_bonus) + Number(editPayroll.lta) -Number(editPayroll.lwf) - Number(editPayroll.pf)
                - Number(editPayroll.insurance) - Number(editPayroll.pt))
               } onChange={(e)=>{
                console.log("hello");
                setEditPayroll({...editPayroll,netPay:e.target.value})}} ></input>
						</div>
						<div className="form-group">
							<label>Status</label>
						
							<select className="form-control" name="status" onSelect={(e)=>{setEditPayroll({...editPayroll,status:e.target.text})}}
						onBlur={(e)=>{setEditPayroll({...editPayroll,status:e.target.value})}} >
              <option value="">Select Status</option>
							<option value="Active">Active</option>
							<option value="Disabled">Disabled</option>
	
							</select>
						</div>					
					</div>
					<div className="modal-footer">
						<input type="button" className="btn btn-default" data-dismiss="modal" value="Cancel"/>
						<input type="button" className="btn btn-info" data-dismiss="modal" value="Save" onClick={editPayrollData}/>
					</div>
				</form>
			</div>
		</div>
	</div>
	<div style={{marginLeft:"35%",marginTop:"0%"}}>
<footer>Designed and Developed by  <img src={acoe} alt="" width="40px" /> </footer>

</div>
    </>
  );
};

export default PayrollComp;