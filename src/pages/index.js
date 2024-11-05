import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Head from "next/head";
import { toast } from "react-toastify";
import { useAssetsCache } from '@/context/AssetsCacheContext';
import { useInit } from '@/context/InitContext';
import { useProfileInit, useProfileStats, useFarmStart } from '@/utils/api';

import styles from '@/styles/Loader.module.scss';

const loaderImage = '/loadingImg.jpg';

const backgroundAssets = [
    '/backgrounds/backalley.png',
    '/backgrounds/leaderboardBG.png',
    '/backgrounds/Lobby.png',
    '/backgrounds/nightcity.png',
    '/backgrounds/randomBG.png'
];

const newPlayerAssets = [
    ...backgroundAssets,
    '/random/blueCard.png', '/random/card.png',
    '/random/dialog.png', '/random/dialog2.png',
    '/random/greenCard.png', '/random/hand.png',
    '/random/oneCard.png', '/random/person.png',
    '/random/redCard.png', '/random/yellowCard.png',
    '/upgradesCards/limit/limit1.png', '/upgradesCards/limit/limit2.png',
    '/upgradesCards/limit/limit3.png', '/upgradesCards/limit/limit4.png',
    '/upgradesCards/limit/limit5.png', '/upgradesCards/rate/rate1.png',
    '/upgradesCards/rate/rate2.png', '/upgradesCards/rate/rate3.png',
    '/upgradesCards/rate/rate4.png', '/upgradesCards/rate/rate5.png',
    '/upgradesCards/slider/limitSlide.png', '/upgradesCards/slider/rateSlide.png',
    '/ArrowWhite.png',
];

const experiencedPlayerAssets = [
    ...backgroundAssets,
    '/main-buttons/account.png', '/main-buttons/bag.png',
    '/main-buttons/boards.png', '/main-buttons/FAQ.png',
    '/main-buttons/friends.png', '/main-buttons/hand2.png',
    '/main-buttons/hands.png', '/main-buttons/home.png',
    '/main-buttons/rich.png', '/main-buttons/settings.png',
    '/main-buttons/upgrades.png', '/main-buttons/wallet.png',
    '/upgradesCards/limit/limit1.png', '/upgradesCards/limit/limit2.png',
    '/upgradesCards/limit/limit3.png', '/upgradesCards/limit/limit4.png',
    '/upgradesCards/limit/limit5.png', '/upgradesCards/rate/rate1.png',
    '/upgradesCards/rate/rate2.png', '/upgradesCards/rate/rate3.png',
    '/upgradesCards/rate/rate4.png', '/upgradesCards/rate/rate5.png',
    '/upgradesCards/slider/limitSlide.png', '/upgradesCards/slider/rateSlide.png'
];

