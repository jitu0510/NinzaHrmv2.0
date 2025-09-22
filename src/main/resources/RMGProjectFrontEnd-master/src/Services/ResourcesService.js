import Axios from "axios";
const url=process.env.REACT_APP_APP_URL;
const port=process.env.REACT_APP_APP_PORT;

export const getPaginatedResources = (activePage) => {
    return Axios.get(`/fetch-file-details?page=${activePage}&size=10`);
}

export const getAllResources = () => {
    return Axios.get(`/fetch-all-files`);
}

export const downloadFile = (fileId, onDownloadProgress) => {
    return Axios({
      url: `/file/download/${fileId}`,
      method: 'GET',
      responseType: 'blob',
      onDownloadProgress,
    });
  };

export const deleteFileData = (fileId) => {
    return Axios.delete(`/delete-file/${fileId}`);
}