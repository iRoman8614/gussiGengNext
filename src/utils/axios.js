import axios from "axios";

const instance = axios.create({
    baseURL: "https://supavpn.lol/"
});

instance.interceptors.request.use(config => {
    if (typeof window !== "undefined") {
        const myToken = window.localStorage.getItem('GWToken');
        if (myToken) {
            config.headers.Authorization = `Bearer ${myToken}`;
        }
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default instance;
