

import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addModule, getPaginatedModules, getAllModules, deleteModule, updateModule } from '../Services/ModulesService';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import { useHistory, Link } from 'react-router-dom';
import Pagination from "react-js-pagination";
toast.configure();
Modal.setAppElement('#root');

const Modules = ()=>{
    

    
  const [modelIsOpen, setmodelIsOpen] = useState(false);
  const [modules, setModules] = useState([]);
  const [allModules, setAllModules] = useState([]);
  const [deleteModuleId, setDeleteModuleId] = useState('');
  const [deleteModuleName, setDeleteModuleName] = useState('');
  const [editModule, setEditModule] = useState({ moduleId: '', moduleName: '', assignedTo: '', status: '' });
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('moduleId'); // Default search criteria

  // Pagination
  const [totalPages, setTotalPages] = useState(0);
  const [itemsCountPerPage, SetItemsCountPerPage] = useState(0);
  const [totalItemsCount, SetTotalItemsCount] = useState(0);
  const [activePage, SetActivePage] = useState(1);

  // useEffect(() => {
  //   refreshModules();
  // }, []);
  useEffect(() => {
    refreshModules(activePage);

}, [activePage]);

  const refreshModules = (activePage) => {
    getPaginatedModules(activePage)
      .then((resp) => {
        const tp = resp.data.totalPages
        setModules(resp.data.content);
        setTotalPages(tp);
        SetItemsCountPerPage(resp.data.size);
        SetTotalItemsCount(resp.data.totalElements);
       // setProjects(response.data);
        //localStorage.setItem('currentPage', page);
      })
      .catch(error => {
        console.error('Error fetching modules:', error);
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
    // Customize toast if needed
  };

  const handlePageChange = (pageNumber) => {
    SetActivePage(pageNumber);
    refreshModules(pageNumber);
};

  const initialValues = {
    moduleName: '',
    status: '',
  };

  const onSubmit = values => {
    addModule(values)
      .then(resp => {
        toast.success('Module ' + resp.data.moduleName + ' Successfully Added', toastCustamize);
        setmodelIsOpen(false);
        refreshModules();
      })
      .catch(error => {
        toast.error('Project is Not Added', toastCustamize);
        console.log(error);
        setmodelIsOpen(false);
      });
  };

  const validationSchema = Yup.object({
    moduleName: Yup.string().required('Project Name is Required'),
    // createdBy: Yup.string().required('createdBy Name is Required'),
  });

  const deleteSingleModule = () => {
    deleteModule(deleteModuleId)
      .then(resp => {
        toast.success(deleteModuleName + ' Module Successfully Deleted ', toastCustamize);
        refreshModules();
      })
      .catch(error => {
        toast.error(deleteModuleName + ' Module Not Deleted ', toastCustamize);
      });
  };

  const editModuleData = () => {
    updateModule(editModule.moduleId, editModule)
      .then(resp => {
        toast.success(editModule.moduleId + ' Module Successfully Updated ', toastCustamize);
        refreshModules();
      })
      .catch(error => {
        toast.error(editModule.moduleId + ' Module Has Not Updated ', toastCustamize);
      });
  };

  const handleSearchChange = e => {
    setSearchQuery(e.target.value);
  };




  useEffect(() => {

    refreshModulesList(activePage);
}, [activePage])

const refreshModulesList = () => {
  getAllModules(activePage)
        .then((resp) => {
            setAllModules(resp.data.content);
        })
        .catch((e) => {
            console.log("something went wrong");
            console.log(e);
        })
}
const handleSearchCriteriaChange = e => {
  setSearchCriteria(e.target.value);
};

let filteredModules;
if (searchQuery.trim() !== '') {
  filteredModules = allModules.filter(module =>
      module[searchCriteria].toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.moduleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
  );
} else {
    filteredModules = modules;
}


  return (
    <>
      <div className="container-fluid">
        <div className="table-wrapper">
          <div className="table-title">
            <div className="row">
              <div className="col-sm-6">
                <h2>List of<b> Modules</b></h2>
              </div>
              
              <div className="col-sm-6">
                <button className="btn btn-success" onClick={() => setmodelIsOpen(true)}>
                  <i className="material-icons">&#xE147;</i> <span>Create Module</span>
                </button>
              </div><div className="col-sm-6">
                            <select
                                className="form-control"
                                value={searchCriteria}
                                onChange={handleSearchCriteriaChange}
                            >
                                <option value="moduleId">Search by Module Id</option>
                                <option value="moduleName">Search by Module Name</option>
                               
                            </select>
                        </div>
              
                {/* Add a search input for project name */}
                {/* <input
                  type="text"
                  className="form-control"
                  placeholder="Search by project name"
                  value={searchQuery}
                  onChange={handleSearchChange}
                /> */}

                         
                        <div className="col-sm-6">
                            <input
                                type="text"
                                className="form-control"
                                placeholder={`Search by ${searchCriteria === 'moduleName' ? 'Module Name' : 'Module Id'}`}
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>

              
            </div>
          </div>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>ModuleId</th>
                <th>ModuleName</th>
                <th>Created On</th>
                <th>Assigned To</th>
                <th>Status</th>
                
                
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredModules.map(module => (
                <tr className="tr" key={module.moduleIdd}>
                <Link to={`/dashboard/modules/${module.moduleId}`}><td>{module.moduleId}</td></Link>  
                  <td>{module.moduleName}</td>
                  <td>{module.createdOn}</td>
                  <td>{module.assignedTo}</td>
                  <td>{module.status}</td>
                  
                  <td>
                    <Link to="#editModuleModal" className="edit" data-toggle="modal" onClick={() => {
                      setEditModule({
                        moduleId: module.moduleId,
                        moduleName: module.moduleName,
                        createdOn: module.createdOn,
                        assignedTo: module.assignedTo,
                        status: module.status,
                      });
                    }}>
                      <i className="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i>
                    </Link>
                    <Link to="#deleteModuleModal" className="delete" data-toggle="modal" onClick={() => {
                      setDeleteModuleId(module.moduleId);
                      setDeleteModuleName(module.moduleName);
                    }}>
                      <i className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i>
                    </Link>
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
        {/* <Pagination
                    activePage={activePage}
                    itemsCountPerPage={itemsCountPerPage}
                    totalItemsCount={totalItemsCount}
                    pageRangeDisplayed={5}
                    itemClass='page-item'
                    linkClass='btn btn-light'
                    onChange={handlePageChange}
                /> */}
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
						<h4 className="modal-title">Create Module</h4>
						<button type="button" className="close" data-dismiss="modal" aria-hidden="true"></button>
					</div>
					<div className="modal-body">					
						<div className="form-group">
							<label>Module Name</label>
							<Field type="text" name="projectName" className="form-control" required/>
							<ErrorMessage name="projectName" className="text-danger" />
						</div>
						<div className="form-group">
							<label>Team Size</label>
							<Field type="text" name="teamSize" className="form-control" disabled/>
						</div>
						<div className="form-group">
							<label>Project Manager</label>
							<Field type="text" name="createdBy" className="form-control" required/>
							<ErrorMessage name="createdBy" />
						</div>		
						<div className="form-group">
							<label class="col-sm-2 col-form-label">Project Status </label>
							<Field as="select" name="status">
							<option value="">Select Value</option>
							<option value="Created">Created</option>
							<option value="On Going">On Going</option>
							<option value="Completed">Completed</option>
							</Field>
						</div>					
					</div>
					<div className="modal-footer">
						<input type="button" className="btn btn-default" onClick={()=>setmodelIsOpen(false)} value="Cancel"/>
						<input type="submit" className="btn btn-success" value="Add Project"/>
					</div>
				</Form>
				</Formik>
			
	</Modal>
	<div id="editModuleModal" className="modal fade">
		<div className="modal-dialog">
			<div className="modal-content">
				<form>
					<div className="modal-header">						
						<h4 className="modal-title">Edit {editModule.moduleId} Module</h4>
						<button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
					</div>
					<div className="modal-body">					
						<div className="form-group">
							<label>Project Name</label>
							<input type="text" className="form-control" value={editModule.moduleName} onChange={(e)=>{setEditModule({...editModule,projectName:e.target.value})}} required/>
						</div>
						<div className="form-group">
							<label>Team Size</label>
							<input type="text" className="form-control" value={editModule.teamSize} disabled/>
						</div>
						<div className="form-group">
							<label>Project Manager</label>
							<input className="form-control" value={editModule.createdBy} onChange={(e)=>{setEditModule({...editModule,createdBy:e.target.value})}} required></input>
						</div>
						<div className="form-group">
							<label>Status</label>
						
							<select className="form-control" name="status" onSelect={(e)=>{setEditModule({...editModule,status:e.target.text})}}
						onBlur={(e)=>{setEditModule({...editModule,status:e.target.value})}} >
							<option value="Created">Created</option>
							<option value="On Going">On Going</option>
							<option value="Completed">Completed</option>
							</select>
						</div>					
					</div>
					<div className="modal-footer">
						<input type="button" className="btn btn-default" data-dismiss="modal" value="Cancel"/>
						<input type="button" className="btn btn-info" data-dismiss="modal" value="Save" onClick={editModuleData}/>
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
						<p>Are you sure you want to delete {deleteModuleName} Project?</p>
						<p className="text-warning"><small>This action cannot be undone.</small></p>
					</div>
					<div className="modal-footer">
						<input type="button" className="btn btn-default" data-dismiss="modal" value="Cancel"/>
						<input type="button" className="btn btn-danger" data-dismiss="modal" value="Delete" onClick={deleteSingleModule}/>
					</div>
				</form>
			</div>
		</div>
	</div>

    
    
    </>
);

};

export default Modules;