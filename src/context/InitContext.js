import React, {createContext, useContext, useEffect, useState} from 'react';
const InitContext = createContext();

export const InitProvider = ({ children }) => {
    const savedLang = localStorage.getItem('appLanguage') || 'en';
    const [groupId, setGroupId] = useState(0);
    const [liga, setLiga] = useState(0);
    const [lang, setLang] = useState('en');
    const [userId, setUserId] = useState(null);
    const [limit, setLimit] = useState(0);
    const [rate, setRate] = useState(1);
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
        setRate
    };

    useEffect(() => {
        if (lang !== savedLang) {
            localStorage.setItem('appLanguage', lang);
        }
    }, [lang]);

    return (
        <InitContext.Provider value={initState}>
            {children}
        </InitContext.Provider>
    );
};

export const useInit = () => {
    return useContext(InitContext);
};
