import axios from "axios";

// стандартный путь для отправки запросов
const instance = axios.create({
    baseURL: "https://supavpn.lol/"
});

// добавляет токен в хедер запросов, если window существует
instance.interceptors.request.use(config => {
    if (typeof window !== "undefined") {
        const myToken = window.localStorage.getItem('GWToken');
        if (myToken) {
            config.headers.Authorization = `${myToken}`;
        }
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default instance;
