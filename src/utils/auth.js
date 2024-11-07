import axios from 'axios';
import { toast } from 'react-toastify';

export const refreshJwtToken = async () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        toast.error("unauthorized");
        return;
    }
    try {
        // const response = await axios.get(`https://supavpn.lol/profile/init?token=${authToken}`);
        const response = await axios.get(`85.192.42.16:8080/profile/init?token=${authToken}`);
        const { jwt, balance, lang, group, farm, dailyEntries } = response.data;

        localStorage.setItem('GWToken', jwt);
        const farmData = {
            coins: balance,
            totalCoins: balance,
            farmRate: farm.rate,
            farmLimit: farm.limit,
        };
        localStorage.setItem('farm', JSON.stringify(farmData));
        const initData = {
            lang: lang,
            groupId: group.id,
            dailyEntries: dailyEntries
        };
        localStorage.setItem('init', JSON.stringify(initData));

    } catch (error) {
        toast.error("Failed to authenticate.");
        console.error("Error refreshing JWT token:", error);
    }
};
