import Axios from "axios";
import {getToken} from  "./AuthenticationService";




export const addModule = (module) => {
    return Axios.post('/addModule', module);
}

export const getModules = () => {
    return Axios.get(`/modules`);
}
export const getPaginatedModules = (activePage) => {
    return Axios.get(`/modules1?page=${activePage}&size=10`);
}
export const getAllModules = async (activePage) => {
    try {
        console.log('Fetching modules...');
        // const numberOfModulesResponse = await moduleCount();
        // const numberOfModules = numberOfModulesResponse.data;
        const numberOfModulesResponse = '2';
        const numberOfModules = numberOfModulesResponse.data;
        const projectid = 'TY_PROJ_1002';

        const response = await Axios.get(`/all-modules/${projectid}?page=${activePage}&size=${numberOfModules}`);

        console.log('Response:', response.data);
        return response;
    } catch (error) {
        console.error('Error fetching modules:', error);
        throw error;
    }
};

export const moduleCount = () => {
    return Axios.get(`/count-modules`);
}
export const deleteModule=(moduleId)=>{
    return Axios.delete(`/modules/${moduleId}`);
}

export const updateModule=(moduleId,updateBody)=>{
    return Axios.put(`/modules/${moduleId}`,updateBody);
}

export const loadModulesNameAndId = () => {
    return Axios.get('/modules');
}