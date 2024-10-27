import axios from 'axios';
import { toast } from 'react-toastify';
export const refreshJwtToken = async () => {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        toast.error("unauthorized");
        return;
    }

    try {
        const response = await axios.get(`https://supavpn.lol/profile/init?token=${authToken}`);
        const { jwt } = response.data;
        localStorage.setItem('GWToken', jwt);
    } catch (error) {
        toast.error("Failed to authenticate.");
        console.error("Error refreshing JWT token:", error);
    }
};
