import Axios from "axios";
import {getToken} from  "./AuthenticationService";
import { encryptData } from "./AESService";

const url=process.env.REACT_APP_APP_URL;
const port=process.env.REACT_APP_APP_PORT;

export const getAllPayrolls = () => {
    return Axios.get(`/admin/payrolls?access_token=${getToken()}`);
}

export const getPayrollBasedOnPayrollId =  (payroll_id) =>{
    return Axios.get(`/admin/payroll/${payroll_id}?access_token=${getToken()}`);
}

export const getPaginatedPayroll = (activePage) => {
    return Axios.get(`/admin/payrolls-paginated?page=${activePage}&size=10&access_token=${getToken()}`);
}

export const updatePayroll= async (updateBody)=>{
    console.log("Payroll: "+updateBody);
    let encrypted;
    var resp=await getPayrollBasedOnPayrollId(updateBody.payroll_id)
    var dbPayroll = resp.data;
    
    dbPayroll.basicPlusVda = updateBody.basicPlusVda;
    dbPayroll.hra = updateBody.hra;
    dbPayroll.status = updateBody.status;
    dbPayroll.stat_bonus = updateBody.stat_bonus;
    dbPayroll.lta = updateBody.lta;

    dbPayroll.pf = updateBody.pf;
    dbPayroll.pt = updateBody.pt;
    dbPayroll.insurance = updateBody.insurance;
    dbPayroll.lwf = updateBody.lwf;

    encrypted = encryptData(JSON.stringify(dbPayroll));
    console.log(encrypted);
    
    var resp = await Axios.put(`/payroll`,encrypted,{
        headers:{
            'Content-Type':'text/plain'
        }
    });
    console.log(resp.data);
    return resp;
    
}