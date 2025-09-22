import Axios from "axios";

const ip=process.env.REACT_APP_APP_URL;
const port=process.env.REACT_APP_APP_PORT;
export const requestDemo = (demoRequestData) => {
    return Axios.post(`/demorequest`, demoRequestData);
}