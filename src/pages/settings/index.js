import {useEffect} from 'react';
import {useRouter} from "next/router";
import {CustomSelect} from '@/components/selector/Select';
import { useInit } from '@/context/InitContext';
import { useTranslation } from 'react-i18next';

import styles from '@/styles/Settings.module.scss'

export default function Page() {
    const { setLang } = useInit();
    const { i18n } = useTranslation();

    const languageOptions = [
        { value: 'en', label: 'English' },
        { value: 'ru', label: 'Русский' },
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

    const handleClickLight = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
    };
    const handleClickMedium = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        }
    };
    const handleClickHeavy = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }
    };

    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <h1 className={styles.title}>settings</h1>
                <CustomSelect title={'select language'} optionsArray={languageOptions} onChange={handleLanguageChange} />
            </div>
            <div>
                <div>
                    <button onClick={handleClickLight}>light</button>
                </div>
                <div>
                    <button onClick={handleClickMedium}>medium</button>
                </div>
                <div>
                    <button onClick={handleClickHeavy}>heavy</button>
                </div>
            </div>
        </div>
    );
};
