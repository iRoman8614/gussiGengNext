import {useState, useEffect, useCallback, useRef} from 'react';
import axios from '@/utils/axios';

// Хук для /profile/init
export const useProfileInit = (token) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProfileInit = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/profile/init?token=${token}`);
            const { jwt, balance, lang, group, farm, delayEntries } = response.data;
            localStorage.setItem('GWToken', jwt);
            const farmData = {
                coins: balance,
                totalCoins: balance,
                farmRate: farm.rate,
                farmLimit: farm.limit,
            };
            localStorage.setItem('farm', JSON.stringify(farmData));
            const initData = {
                lang,
                groupId: group.id,
                delayEntries
            };
            localStorage.setItem('init', JSON.stringify(initData));

            setData({
                farm: farmData,
                init: initData
            });
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [token, loading]);
    return { data, loading, error, fetchProfileInit };
};

// Хук для /farm/start
export const useFarmStart = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchFarmStart = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/farm/start`);
            const { coins, totalCoins, startTime, rate, limit } = response.data;
            const initData = JSON.parse(localStorage.getItem('init')) || {};
            const updatedInitData = {
                ...initData,
                coins,
                totalCoins,
                farmRate: rate,
                farmLimit: limit,
            };
            localStorage.setItem('init', JSON.stringify(updatedInitData));
            localStorage.setItem('startTime', startTime);

            // Сохраняем данные в состояние
            setData(prevData => ({
                ...prevData,
                coins,
                totalCoins,
                rate,
                limit,
                startTime
            }));
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [loading]);

    return { data, loading, error, fetchFarmStart };
};

// Хук для /farm/collect, который выполняет collect, а затем start
export const useFarmCollect = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { fetchFarmStart } = useFarmStart();

    const collectAndStart = useCallback(async () => {
        if (loading) return;

        setLoading(true);
        try {
            const response = await axios.get(`/farm/collect`);
            const { coins, totalCoins, startTime, endTime, rate, winsGames, winsRate } = response.data;
            setData(prevData => ({
                ...prevData,
                coins,
                totalCoins,
                startTime,
                endTime,
                rate,
                winsGames,
                winsRate
            }));
            await fetchFarmStart();

        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [fetchFarmStart, loading]);

    return { data, loading, error, collectAndStart };
};

// Хук для /profile/stats
export const useProfileStats = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProfileStats = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/profile/stats`);
            const {id, count, lost, victory, type, liga, pass} = response.data;
            const initData = JSON.parse(localStorage.getItem('init')) || {};
            let lige;
            if(liga === 0) {
                lige = liga
            } else {
                lige = liga - 1
            }
            const updatedInitData = {
                ...initData,
                liga: lige,
                pass
            };
            localStorage.setItem('init', JSON.stringify(updatedInitData));
            setData({id, count, lost, victory, type, liga, pass});
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [loading]);

    return {data, loading, error, fetchProfileStats};
}


// Хук для запроса /profile/leaders
export const useProfileLeaders = (liga) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const cache = useRef({});

    useEffect(() => {
        const fetchLeadersData = async () => {
            if (cache.current[liga]) {
                setData(cache.current[liga]);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const response = await axios.get(`/profile/leaders?liga=${liga}`);
                cache.current[liga] = response.data;
                setData(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeadersData();
    }, [liga]);
    return { data, loading, error };
};


// Хук для /profile/my-invitees
export const useMyInvitees = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchInviteesData = async () => {
            try {
                const response = await axios.get(`/profile/my-invitees`);
                setData(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchInviteesData();
    }, []);
    return { data, loading, error };
};

// Хук для /profile/update-group
export const useUpdateGroup = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const updateGroupData = useCallback(async (groupId) => {
        setLoading(true);
        try {
            const response = await axios.get(`/profile/update-group?groupId=${groupId}`);
            const { group } = response.data;
            const initData = JSON.parse(localStorage.getItem('init')) || {};
            const updatedInitData = {
                ...initData,
                groupId: group.id
            };
            localStorage.setItem('init', JSON.stringify(updatedInitData));
            setData(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, error, updateGroupData };
};

// Хук для /farm/last-games
export const useLastGames = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLastGamesData = async () => {
            try {
                const response = await axios.get(`/farm/last-games`);
                const { winner, session } = response.data;
                setData({ winner, session });
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLastGamesData();
    }, []);
    return { data, loading, error };
}
