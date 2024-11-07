import {useEffect} from 'react';
import {useRouter} from "next/router";
import {CustomSelect} from '@/components/selector/Select';
import { useInit } from '@/context/InitContext';
import { useTranslation } from 'react-i18next';

import styles from '@/styles/Settings.module.scss'
import axios from "axios";

export default function Page() {
    const { setLang } = useInit();
    const { i18n } = useTranslation();

    const languageOptions = [
        { value: 'en', label: 'English' },
        // { value: 'ru', label: 'Русский' },
    ];

    const router = useRouter();

    // useEffect(async () => {
    //     try {
    //         const response = await axios.get(`https://supavpn.lol/profile/init?token=1`);
    //         console.log('response', response)
    //         console.log('response data', response.data)
    //         console.log('response error', response.error)
    //         console.log('response status', response.status)
    //     } catch (error) {
    //         console.log('error', error)
    //         console.log('error data', error.data)
    //         console.log('error status', error.status)
    //     }
    // }, [])

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
