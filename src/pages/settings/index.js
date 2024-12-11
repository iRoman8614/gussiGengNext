import {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import {CustomSelect} from '@/components/selector/Select';
import { useInit } from '@/context/InitContext';

import styles from '@/styles/Settings.module.scss'

export default function Page() {
    const { t } = useTranslation();
    const { setLang } = useInit();
    let lang = false
    if(typeof window !== "undefined") {
        lang = localStorage.getItem('appLanguage')
    }

    const initialLang = lang || i18next.language;
    const [selectedLanguage, setSelectedLanguage] = useState(initialLang);

    useEffect(() => {
        i18next.changeLanguage(selectedLanguage);
        setLang(selectedLanguage);
        localStorage.setItem('appLanguage', selectedLanguage);
    }, [selectedLanguage, setLang]);

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
        setSelectedLanguage(newLang);
        setLang(newLang);
        i18next.changeLanguage(newLang);
        localStorage.setItem('appLanguage', newLang);
    };

    const clearLang = () => {
        localStorage.removeItem('appLanguage')
    }

    const moveToFaq = () => {
        router.push('/faq/home')
    }

    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <h1 className={styles.title}>{t('settingsPage.title')}</h1>
                <CustomSelect
                    title={t('settingsPage.selectLanguage')}
                    optionsArray={languageOptions}
                    value={languageOptions.find(opt => opt.value === selectedLanguage)}
                    onChange={handleLanguageChange}
                />
                <div className={styles.faqBtn} onClick={moveToFaq}>faq</div>
                <button onClick={clearLang}>очистить язык</button>
            </div>
        </div>
    );
};