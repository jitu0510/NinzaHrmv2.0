// EmployeeTable.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const EmployeeTable = ({ empList }) => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editEmployee, setEditEmployee] = useState({ empName: '', mobileNo: '', email: '', dob: '', experience: '', username: '', project: '', designation: ''});

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    const allEmpIds = empList.map(emp => emp.empId);
    setSelectedRows(selectAll ? [] : allEmpIds);
  };

  const handleRowCheckboxChange = (empId) => {
    const updatedSelectedRows = selectedRows.includes(empId)
      ? selectedRows.filter(id => id !== empId)
      : [...selectedRows, empId];

    setSelectedRows(updatedSelectedRows);
    setSelectAll(updatedSelectedRows.length === empList.length);
  };

  return (
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
        {empList.map((emp) => (
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
              <Link href="#editEmployeeModal" className="edit" data-toggle="modal" onClick={() => {
                      setEditEmployee({
                        empName: emp.empName,
                        email: emp.email,
                        mobileNo: emp.mobileNo,
                        username: emp.username,
                        designation: emp.designation,
                        experience : emp.experience,
                        project : emp.project
                      });
                    }}>
                <i className="material-icons" data-toggle="tooltip" title="Edit">
                  &#xE254;
                </i>
              </Link>
              <a href="#deleteEmployeeModal" className="delete" data-toggle="modal">
                <i className="material-icons" data-toggle="tooltip" title="Delete">
                  &#xE872;
                </i>
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EmployeeTable;
