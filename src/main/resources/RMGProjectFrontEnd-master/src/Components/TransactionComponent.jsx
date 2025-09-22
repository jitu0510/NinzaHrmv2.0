import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addProject, getPaginatedProjects, deleteProject, updateProject } from './../Services/ProjectService';
import {getAllTransactions,getPaginatedTransactions} from './../Services/TransactionServices';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import { useHistory, Link } from 'react-router-dom';
import Pagination from "react-js-pagination";
import acoe from './ACOE3.png';
toast.configure();
Modal.setAppElement('#root');

const TransactionComp = () => {
  const [modelIsOpen, setmodelIsOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [deleteProjId, setDeleteProjId] = useState('');
  const [deleteProjName, setDeleteProjName] = useState('');
  const [editProject, setEditProject] = useState({ projectId: '', projectName: '', teamSize: '', createdBy: '', status: '' });
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('Transaction_ID'); // Default search criteria

  // Pagination
  const [totalPages, setTotalPages] = useState(0);
  const [itemsCountPerPage, SetItemsCountPerPage] = useState(0);
  const [totalItemsCount, SetTotalItemsCount] = useState(0);
  const [activePage, SetActivePage] = useState(1);

  // useEffect(() => {
  //   refreshProjects();
  // }, []);
  // Function to request location permission
// function requestLocationPermission() {
//   if ('geolocation' in navigator) {
//     navigator.geolocation.getCurrentPosition(
//       // Success callback
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
//         // You can use the obtained coordinates here
//       },
//       // Error callback
//       (error) => {
//         switch (error.code) {
//           case error.PERMISSION_DENIED:
//             console.error('User denied the request for Geolocation.');
//             break;
//           case error.POSITION_UNAVAILABLE:
//             console.error('Location information is unavailable.');
//             break;
//           case error.TIMEOUT:
//             console.error('The request to get user location timed out.');
//             break;
//           default:
//             console.error('An unknown error occurred.');
//             break;
//         }
//       }
//     );
//   } else {
//     console.error('Geolocation is not supported by this browser.');
//   }
// }

// Call the function to request permission
//requestLocationPermission();

  useEffect(() => {
    refreshProjects(activePage);
   // refreshProjectsList(activePage);
    //requestLocationPermission();

}, [activePage]);

  const refreshProjects = (activePage) => {
    getPaginatedTransactions(activePage)
      .then((resp) => {
        const tp = resp.data.totalPages
        setProjects(resp.data.content);
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
    refreshProjects(pageNumber);
};

  const initialValues = {
    projectName: '',
    teamSize: 0,
    createdBy: '',
    status: '',
  };

  const onSubmit = values => {
    addProject(values)
      .then(resp => {
        toast.success('Project ' + resp.data.projectName + ' Successfully Added', toastCustamize);
        setmodelIsOpen(false);
        refreshProjects(activePage);
        refreshProjectsList();

      })
      .catch(error => {
        toast.error('Project is Not Added', toastCustamize);
       
        setmodelIsOpen(false);
      });
  };

  const validationSchema = Yup.object({
    projectName: Yup.string().required('Project Name is Required'),
    // createdBy: Yup.string().required('createdBy Name is Required'),
  });

  const deleteSingleProject = () => {
    deleteProject(deleteProjId)
      .then(resp => {
        toast.success(deleteProjName + ' Project Successfully Deleted ', toastCustamize);
        refreshProjects();
        refreshProjectsList();
      })
      .catch(error => {
        toast.error(deleteProjName + ' Project Not Deleted ', toastCustamize);
      });
  };

  const editProjectData = () => {
    updateProject(editProject.projectId, editProject)
      .then(resp => {
        toast.success(editProject.projectId + ' Project Successfully Updated ', toastCustamize);
        refreshProjects();
        refreshProjectsList();
      })
      .catch(error => {
        toast.error(editProject.projectId + ' Project Has Not Updated ', toastCustamize);
      });
  };

  const handleSearchChange = e => {
    setSearchQuery(e.target.value);
  };


  useEffect(() => {
    localStorage.setItem("page","/dashboard/transactions");
    refreshProjectsList();
}, [activePage])

const refreshProjectsList = (activePage) => {
  getAllTransactions(activePage)
        .then((resp) => {
            setAllProjects(resp.data.content);
          
        })
        .catch((e) => {
            console.log("something went wrong");
            
        })
}
const handleSearchCriteriaChange = e => {
  setSearchCriteria(e.target.value);
};

let filteredProjects;
if (searchQuery.trim() !== '') {
  console.log(allProjects);
  filteredProjects = allProjects.filter(project =>
      project[searchCriteria].toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.Transaction_Date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.Transaction_Status.toLowerCase().includes(searchQuery.toLowerCase())
  );
} else {
  filteredProjects = projects;
}


  return (
    <>
      <div className="container-fluid">
        <div className="table-wrapper">
          <div className="table-title">
            <div className="row">
              <div className="col-sm-6">
                <h2>List of<b> Transactions</b></h2>
              </div>
              
              <div className="col-sm-6">
                {/* <button className="btn btn-success" onClick={() => setmodelIsOpen(true)}>
                  <i className="material-icons">&#xE147;</i> <span>Create Project</span>
                </button> */}
                {/* <a onClick={()=>{history.push(`/dashboard/export`)}} className="btn btn-primary" data-toggle="modal">
                                <span>Export Projects</span>
                            </a> */}
              </div>
               <div className="col-sm-6">
                            <select
                                className="form-control"
                                value={searchCriteria}
                                onChange={handleSearchCriteriaChange}
                            >
                                <option value="Transaction_ID">Search by Transaction Id</option>
                                <option value="Transaction_Date">Search by Transaction Date</option>
                                <option value="Transaction_Status">Search by Transaction Status</option>
                            </select>
                        </div> 
                         <div className="col-sm-6">
                            <input
                                type="text"
                                className="form-control"
                                placeholder={`Search by ${searchCriteria === 'Transaction_ID' ? 'Transaction Id' : (searchCriteria === 'Transaction_Date' ? 'Transaction Date' : 'Transaction Status')}`}
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div> 

              
            </div>
          </div>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>TransactionId</th>
                <th>Txn Amount</th>
                <th>Txn Date</th>
                <th>Txn Time</th>
                <th>Txn Status</th>
                
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map(txn => (
                <tr className="tr" key={txn.Transaction_ID}>
                  {/* to={`/dashboard/modules/${project.projectId}`} */}
                  <td>{txn.Transaction_ID}</td> 
                  <td>{txn.Transaction_Amount}</td>
                  <td>{txn.Transaction_Date}</td>
                  <td>{txn.Transaction_Time}</td>
                  <td>{txn.Transaction_Status}</td>
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
	  <Modal  isOpen={modelIsOpen} onRequestClose={()=>setmodelIsOpen(false)} style={customStyles}>
   
		
			<Formik
					initialValues={initialValues}
					validationSchema={validationSchema}
					onSubmit={onSubmit}
				>
				<Form>
					<div className="modal-header">						
						<h4 className="modal-title">Create Project</h4>
						<button type="button"  className="close" data-dismiss="modal" aria-hidden="true"></button>
					</div>
					<div className="modal-body">					
						<div className="form-group">
							<label>Project Name*</label>
							<Field type="text" name="projectName" className="form-control" required/>
							<ErrorMessage name="projectName" className="text-danger" />
						</div>
						<div className="form-group">
							<label>Team Size</label>
							<Field type="text" name="teamSize" className="form-control" disabled/>
						</div>
						<div className="form-group">
							<label>Project Manager*</label>
							<Field type="text" name="createdBy" className="form-control" />
							<ErrorMessage name="createdBy" />
						</div>		
						<div className="form-group">
    <label className="col-form-label">Project Status* </label>
    <Field
        as="select"
        name="status"
        validate={value => {
            if (!value) {
                return "Please select a value"; // Error message when no value is selected
            }
        }}
    >
        <option value="">Select Value</option>
        <option value="Created">Created</option>
        <option value="On Going">On Going</option>
        <option value="Completed">Completed</option>
    </Field>
    <ErrorMessage name="status" component="div" className="error-message" /> {/* Display error message */}
</div>				
					</div>
					<div className="modal-footer">
						<input type="button" className="btn btn-default" onClick={()=>setmodelIsOpen(false)} value="Cancel"/>
						<input type="submit" className="btn btn-success" value="Add Project"/>
					</div>
				</Form>
				</Formik>
			
	</Modal>
	<div id="editProjectModal" className="modal fade">
		<div className="modal-dialog">
			<div className="modal-content">
				<form>
					<div className="modal-header">						
						<h4 className="modal-title">Edit {editProject.projectId} Project</h4>
						<button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
					</div>
					<div className="modal-body">					
						<div className="form-group">
							<label>Project Name</label>
							<input type="text" className="form-control" value={editProject.projectName} onChange={(e)=>{setEditProject({...editProject,projectName:e.target.value})}} required/>
						</div>
						<div className="form-group">
							<label>Team Size</label>
							<input type="text" className="form-control" value={editProject.teamSize} disabled/>
						</div>
						<div className="form-group">
							<label>Project Manager</label>
							<input className="form-control" value={editProject.createdBy} onChange={(e)=>{setEditProject({...editProject,createdBy:e.target.value})}} required></input>
						</div>
						<div className="form-group">
							<label>Status</label>
						
							<select className="form-control" name="status" onSelect={(e)=>{setEditProject({...editProject,status:e.target.text})}}
						onBlur={(e)=>{setEditProject({...editProject,status:e.target.value})}} >
							<option value="Created">Created</option>
							<option value="On Going">On Going</option>
							<option value="Completed">Completed</option>
							</select>
						</div>					
					</div>
					<div className="modal-footer">
						<input type="button" className="btn btn-default" data-dismiss="modal" value="Cancel"/>
						<input type="button" className="btn btn-info" data-dismiss="modal" value="Save" onClick={editProjectData}/>
					</div>
				</form>
			</div>
		</div>
	</div>
	
	<div id="deleteProjectModal" className="modal fade">
		<div className="modal-dialog">
			<div className="modal-content">
				<form>
					<div className="modal-header">						
						<h4 className="modal-title">Delete Project</h4>
						<button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
					</div>
					<div className="modal-body">					
						<p>Are you sure you want to delete {deleteProjName} Project?</p>
						<p className="text-warning"><small>This action cannot be undone.</small></p>
					</div>
					<div className="modal-footer">
						<input type="button" className="btn btn-default" data-dismiss="modal" value="Cancel"/>
						<input type="button" className="btn btn-danger" data-dismiss="modal" value="Delete" onClick={deleteSingleProject}/>
					</div>
				</form>
			</div>
		</div>
	</div>
	  
    </>
  );
};

export default TransactionComp;