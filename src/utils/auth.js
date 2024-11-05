import axios from 'axios';
import { toast } from 'react-toastify';
import { useProfileInit } from './api';

export const refreshJwtToken = async () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        toast.error("unauthorized");
        return;
    }
    const { fetchProfileInit } = useProfileInit(authToken);
    try {
        await fetchProfileInit();
    } catch (error) {
        toast.error("Failed to authenticate.");
        console.error("Error refreshing JWT token:", error);
    }
};
