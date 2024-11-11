import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { toast } from "react-toastify";
import { useInit } from '@/context/InitContext';
import { useProfileInit, useFarmStart, useProfileStats } from '@/utils/api';
import { useTranslation } from "react-i18next";
import { useCachedAssets } from '@/utils/cache';
import assetData from "@/mock/assets.json";
import CryptoJS from 'crypto-js';

import styles from '@/styles/Loader.module.scss';

const assetPaths = {
    loaderImage: '/loadingImg.jpg'
};

export default function LoaderPage() {
    const router = useRouter();
    const { updateContext } = useInit();
    const [dataFetched, setDataFetched] = useState(false);
    const [authToken, setAuthToken] = useState(null);
    const [groupId, setGroupId] = useState(null);
    const [liga, setLiga] = useState(null);
    const [loadingComplete, setLoadingComplete] = useState(false);
    let isNewPlayer = false;
    const cachedAssets = useCachedAssets(assetPaths, 'assets-cache-backgrounds');

    const CURRENT_VERSION = process.env.NEXT_PUBLIC_CURRENT_VERSION

    const token = createEncryptedToken();
    const { data: profileData, loading: profileLoading, error: profileError, fetchProfileInit } = useProfileInit(token);
    const { data: farmData, loading: farmLoading, error: farmError, fetchFarmStart } = useFarmStart();
    const { data: statsData, loading: statsLoading, error, statsError, fetchProfileStats } = useProfileStats()

    const updateBodyHeight = useCallback(() => {
        document.body.style.height = `${window.innerHeight}px`;
    }, []);

    const initializeTelegramWebApp = useCallback(() => {
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.setHeaderColor('#183256');
            window.Telegram.WebApp.expand();
            updateBodyHeight();
            window.addEventListener('resize', updateBodyHeight);
        } else {
            toast.error("Telegram WebApp unavailable");
        }
        checkVersion();
    }, [updateBodyHeight]);

    const checkVersion = useCallback(() => {
        if (typeof window !== 'undefined') {
            const savedVersion = localStorage.getItem('version');
            if (savedVersion !== CURRENT_VERSION) {
                localStorage.clear();
                isNewPlayer = true;
                localStorage.setItem('version', CURRENT_VERSION);
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
            await fetchFarmStart();
            await fetchProfileStats();
            if (initData.data.init.groupId) {
                const skinGroup = `skins.${groupId}`;
                loadAssets(skinGroup, assetData.skins[groupId]);
            }
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
        const init = localStorage.getItem('init');
        const start = localStorage.getItem('farm');
        const GWToken = localStorage.getItem('GWToken');
        const savedInit = JSON.parse(localStorage.getItem('init'));
        const savedFarm = JSON.parse(localStorage.getItem('farm'));
        let isExperiencedPlayer = false
        if (!init || !start || !GWToken) {
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
            initializeTelegramWebApp()
            await fetchData();
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
            <Image className={styles.video} src={cachedAssets.loaderImage} alt="Loading..." width={500} height={500} priority />
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