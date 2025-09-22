// Users.jsx
import React, { useState, useEffect } from "react";
import '../CSS/Project.css';
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { addProject, getProjects, deleteProject, updateProject, loadProjectsNameAndId } from './../Services/ProjectService'
import { addEmployeeapi, getAllEmployes, getEmployees,deleteEmployee, updateEmployee} from './../Services/UserService'
import Modal from 'react-modal'
import Pagination from "react-js-pagination";
import { ToastContainer, toast } from 'react-toastify';
import { useHistory, Link } from 'react-router-dom';
import EmployeeTable from "./EmployeeTable";
import acoe from './ACOE3.png';

Modal.setAppElement('#root');

const UserComp = () => {
    const [projects, setProjects] = useState([]);
    const [modelIsOpen, setmodelIsOpen] = useState(false);

    const [deleteEmployeeId, setDeleteEmployeeId] = useState('');
    const [deleteEmployeeName, setDeleteEmployeeName] = useState('');
    const [employee, setEmployee] = useState({
        empName: '', mobileNo: '', email: '', dob: '', experience: '', username: '', project: '', designation: ''
    });
    const [empList, setEmpList] = useState([]);
    const [editEmployee, setEditEmployee] = useState({ empName: '', mobileNo: '', email: '', dob: '', experience: '', username: '', project: '', designation: ''});
    const [employeeList, setEmployeeList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCriteria, setSearchCriteria] = useState('empName'); // Default search criteria
    
    // Pagination
    const [totalPages, setTotalPages] = useState(0);
    const [itemsCountPerPage, SetItemsCountPerPage] = useState(0);
    const [totalItemsCount, SetTotalItemsCount] = useState(0);
    const [activePage, SetActivePage] = useState(1);

    const history = useHistory();

   

    // Replace this with your actual constant value

  // State to manage button disabled status
  


    const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  //const [editEmployee, setEditEmployee] = useState({ empName: '', mobileNo: '', email: '', dob: '', experience: '', username: '', project: '', designation: ''});
//delete button logic 
 
const [isDeleteModalDisabled, setDeleteModalDisabled] = useState(selectedRows.length > 0);


  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    const allEmpIds = empList.map(emp => emp.empId);
    setSelectedRows(selectAll ? [] : allEmpIds);
  };

  //to delete multiple employees together
  const deleteEmployees = () =>{
    if(deleteEmployeeId!=null){
        deleteSingleEmployee(deleteEmployeeId);
    }
    selectedRows.filter(id => {
         deleteEmployee(id)
            .then( (resp) => {
                toast.success('Employee ' + id + ' Successfully Deleted');
                refereshEmpList();
            })
            .catch( () => {
                 toast.error(id + ' Employee Not Deleted ');
                
            });        
    }    );
    refereshEmpList();
     setSelectedRows([]);
  }
  //to delete single employee
  const deleteSingleEmployee = () => {
    deleteEmployee(deleteEmployeeId)
      .then(resp => {
        toast.success(deleteEmployeeId + ' Employee Successfully Deleted ');
        refereshEmpList(); 
      })
      .catch(error => {
        toast.error(deleteEmployeeId + ' Employee Not Deleted ');
      });
      refereshEmpList();
        setDeleteEmployeeId(null); 
  };

  //edit employee data
  const editEmployeeData = () => {
    console.log(editEmployee);
    updateEmployee(editEmployee.empId, editEmployee)
      .then(resp => {
        console.log(resp);
        toast.success(editEmployee.empId + ' Employee Successfully Updated ');
        refereshEmpList();
      })
      .catch(error => {
        toast.error(editEmployee.empId + ' Employee has not been Updated ');
      });
  };

  const handleRowCheckboxChange = (empId) => {
    const updatedSelectedRows = selectedRows.includes(empId)
      ? selectedRows.filter(id => id !== empId)
      : [...selectedRows, empId];

    setSelectedRows(updatedSelectedRows);
    setSelectAll(updatedSelectedRows.length === empList.length);
  };

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '40%',
            
        }
    };

    const addEmployee = (event) => {
        event.preventDefault();

        addEmployeeapi(employee)
            .then(() => {
                toast.success('User ' + employee.empName + ' Successfully Created');
                refereshEmpList();
                setmodelIsOpen(false);
            })
            .catch(() => {
                toast.error(employee.empName + ' Employee Not Added ');
            });
    };

    const handlePageChange = (pageNumber) => {
        SetActivePage(pageNumber);
        refereshEmpList(pageNumber);
    };

    useEffect(() => {
        refreshProjects();
    }, []);

    const refreshProjects = () => {
        getProjects()
            .then(response => {
                setProjects(response.data);
                
            });
    }

    useEffect(() => {
        localStorage.setItem("page","/dashboard/users");
        refereshEmpList(activePage);

    }, [activePage]);

    useEffect(() => {

        refreshEmployeeList(activePage);
    }, [activePage])

    const refreshEmployeeList = () => {
        getEmployees()
            .then((resp) => {
                setEmployeeList(resp.data.content);
                //add few statements if pagination giving problem while searching an employee
            })
            .catch((e) => {
                console.log("something went wrong");
                console.log(e);
            })
    }

    const refereshEmpList = (activePage) => {
        getAllEmployes(activePage)
            .then((resp) => {
                const tp = resp.data.totalPages
                setEmpList(resp.data.content);
                setTotalPages(tp);
                SetItemsCountPerPage(resp.data.size);
                SetTotalItemsCount(resp.data.totalElements);
            })
            .catch(() => {

            })
    }

    const handleSearchChange = e => {
        setSearchQuery(e.target.value);
    };

    const handleSearchCriteriaChange = e => {
        setSearchCriteria(e.target.value);
    };

    let filteredEmployees;
    if (searchQuery.trim() !== '') {
        filteredEmployees = employeeList.filter(emp =>
            emp[searchCriteria].toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.mobileNo.toLowerCase().includes(searchQuery.toLowerCase())
        );
    } else {
        filteredEmployees = empList;
    }

    return (
        <div className="container-fluid">
            <div className="table-wrapper">
                <div className="table-title">
                    <div className="row">
                        <div className="col-sm-6">
                            <h2>Manage <b>Employees</b></h2>
                        </div>
                        <div className="col-sm-6">
                            <button className="btn btn-success" data-toggle="modal" onClick={() => setmodelIsOpen(true)}>
                                <i className="material-icons">&#xE147;</i> <span>Add New Employee</span>
                            </button>
                            <a href="#deleteEmployeeModal" className="btn btn-danger" data-toggle="modal">
                                <i className="material-icons">&#xE15C;</i> <span>Delete</span>
                            </a>
                        </div>
                        <div className="col-sm-6">
                            <select
                                className="form-control"
                                value={searchCriteria}
                                onChange={handleSearchCriteriaChange}
                            >
                                <option value="empName">Search by Name</option>
                                <option value="email">Search by Email</option>
                                <option value="mobileNo">Search by Phone</option>
                            </select>
                        </div>
                        <div className="col-sm-6">
                            <input
                                type="text"
                                className="form-control"
                                placeholder={`Search by ${searchCriteria === 'empName' ? 'Employee Name' : (searchCriteria === 'email' ? 'Email' : 'Phone')}`}
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    {/* <EmployeeTable empList={filteredEmployees} /> */}
                    <table className="table table-striped table-hover">
      <thead>
        <tr>
          <th>
            <span className="custom-checkbox">
              <input
                type="checkbox"
                id="selectAll"
                checked={selectAll}
                onChange={handleSelectAll}
              />
              <label htmlFor="selectAll"></label>
            </span>
          </th>
          <th>Emp Id</th>
          <th>Name</th>
          <th>UserName</th>
          <th>Email</th>
          <th>Phone No.</th>
          <th>Designation</th>
          <th>Experience</th>
          <th>Project</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredEmployees.map((emp) => (
          <tr key={emp.empId}>
            <td>
              <span className="custom-checkbox">
                <input
                  type="checkbox"
                  id={`checkbox_${emp.empId}`}
                  checked={selectedRows.includes(emp.empId)}
                  onChange={() => handleRowCheckboxChange(emp.empId)}
                />
                <label htmlFor={`checkbox_${emp.empId}`}></label>
              </span>
            </td>
            <td>{emp.empId}</td>
            <td>{emp.empName}</td>
            <td>{emp.username}</td>
            <td>{emp.email}</td>
            <td>{emp.mobileNo}</td>
            <td>{emp.designation}</td>
            <td>{emp.experience}</td>
            <td>{emp.project}</td>
            <td>
              <Link to="#editEmployeeModal" className="edit" data-toggle="modal" onClick={() => {
                      setEditEmployee({
                        empId: emp.empId,
                        empName: emp.empName,
                        email: emp.email,
                        mobileNo: emp.mobileNo,
                        username: emp.username,
                        designation: emp.designation,
                        experience : emp.experience,
                        project : emp.project

                        
                      },console.log(selectedRows.length));
                    }}>
                <i className="material-icons" data-toggle="tooltip" title="Edit">
                  &#xE254;
                </i>
              </Link>
              <Link to="#deleteEmployeeModal"  className="delete" data-toggle="modal" onClick={() => {
                      setDeleteEmployeeId(emp.empId);
                      setDeleteEmployeeName(emp.empName);
                    }}>
                <i className="material-icons" data-toggle="tooltip"  title="Delete">
                  &#xE872;
                </i>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>


                    {/* table ends */}
                </div>
                <Pagination
                    activePage={activePage}
                    itemsCountPerPage={itemsCountPerPage}
                    totalItemsCount={totalItemsCount}
                    pageRangeDisplayed={5}
                    itemClass='page-item'
                    linkClass='btn btn-light'
                    onChange={handlePageChange}
                />
            </div>

            {/* ... (previous code) */}
            {/* <!-- Add Modal HTML --> */}
    <Modal isOpen={modelIsOpen}  style={customStyles} >
	
    <form onSubmit={addEmployee}  >
        <div class="modal-header" >						
            <h4 class="modal-title">Add Employee</h4>
            <button type="button" class="close" onClick={()=>setmodelIsOpen(false)} data-dismiss="modal" aria-hidden="true">&times;</button>
        </div>
        <div class="modal-body">					
            <div class="form-group"  >
            <label>Name*</label>
                <input type="text"  class="form-control" onChange={(e)=>{setEmployee({...employee,empName:e.target.value})}} required />
            </div>
            <div class="form-group" style={{marginTop:'-15px'}}>
                <label>Email*</label>
                <input type="email" class="form-control" onChange={(e)=>{setEmployee({...employee,email:e.target.value})}} required />
            </div>
            <div class="form-group" style={{marginTop:'-15px'}}>
                <label>Phone*</label>
                <input type="text"  class="form-control" onChange={(e)=>{setEmployee({...employee,mobileNo:e.target.value})}} required />
            </div>	
            <div class="form-group" style={{marginTop:'-15px'}}>
                <label>Username*</label>
                <input type="text"  class="form-control" onChange={(e)=>{setEmployee({...employee,username:e.target.value})}} required />
            </div>
            <div class="form-group" style={{marginTop:'-15px'}}>
                <label>Designation*</label>
                <input type="text" class="form-control" onChange={(e)=>{setEmployee({...employee,designation:e.target.value})}} required />
            </div>
            <div class="form-group" style={{marginTop:'-15px'}}>
                <label>Experience*</label>
                <input type="text" s class="form-control" onChange={(e)=>{setEmployee({...employee,experience:e.target.value})}} required />
            </div>		
            <div class="form-group" style={{marginTop:'-15px'}}>
    <label class="col-sm-2 col-form-label" style={{marginLeft:'-10px'}}> Project*</label>
    <select 
        name="project"  
        onChange={(e)=>{setEmployee({...employee,project:e.target.value})}}
        onBlur={(e)=>{setEmployee({...employee,project:e.target.value})}}
        value={employee.project} // Ensure selected value is reflected in state
        required // Add the required attribute
    >
        <option value="">Select Project</option> {/* Empty default option */}
        {projects.map((e, key) => <option key={key} value={e.projectId}>{e.projectName}</option>)} 
    </select>
</div>	
                            
        </div>
        <div class="modal-footer" style={{marginTop:'-50px',marginBottom:'-30px'}}>
            <input type="button"  onClick={()=>setmodelIsOpen(false)} class="btn btn-default" data-dismiss="modal" value="Cancel" />
            <input type="submit" class="btn btn-success" value="Add" />
        </div>
    </form>

</Modal>
{/* <!-- Edit Modal HTML --> */}
<div id="editEmployeeModal" class="modal fade">
<div class="modal-dialog">
<div class="modal-content">
    <form>
        <div class="modal-header">						
            <h4 class="modal-title">Edit Employee</h4>
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        </div>
        <div class="modal-body">					
            <div class="form-group">
                <label>Name</label>
                <input type="text" value={editEmployee.empName} onChange={(e)=>{setEditEmployee({...editEmployee,empName:e.target.value})}} class="form-control" required />
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" class="form-control" value={editEmployee.email} onChange={(e)=>{setEditEmployee({...editEmployee,email:e.target.value})}} required />
            </div>
            <div class="form-group">
                <label>Experience</label>
                <input type="number" class="form-control" min="0" value={editEmployee.experience} onChange={(e)=>{setEditEmployee({...editEmployee,experience:e.target.value})}} required></input>
            </div>
            <div class="form-group">
                <label>Phone</label>
                <input type="text" value={editEmployee.mobileNo} onChange={(e)=>{setEditEmployee({...editEmployee,mobileNo:e.target.value})}} class="form-control"  maxLength='10' required />
            </div>					
        </div>
        <div class="modal-footer">
            <input type="button" class="btn btn-default" data-dismiss="modal" value="Cancel" />
            <input type="submit" class="btn btn-info" data-dismiss="modal" value="Save" onClick={editEmployeeData} />
        </div>
    </form>
</div>
</div>
</div>
{/* <!-- Delete Modal HTML --> */}

<div id="deleteEmployeeModal" class="modal fade">
<div class="modal-dialog">
<div class="modal-content">
    <form  onSubmit={deleteEmployees}>
        <div class="modal-header">						
            <h4 class="modal-title">Delete Employee</h4>
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        </div>
        <div class="modal-body">					
            <p>Are you sure you want to delete these Records?</p>
            <p class="text-warning"><small>This action cannot be undone.</small></p>
        </div>
        <div class="modal-footer">
            <input type="button" class="btn btn-default" data-dismiss="modal" value="Cancel" />
            <input type="button"  data-dismiss="modal"  class="btn btn-danger" value="Delete" onClick={deleteEmployees} />
        </div>
    </form>
</div>
</div>
</div>


<div style={{marginLeft:"35%",marginTop:"0%"}}>
<footer>Designed and Developed by  <img src={acoe} alt="" width="40px" /> </footer>

</div>
            {/* end */}
        </div>
        
    );
}

export default UserComp;