export default function LoaderPage() {
    const router = useRouter();
    const { preloadAssets } = useAssetsCache();
    const { updateContext } = useInit();
    const [isNewPlayer, setIsNewPlayer] = useState(false);
    const [dataFetched, setDataFetched] = useState(false);
    const [authToken, setAuthToken] = useState(null);

    const CURRENT_VERSION = process.env.NEXT_PUBLIC_CURRENT_VERSION

    useEffect(() => {
        const tokenFromStorage = localStorage.getItem('authToken');
        if (tokenFromStorage) {
            setAuthToken(tokenFromStorage);
        }
    }, []);

    const { fetchProfileInit } = useProfileInit(authToken);
    const { fetchProfileStats } = useProfileStats();
    const { fetchFarmStart } = useFarmStart();

    useEffect(() => {
        const { token } = router.query;
        if (token) {
            localStorage.setItem('authToken', token);
            setAuthToken(token);
        } else {
            const tokenFromLocalStorage = localStorage.getItem('authToken');
            if (tokenFromLocalStorage) {
                setAuthToken(tokenFromLocalStorage);
            } else {
                toast.error("Unauthorized");
            }
        }
    }, [router.query]);

    const updateBodyHeight = useCallback(() => {
        document.body.style.height = `${window.innerHeight}px`;
    }, []);

    const initializeTelegramWebApp = useCallback(() => {
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.setHeaderColor('#183256');
            window.Telegram.WebApp.expand();
            updateBodyHeight();

            const search = window.Telegram.WebApp.initData;
            const urlParams = new URLSearchParams(search);
            const userParam = urlParams.get('user');
            if (userParam) {
                const decodedUserParam = decodeURIComponent(userParam);
                const userObject = JSON.parse(decodedUserParam);
            }
            window.addEventListener('resize', updateBodyHeight);
        } else {
            toast.error("Telegram WebApp unavailable");
        }
    }, [updateBodyHeight]);

    const checkVersion = useCallback(() => {
        if (typeof window !== 'undefined') {
            const savedVersion = localStorage.getItem('version');
            if (savedVersion !== CURRENT_VERSION) {
                localStorage.clear();
                setIsNewPlayer(true);
                localStorage.setItem('version', CURRENT_VERSION);
            }
        }
    }, [CURRENT_VERSION]);

    const checkLocalStorage = useCallback(() => {
        if (typeof window !== 'undefined') {
            const init = localStorage.getItem('init');
            const start = localStorage.getItem('farm');
            const GWToken = localStorage.getItem('GWToken');

            if (!init || !start || !GWToken) {
                setIsNewPlayer(true);
                return false;
            }
            return true;
        }
        return false;
    }, []);

    const fetchData = useCallback(async () => {
        if (!dataFetched && authToken) {
            try {
                await fetchProfileInit();
                await fetchProfileStats()
                await fetchFarmStart()
                setDataFetched(true);
            } catch (error) {
                toast.error('error during init request');
                return;
            }
        }
    }, [dataFetched, authToken]);

    const loadAssets = useCallback(async () => {
        if (isNewPlayer) {
            await preloadAssets(newPlayerAssets);
        } else {
            await preloadAssets(experiencedPlayerAssets);
        }
    }, [isNewPlayer, preloadAssets]);

    const updateAndRedirect = useCallback(() => {
        const savedInit = JSON.parse(localStorage.getItem('init'));
        const savedFarm = JSON.parse(localStorage.getItem('farm'));

        const isExperiencedPlayer = savedInit && savedFarm

        updateContext();

        if (savedInit.groupId === 0 || savedFarm.farmLimit === 0) {
            return;
        }

        if (isNewPlayer) {
            router.push('/getRandom');
        } else if (isExperiencedPlayer) {
            router.push('/main');
        }
    }, [isNewPlayer, router, updateContext]);

    useEffect(() => {
        const { token } = router.query;
        const executeAfterToken = async (token) => {
            initializeTelegramWebApp()
            localStorage.setItem('authToken', token);
            await new Promise((resolve) => {
                localStorage.setItem('authToken', token);
                resolve();
            });

            checkVersion();
            const hasData = checkLocalStorage();
            if (!hasData) {
                await fetchData();
                await loadAssets();
            }
            updateAndRedirect();
        };
        if (token) {
            executeAfterToken(token);
        } else {
            const tokenFromLocalStorage = localStorage.getItem('authToken');
            if (tokenFromLocalStorage) {
                executeAfterToken(tokenFromLocalStorage);
            } else {
                console.error("unauthorized");
            }
        }
    }, [router.query, authToken]);


    return (
        <>
            <Head>
                <link rel="preload" href={loaderImage} as="image" />
            </Head>
            <div className={styles.root}>
                <Image className={styles.video} src={loaderImage} alt="Loading..." width={500} height={500} />
                <LoadingText />
            </div>
        </>
    );
}

const LoadingText = () => {
    const [dots, setDots] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => { setDots(prevDots => (prevDots + 1) % 4); }, 500);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className={styles.loading}>
            Loading{'.'.repeat(dots)}
        </div>
    );
};