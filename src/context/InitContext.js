import React, { createContext, useContext, useState } from 'react';
const InitContext = createContext();

export const InitProvider = ({ children }) => {
    const [groupId, setGroupId] = useState(null);
    const [liga, setLiga] = useState(null);
    const [lang, setLang] = useState('en');
    const [userId, setUserId] = useState(null);
    const initState = {
        groupId,
        setGroupId,
        liga,
        setLiga,
        lang,
        setLang,
        userId,
        setUserId,
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