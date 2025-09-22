import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Pagination from "react-js-pagination";
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { getAllResources, getPaginatedResources, deleteFileData, downloadFile } from '../Services/ResourcesService';
import axios from 'axios';
import acoe from './ACOE3.png';
toast.configure();
Modal.setAppElement('#root');

const Resources = () => {
  const [modelIsOpen, setmodelIsOpen] = useState(false);
  const [deleteFileId, setDeleteFileId] = useState('');
  const [deleteFileName, setDeleteFileName] = useState('');
  const [resources, setResources] = useState([]);
  const [allResources, setAllResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('fileName');

  const [uploadProgress, setUploadProgress] = useState(0);

  // Pagination
  const [totalPages, setTotalPages] = useState(0);
  const [itemsCountPerPage, SetItemsCountPerPage] = useState(0);
  const [totalItemsCount, SetTotalItemsCount] = useState(0);
  const [activePage, SetActivePage] = useState(1);

  const MAX_FILE_SIZE = 15 * 1024 * 1024; // 10MB

  useEffect(() => {
    refreshResources(activePage);
  }, [activePage]);
  const initialValues = {
    projectName: '',
    teamSize: 0,
    createdBy: '',
    status: '',
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

    const onSubmit = async (values, { setSubmitting }) => {
      const formData = new FormData();
      formData.append('file', values.file);
  
      try {
        const response = await axios.post('/uploadFile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          },
        });
        console.log('File uploaded successfully:', response.data);
        toast.success( ' File Uploaded Successfully ');
        setmodelIsOpen(false);
        refreshResourceList();
        refreshResources();
      } catch (error) {
        setUploadProgress(0);
        console.error('Error uploading file:', error);
        if(error.response.status==409){
        toast.error(error.response.data);
        }else{
          toast.error( ' File Not Uploaded ');
        }
      } finally {
        setSubmitting(false);
        setUploadProgress(0);
      }
    };
    const validationSchema = Yup.object({
      file: Yup.mixed().required('A file is required')
        .test('fileSize', 'File size is too large', value => {
          return value && value.size <= MAX_FILE_SIZE;
        }),
    });
  

  const refreshResources = (activePage) => {
    getPaginatedResources(activePage)
      .then((resp) => {
        const tp = resp.data.totalPages;
        setResources(resp.data.content);
        setTotalPages(tp);
        SetItemsCountPerPage(resp.data.size);
        SetTotalItemsCount(resp.data.totalElements);
      })
      .catch(error => {
        console.error('Error fetching resources:', error);
      });
  };

  const handlePageChange = (pageNumber) => {
    SetActivePage(pageNumber);
    refreshResources(pageNumber);
  };
  const [downloadProgress, setDownloadProgress] = useState(0);
  const handleDownload = (fileId, filenameAndExtension) => (e) => {
    e.preventDefault();

    downloadFile(fileId, (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      setDownloadProgress(percentCompleted);
    })
      .then(response => {
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filenameAndExtension); // Set the actual filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setDownloadProgress(0); // Reset progress after download
      })
      .catch(error => {
        console.error('There was an error with the download:', error);
        setDownloadProgress(0); // Reset progress on error
      });
  };
const deleteFile = () => {
  deleteFileData(deleteFileId)
    .then(resp => {
      toast.success(deleteFileName + ' File Successfully Deleted ');
      refreshResources();
      refreshResourceList();
    })
    .catch(error => {
      toast.error(deleteFileName + ' File Not Deleted ');
    });
};


  const handleSearchChange = e => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    localStorage.setItem("page","/dashboard/resources");
    refreshResourceList();
  }, []);

  const refreshResourceList = () => {
    getAllResources()
      .then((resp) => {
        setAllResources(resp.data);
      })
      .catch((e) => {
        console.log("something went wrong");
        console.log(e);
      });
  };

  const handleSearchCriteriaChange = e => {
    setSearchCriteria(e.target.value);
  };

  let filteredResources;
  if (searchQuery.trim() !== '') {
    filteredResources = allResources.filter(resource =>
      resource.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.uploadedOn.toLowerCase().includes(searchQuery.toLowerCase())
    );
  } else {
    filteredResources = resources;
  }

  return (
    <>
      <div className="container-fluid">
        <div className="table-wrapper">
          <div className="table-title">
            <div className="row">
              <div className="col-sm-6">
                <h2>View<b> Resources</b></h2>
              </div>
              <div className="col-sm-6">
                 <button className="btn btn-info" onClick={() => setmodelIsOpen(true)}>
                 <i className="material-icons" data-toggle="tooltip" title="Upload">&#xE2C3;</i>
                 <span>Upload File</span>
                </button> 
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
                  <option value="fileName">Search by File Name</option>
                  <option value="uploadedOn">Search by Upload Date</option>
                </select>
              </div>
              <div className="col-sm-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder={`Search by ${searchCriteria === 'fileName' ? 'File Name' : 'Upload Date'}`}
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>File_id</th>
                <th></th>
                <th>File Name</th>
                <th>Uploaded On</th>
                <th>File Size</th>
                <th>Downloads</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.map(resource => (
                <tr className="tr" key={resource.id}>
                  <td>{resource.id}</td>
                  <td></td>
                  <td>{resource.fileName}</td>
                  <td>{resource.uploadedOn}</td>
                  <td>{resource.fileSize}</td>
                  <td>{resource.downloads}</td>
                  <td>
                    <Link   className="download" onClick={handleDownload(resource.id,resource.fileName)}>
                      <i className="material-icons" data-toggle="tooltip" title="Download">&#xE2C4;</i>
                    </Link>
                    <Link to="#deleteFileModal" className="delete" data-toggle="modal" onClick={() => {
                      setDeleteFileId(resource.id);
                      setDeleteFileName(resource.fileName);
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
      </div>
      <div id="deleteFileModal" className="modal fade">
		<div className="modal-dialog">
			<div className="modal-content">
				<form>
					<div className="modal-header">						
						<h4 className="modal-title">Delete File</h4>
						<button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
					</div>
					<div className="modal-body">					
						<p>Are you sure you want to delete {deleteFileName} ?</p>
						<p className="text-warning"><small>This action cannot be undone.</small></p>
					</div>
					<div className="modal-footer">
						<input type="button" className="btn btn-default" data-dismiss="modal" value="Cancel"/>
						<input type="button" className="btn btn-danger" data-dismiss="modal" value="Delete" onClick={deleteFile} />
					</div>
				</form>
			</div>
		</div>
	</div>

     {/* ... existing code for modals */}
     <Modal isOpen={modelIsOpen} onRequestClose={() => setmodelIsOpen(false)} style={customStyles}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue }) => (
          <Form>
            <div className="modal-header">						
              <h4 className="modal-title">Upload File</h4>
              <button 
                type="button"  
                className="close" 
                data-dismiss="modal" 
                aria-hidden="true"
                onClick={() => setmodelIsOpen(false)}
              >
                &times;
              </button>
            </div>
            <div className="modal-body">					
              <div className="form-group">
                <label htmlFor="upload-file">Select File*</label>
                <input 
                  id="upload-file"
                  name="file"
                  type="file"
                  className="form-control"
                  onChange={(event) => {
                    const file = event.currentTarget.files[0];
                    console.log('File selected:', file);
                    setFieldValue("file", file);
                  }}
                  required
                />
                <ErrorMessage name="file" component="div" className="text-danger mt-2" />
              </div>	
              {uploadProgress > 0 && (
                <div className="progress">
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{ width: `${uploadProgress}%` }} 
                    aria-valuenow={uploadProgress} 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  >
                    {uploadProgress}%
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setmodelIsOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Upload File
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
    <div style={{marginLeft:"35%",marginTop:"0%"}}>
<footer>Designed and Developed by  <img src={acoe} alt="" width="40px" /> </footer>

</div>
    </>
  );
};

export default Resources;
