import Axios from "axios";
const ip=process.env.REACT_APP_APP_URL;
const port=process.env.REACT_APP_APP_PORT;
var CryptoJS = require("crypto-js");

export const login = (data) => {
    const apiUrl = `http://49.249.28.218:8091/login`
    const response= Axios.post(apiUrl,data);
    return response;
}

export const registerSuccessfulLogin = (username, role,jwt,refresh_token) => {
    var usernameCrypt = CryptoJS.AES.encrypt(JSON.stringify(username), 'secret').toString();
    var roleCrypt = CryptoJS.AES.encrypt(JSON.stringify(role), 'secret').toString();
    var jwtLocal=jwt
    localStorage.setItem("username", usernameCrypt)
    localStorage.setItem("role", roleCrypt)
    localStorage.setItem("jwt",jwtLocal)
    localStorage.setItem("refresh_token",refresh_token);
    localStorage.setItem("name",username);
    localStorage.setItem("userrole",role);
}

export const fetchProperties = () =>{
    fetch('/api/properties')
    .then(response => response.json())
    .then(properties => {
        // Handle the retrieved properties
        console.log(properties);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

export const isUserLoggedIn = () => {
    let user = localStorage.getItem('username')
    if (user === null) return false
    return true
}

export const getUserName = () =>{
    let user = localStorage.getItem('username')
    if (user === null) return false
    var bytes  = CryptoJS.AES.decrypt(user, 'secret');
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
    console.log("decrypted "+originalText);
}

export const getToken = () =>{
    let jwt = localStorage.getItem('jwt')
    if (jwt === null) return false
    return jwt;
}