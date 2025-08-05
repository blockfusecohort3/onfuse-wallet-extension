import CryptoJs from 'crypto-js'; 

const ENCRYPTION_KEY = import.meta.env.REACT_APP_ENCRYPTION_KEY || 'onfuse-default-key';

const encryptData = (data) => {
    const stringifiedData = JSON.stringify(data);
    return CryptoJs.AES.encrypt(stringifiedData, ENCRYPTION_KEY).toString();
}   

const decryptData = (encryptedData) => {
    const bytes = CryptoJs.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decryptedData = bytes.toString(CryptoJs.enc.Utf8);
    return JSON.parse(decryptedData);
}

export const secureStorage = {
    setItem: (key, value) => {
        const encryptedValue = encryptData(value);
        localStorage.setItem(key, encryptedValue);
    },
    getItem: (key) => {
        const encryptedValue = localStorage.getItem(key);
        if (!encryptedValue) return null;
        return decryptData(encryptedValue);
    },
    removeItem: (key) => {
        localStorage.removeItem(key);0
    }
};
