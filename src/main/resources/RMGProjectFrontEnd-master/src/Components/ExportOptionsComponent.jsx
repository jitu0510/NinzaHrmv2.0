import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import "../CSS/ExportOptionsComponent.css";

const url1=process.env.REACT_APP_APP_URL;
const port=process.env.REACT_APP_APP_PORT;
const ExportOptionsComponent = () => {
  const [selectedFileType, setSelectedFileType] = useState('');
  const history = useHistory();
  const handleFileChange = (e) => {
    setSelectedFileType(e.target.value);
  };

  const handleDownload = async (e) => {
    e.preventDefault();


    try {
        console.log(selectedFileType);
        const response = await fetch(`/export_${selectedFileType}`); // Replace with your backend URL

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `RMG_Projects.${selectedFileType}`; // Specify the desired file name
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error downloading file:', error);
    }
};

  return (
    <div className="file-upload-form">
  <h2>Export Project Data</h2>
  <form onSubmit={handleDownload}>
    <div className="form-group">
      <label htmlFor="fileType">Select File Type:</label>
      <select id="fileType" value={selectedFileType} onChange={handleFileChange} required>
        <option value="">Select a file type</option>
        <option value="xlsx">Excel</option>
        <option value="csv">CSV</option>
        <option value="pdf">PDF</option>
        <option value="docx">Word Document</option>
        {/* <option value="png">Image</option> */}
        {/* Add more file types as needed */}
      </select>
    </div>

    <button type="submit" className="btn btn-primary">Download File</button>
  </form>
</div>

  );
};

export default ExportOptionsComponent;
