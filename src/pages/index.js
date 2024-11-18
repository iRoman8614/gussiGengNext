import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import CryptoJS from 'crypto-js';
import { toast } from "react-toastify";
import { useInit } from '@/context/InitContext';
import { useProfileInit, useFarmStart, useProfileStats } from '@/utils/api';
import { useTranslation } from "react-i18next";
import assetData from "@/mock/assets.json";

import styles from '@/styles/Loader.module.scss';
import i18next from "i18next";

const loaderImage = '/loadingImg.jpg'

export default function LoaderPage() {
    const router = useRouter();
    const { updateContext, setLang } = useInit();
    const [groupId, setGroupId] = useState(null);
    let isNewPlayer = false;

    let lang = false
    if(typeof window !== "undefined") {
        lang = localStorage.getItem('appLanguage')
    }

    const initialLang = lang || i18next.language;
    const [selectedLanguage, setSelectedLanguage] = useState(initialLang);

    useEffect(() => {
        i18next.changeLanguage(selectedLanguage);
        setLang(selectedLanguage)
        localStorage.setItem('appLanguage', selectedLanguage);
    }, [selectedLanguage, setLang]);

    const CURRENT_VERSION = process.env.NEXT_PUBLIC_CURRENT_VERSION

    const token = createEncryptedToken();
    const { data: profileData, loading: profileLoading, error: profileError, fetchProfileInit } = useProfileInit(token);
    const { data: farmData, loading: farmLoading, error: farmError, fetchFarmStart } = useFarmStart();
    const { data: statsData, loading: statsLoading, error, statsError, fetchProfileStats } = useProfileStats()

    const checkVersion = useCallback(() => {
        if (typeof window !== 'undefined') {
            const savedVersion = localStorage.getItem('version');
            if (savedVersion !== CURRENT_VERSION) {
                localStorage.clear();
                isNewPlayer = true;
                localStorage.setItem('version', CURRENT_VERSION);
                if (navigator.serviceWorker.controller) {
                    navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
                }
            }
        }
    }, [CURRENT_VERSION]);

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
                localStorage.setItem('authToken', `${userId}-${encryptedString}`)
                return `${userId}-${encryptedString}`;
            }
        }
        return null;
    }

    const loadAssets = (group, assets) => {
        const cacheName = `assets-cache-${group}`;
        worker.postMessage({ assets, cacheName });
    };


    const fetchData = useCallback(async () => {
        try {
            const initData = await fetchProfileInit()
            if (isNewPlayer) {
                loadAssets('newPlayerAssets', assetData.newPlayerAssets);
            }
            if (profileError) {
                throw new Error('Initialization failed, restart app');
            }
            if (farmError) {
                throw new Error('Farm start failed, restart app');
            }
        } catch (error) {
            if(error.status === 401) {
                toast.error('error during init request, restart app');
                return;
            }
            return;
        }
    }, []);

    const worker = typeof window !== "undefined" ? new Worker(new URL("../workers/assetWorker.js", import.meta.url)) : null;

    const updateAndRedirect = useCallback(() => {
        const picked = localStorage.getItem('picked')
        const savedInit = JSON.parse(localStorage.getItem('init'));
        const savedFarm = JSON.parse(localStorage.getItem('farm'));
        let isExperiencedPlayer = false
        if (!picked) {
            isNewPlayer = true;
        } else {
            isExperiencedPlayer = savedInit && savedFarm
        }
        updateContext();

        if (savedInit.groupId === 0 || savedFarm.farmLimit === 0) {
            return;
        }
        if (isNewPlayer) {
            router.push('/getRandom');
        } else if (!isNewPlayer && isExperiencedPlayer) {
            router.push('/main');
        }
    }, []);

    useEffect(() => {
        const executeAfterToken = async () => {
            checkVersion();
            await fetchData();
            await fetchFarmStart();
            await fetchProfileStats();
            updateAndRedirect();
        };
        if (token) {
            executeAfterToken();
        } else {
            return
        }
    }, []);

    useEffect(() => {
        if (worker) {
            worker.onmessage = (event) => {
                const { status, asset, error } = event.data;
                if (status === "loaded") {
                    console.log(`Asset ${asset} загружен`);
                } else if (status === "error") {
                    console.error(`Ошибка загрузки ассета ${asset}: ${error}`);
                } else if (status === "complete") {
                    console.log(`Группа ассетов загружена`);
                }
            };
        }
        return () => {
            if (worker) worker.terminate();
        };
    }, [worker]);

    return (
        <div className={styles.root}>
            <Image className={styles.video} src={loaderImage} alt="Loading..." width={500} height={500} priority />
            <LoadingText />
        </div>
    );
}

const LoadingText = () => {
    const [dots, setDots] = useState(0);
    const { t } = useTranslation();
    useEffect(() => {
        const interval = setInterval(() => { setDots(prevDots => (prevDots + 1) % 4); }, 500);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className={styles.loading}>
            {t('loading')}{'.'.repeat(dots)}
        </div>
    );
};