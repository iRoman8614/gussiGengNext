import React, { createContext, useContext, useEffect, useState } from 'react';
import i18n from '@/utils/i18n.js';

const InitContext = createContext();

export const InitProvider = ({ children }) => {
    const [groupId, setGroupId] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedInit = JSON.parse(localStorage.getItem('init')) || {};
            return savedInit.groupId || 0;
        }
        return 0;
    });

    const [liga, setLiga] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedInit = JSON.parse(localStorage.getItem('init')) || {};
            return savedInit.liga || 0;
        }
        return 0;
    });

    const [lang, setLang] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedInit = JSON.parse(localStorage.getItem('init')) || {};
            return savedInit.lang || 'en';
        }
        return 'en';
    });

    useEffect(() => {
        if (i18n.isInitialized && lang) {
            i18n.changeLanguage(lang);
        }
    }, [lang]);

    const [limit, setLimit] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedFarm = JSON.parse(localStorage.getItem('farm')) || {};
            return savedFarm.farmLimit || 0;
        }
        return 0;
    });

    const [rate, setRate] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedFarm = JSON.parse(localStorage.getItem('farm')) || {};
            return savedFarm.farmRate || 1;
        }
        return 1;
    });

    const [coins, setCoins] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedFarm = JSON.parse(localStorage.getItem('farm')) || {};
            return savedFarm.coins || 0;
        }
        return 0;
    });

    const [totalCoins, setTotalCoins] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedFarm = JSON.parse(localStorage.getItem('farm')) || {};
            return savedFarm.totalCoins || 0;
        }
        return 0;
    });

    const [dailyEntries, setDailyEntries] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedInit = JSON.parse(localStorage.getItem('init')) || {};
            return savedInit.dailyEntries || 0;
        }
        return 0;
    });

    const [pass, setPass] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedInit = JSON.parse(localStorage.getItem('init')) || {};
            return savedInit.pass || 0;
        }
        return 0;
    });

    const updateContext = () => {
        if (typeof window !== 'undefined') {
            const savedInit = JSON.parse(localStorage.getItem('init')) || {};
            setGroupId(savedInit.groupId || 0);
            setLiga(savedInit.liga || 0);
            setLang(savedInit.lang || 'en');
            setDailyEntries(savedInit.dailyEntries || 0);
            setPass(savedInit.pass || 0)

            const savedFarm = JSON.parse(localStorage.getItem('farm')) || {};
            setLimit(savedFarm.farmLimit || 0);
            setRate(savedFarm.farmRate || 1);
            setCoins(savedFarm.coins || 0);
            setTotalCoins(savedFarm.totalCoins || 0);
        }
    };

    useEffect(() => {
        const initData = {
            groupId,
            liga,
            lang,
            pass,
            dailyEntries,
        };
        localStorage.setItem('init', JSON.stringify(initData));
    }, [groupId, liga, lang, dailyEntries]);

    useEffect(() => {
        const farmData = {
            farmLimit: limit,
            farmRate: rate,
            coins,
            totalCoins,
        };
        localStorage.setItem('farm', JSON.stringify(farmData));
    }, [limit, rate]);

    const initState = {
        groupId,
        setGroupId,
        liga,
        setLiga,
        lang,
        setLang,
        limit,
        setLimit,
        rate,
        setRate,
        coins,
        setCoins,
        totalCoins,
        setTotalCoins,
        dailyEntries,
        setDailyEntries,
        pass,
        setPass,
        updateContext
    };

    return (
        <InitContext.Provider value={initState}>
            {children}
        </InitContext.Provider>
    );
};

export const useInit = () => {
    return useContext(InitContext);
};