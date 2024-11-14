import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

const getAndSetInitialLanguage = () => {
    if (typeof window !== 'undefined') {
        const savedLanguage = localStorage.getItem('appLanguage');
        if (savedLanguage === 'ru' || savedLanguage === 'en') {
            return savedLanguage;
        }
        const telegramLang = window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code;

        let initialLanguage;
        if (telegramLang === 'ru') {
            initialLanguage = 'ru';
        } else {
            initialLanguage = 'en';
        }
        localStorage.setItem('appLanguage', initialLanguage);
        return initialLanguage;
    } else {
        return 'en';
    }
};


i18n
    .use(HttpBackend)
    .use(initReactI18next)
    .init({
        supportedLngs: ['en', 'ru'],
        fallbackLng: 'en',
        lng: getAndSetInitialLanguage(),
        debug: false,
        backend: {
            loadPath: '/locales/{{lng}}/translation.json',
        },
        react: {
            useSuspense: false,
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;