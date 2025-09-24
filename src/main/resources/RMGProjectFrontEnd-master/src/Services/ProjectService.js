import Axios from "axios";
import {getToken} from  "./AuthenticationService";




const url=process.env.REACT_APP_APP_URL;
const port=process.env.REACT_APP_APP_PORT;


export const addProject = (project) => {
    return Axios.post(`/addProjects`, project);
}

export const getProjects = () => {
    return Axios.get(`/projects`);
}
export const getPaginatedProjects = (activePage) => {
    return Axios.get(`/projects-paginated?page=${activePage}&size=10`);
}
export const getAllProjects = async (activePage) => {
    try {
        // Get the total number of projects
        const numberOfProjectsResponse = await projectCount();
        const numberOfProjects = numberOfProjectsResponse.data;

        // Use the total number of projects as the size parameter
        const response = await Axios.get(`/projects-paginated?page=${activePage}&size=${numberOfProjects}`);

        return response;
    } catch (error) {
        // Handle errors appropriately
        console.error('Error fetching projects:', error);
        throw error;
    }
};

export const projectCount = () => {
    return Axios.get(`/count-projects`);
}
export const deleteProject=(projectId)=>{
    return Axios.delete(`/project/${projectId}`);
}

export const updateProject=(projectId,updateBody)=>{
    return Axios.put(`/project/${projectId}`,updateBody);
}

export const loadProjectsNameAndId = () => {
    return Axios.get(`/projects`);
}

export const exportProject = () => {
   return Axios.get(`/export`);
}

export const getEmployeesExperienceData = () => {
    return Axios.get(`http://49.249.28.218:8091/employee/getExperience`);
}