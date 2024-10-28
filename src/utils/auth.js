import axios from 'axios';
import { toast } from 'react-toastify';
import axiosInstance from "@/utils/axios";
export const refreshJwtToken = async () => {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        toast.error("unauthorized");
        return;
    }

    try {
        const response = await axios.get(`https://supavpn.lol/profile/init?token=${authToken}`);
        const data = response.data;
        localStorage.setItem('GWToken', data.jwt);
        localStorage.setItem('init', JSON.stringify(data));
    } catch (error) {
        toast.error("Failed to authenticate.");
        console.error("Error refreshing JWT token:", error);
    }
};
