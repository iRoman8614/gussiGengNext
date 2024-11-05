import React, { createContext, useContext, useEffect, useState } from 'react';

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

    const [userId, setUserId] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedInit = JSON.parse(localStorage.getItem('init')) || {};
            return savedInit.userId || null;
        }
        return null;
    });

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

    useEffect(() => {
        const initData = {
            groupId,
            liga,
            lang,
            userId
        };
        localStorage.setItem('init', JSON.stringify(initData));
    }, [groupId, liga, lang, userId]);

    useEffect(() => {
        const farmData = {
            farmLimit: limit,
            farmRate: rate
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
        userId,
        setUserId,
        limit,
        setLimit,
        rate,
        setRate,
        updateContext
    };

    const updateContext = () => {
        if (typeof window !== 'undefined') {
            const savedInit = JSON.parse(localStorage.getItem('init')) || {};
            setGroupId(savedInit.groupId || 0);
            setLiga(savedInit.liga || 0);
            setLang(savedInit.lang || 'en');
            setUserId(savedInit.userId || null);

            const savedFarm = JSON.parse(localStorage.getItem('farm')) || {};
            setLimit(savedFarm.farmLimit || 0);
            setRate(savedFarm.farmRate || 1);
        }
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
