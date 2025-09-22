import Axios from "axios";

const url=process.env.REACT_APP_APP_URL;
const port=process.env.REACT_APP_APP_PORT;

export const getProjects = () => {
    return Axios.get(`/projects`);
}
export const getPaginatedProjects = (activePage) => {
    return Axios.get(`/all-transactions?page=${activePage}&size=10`);
}
export const getAllTransactions = async (activePage) => {
    try {
        // Get the total number of projects
        const numberOfProjectsResponse = await TransactionCount();
        const numberOfProjects = numberOfProjectsResponse.data;

        // Use the total number of projects as the size parameter
        const response = await Axios.get(`/all-transactions?page=${activePage}&size=${numberOfProjects}`);

        return response;
    } catch (error) {
        // Handle errors appropriately
        console.error('Error fetching Transactions:', error);
        throw error;
    }
};
export const TransactionCount = () => {
    return Axios.get(`/count-transactions`);
}

export const getPaginatedTransactions = (activePage) => {
    return Axios.get(`/all-transactions?page=${activePage}&size=10`);
}