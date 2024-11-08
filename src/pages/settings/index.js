import {useEffect} from 'react';
import {useRouter} from "next/router";
import {CustomSelect} from '@/components/selector/Select';
import { useInit } from '@/context/InitContext';
import { useTranslation } from 'react-i18next';
import CryptoJS from 'crypto-js';
import { useProfileInit } from '@/utils/api'

import styles from '@/styles/Settings.module.scss'

export default function Page() {
    const { setLang } = useInit();
    const { i18n } = useTranslation();

    useEffect(() => {
        function encryptStringWithSalt(input, salt) {
            const hash = CryptoJS.SHA256(input + salt);
            return hash.toString(CryptoJS.enc.Hex);
        }

        const input = "557540399";
        const salt = "your_salt_here";
        const encryptedString = encryptStringWithSalt(input, salt);
        console.log('crypto-js', encryptedString);
    }, [])

    function createEncryptedToken() {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const search = window.Telegram.WebApp.initData;
            const urlParams = new URLSearchParams(search);
            const userParam = urlParams.get('user');
            if (userParam) {
                const decodedUserParam = decodeURIComponent(userParam);
                const userObject = JSON.parse(decodedUserParam);
                const userId = userObject.id.toString();
                const salt = String(process.env.NEXT_PUBLIC_SALT);
                const hash = CryptoJS.SHA256(userId + salt);
                const encryptedString = hash.toString(CryptoJS.enc.Hex);
                return `${userId}-${encryptedString}`;
            }
        }
        return null;
    }

    const token = createEncryptedToken(); // Получаем token
    const { data,  fetchProfileInit } = useProfileInit(token);

    useEffect(() => {
        if (token) {
            fetchProfileInit();
            console.log('data', data)
            console.log('token', token)
        }
    }, [token, fetchProfileInit]);

    const languageOptions = [
        { value: 'en', label: 'English' },
        // { value: 'ru', label: 'Русский' },
    ];

    const router = useRouter();
    useEffect(() => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp?.BackButton) {
            window.Telegram.WebApp.BackButton.show();
            window.Telegram.WebApp.BackButton.onClick(() => {
                router.push('/main');
            });
            return () => {
                window.Telegram.WebApp.BackButton.hide();
            };
        }
    }, [router]);

    const handleLanguageChange = (selectedOption) => {
        const newLang = selectedOption.value;
        setLang(newLang);
        i18n.changeLanguage(newLang);
        localStorage.setItem('appLanguage', newLang);
    };

    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <h1 className={styles.title}>settings</h1>
                <CustomSelect title={'select language'} optionsArray={languageOptions} onChange={handleLanguageChange} />
            </div>
        </div>
    );
};
