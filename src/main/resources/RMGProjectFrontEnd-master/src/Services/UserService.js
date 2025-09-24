import Axios from "axios";
import {getToken} from  "./AuthenticationService";


const url=process.env.REACT_APP_APP_URL;
const port=process.env.REACT_APP_APP_PORT;

export const getNumberOfEmployees = () => {
    return Axios.get(`/count-employees`);
};
export const getAllEmployes = (activePage) =>{
    return Axios.get(`/employees?page=${activePage}&size=10`);
}
// export const getEmployees = (activePage) => {
//     return Axios.get(`http://49.249.29.5:8091/all-employees?page=${activePage}&size=${getNumberOfEmployees}`,{ headers: { Authorization: 'Bearer '+getToken() } });
// }
export const getEmployees = async (activePage) => {
    try {
        // Get the total number of employees
        const numberOfEmployeesResponse = await getNumberOfEmployees();
        const numberOfEmployees = numberOfEmployeesResponse.data;

        // Use the total number of employees as the size parameter
        const response = await Axios.get(`/all-employees?page=${activePage}&size=${numberOfEmployees}`);

        return response;
    } catch (error) {
        // Handle errors appropriately
        console.error('Error fetching employees:', error);
        throw error;
    }
};



// export const addUser = (user) => {
//     return Axios.post('http://49.249.29.5:8091/signup', user,{ headers: { Authorization: 'Bearer '+getToken() } });
// }
export const addUser = (user) => {
    return Axios.post(`/signup`,user);
}

export const checkUserIsPresent = (username) => {
    return Axios.get(`/signup/${username}`);
}

export const addEmployeeapi = (employee) => {
    return Axios.post(`/employees`,employee);
}

export const getEmpDetails = (userName)=>{
    console.log(userName)
    return Axios.get(`/employee/${userName}`);
}

export const deleteEmployee = (employeeId)=>{
    console.log(employeeId+" is rquested to be deleted")
    return Axios.delete(`/employee/${employeeId}`,);
}

export const updateEmployee=(employeeId,updatedBody)=>{
    console.log(updatedBody);
    console.log(employeeId);
    return Axios.put(`/employees/${employeeId}`,updatedBody);
}
export const getEmployeesExperienceData = () => {
    return Axios.get(`http://49.249.28.218:8091/employee/getExperiences`);
}

