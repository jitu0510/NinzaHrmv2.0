import CryptoJS from 'crypto-js';

const IV = process.env.REACT_APP_IV;
// const ALGORITHM = 'AES';
// const TRANSFORMATION = 'AES/CBC/PKCS5Padding';
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

export const encryptData = (input) => {
    const encrypted = CryptoJS.AES.encrypt(input, CryptoJS.enc.Utf8.parse(SECRET_KEY), {
        iv: CryptoJS.enc.Utf8.parse(IV),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
};

export const decryptData = (input) => {
    const decrypted = CryptoJS.AES.decrypt(input, CryptoJS.enc.Utf8.parse(SECRET_KEY), {
        iv: CryptoJS.enc.Utf8.parse(IV),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
};