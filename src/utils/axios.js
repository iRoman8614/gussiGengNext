import axios from "axios";
import { refreshJwtToken } from './auth';

const instance = axios.create({
    baseURL: 'https://supavpn.lol/'
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

instance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            await refreshJwtToken();
            originalRequest.headers['Authorization'] = `Bearer ${localStorage.getItem('GWToken')}`;
            return instance(originalRequest);
        }
        return Promise.reject(error);
    }
);

export default instance;
