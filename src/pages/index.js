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
    '/upgradesCards/limit/limit3.png', '/upgradesCards/rate/rate1.png',
    '/upgradesCards/rate/rate2.png', '/upgradesCards/rate/rate3.png',
    '/upgradesCards/slider/limitSlide.png', '/upgradesCards/slider/rateSlide.png',
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
    '/upgradesCards/limit/limit3.png', '/upgradesCards/rate/rate1.png',
    '/upgradesCards/rate/rate2.png', '/upgradesCards/rate/rate3.png',
    '/upgradesCards/slider/limitSlide.png', '/upgradesCards/slider/rateSlide.png'
];

export default function LoaderPage() {
    const router = useRouter();
    const { preloadAssets } = useAssetsCache();
    const { updateContext } = useInit();
    const [isNewPlayer, setIsNewPlayer] = useState(false);
    const [dataFetched, setDataFetched] = useState(false);
    const [authToken, setAuthToken] = useState(null);
    const [hasError, setHasError] = useState(false);

    const CURRENT_VERSION = process.env.NEXT_PUBLIC_CURRENT_VERSION

    const { fetchProfileInit } = useProfileInit(authToken);
    const { fetchProfileStats } = useProfileStats();
    const { fetchFarmStart } = useFarmStart();

    const initializeTelegramWebApp = useCallback(() => {
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.setHeaderColor('#183256');
            window.Telegram.WebApp.expand();
            document.body.style.height = `${window.innerHeight}px`;
            window.addEventListener('resize', () => {
                document.body.style.height = `${window.innerHeight}px`;
            });
            return true;
            // const search = window.Telegram.WebApp.initData;
            // const urlParams = new URLSearchParams(search);
            // const userParam = urlParams.get('user');
            // if (userParam) {
            //     const decodedUserParam = decodeURIComponent(userParam);
            //     const userObject = JSON.parse(decodedUserParam);
            // }
        } else {
            toast.error("Telegram WebApp unavailable");
            return false;
        }
    }, []);

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
            const playerStatus = init && start && GWToken;
            console.log('playerStatus', playerStatus)
            setIsNewPlayer(!playerStatus);
            return playerStatus;
        }
    }, []);

    const fetchData = useCallback(async () => {
        try {
            const {data, error} = await fetchProfileInit();
            if (error || !data) {
                throw new Error('Error during profile initialization');
            }
            await fetchFarmStart();
            await fetchProfileStats();
            setDataFetched(true);
            setHasError(false);
        } catch (error) {
            setHasError(true);
            setDataFetched(false);
            if (error.response?.status === 401 || error?.status === 401 ) {
                toast.error('Unauthorized: Please check your token and try again.');
                if (window.Telegram?.WebApp) {
                    window.Telegram.WebApp.close();
                }
                return
            } else {
                toast.error('Error during data fetching. Please try again.');
                if (window.Telegram?.WebApp) {
                    window.Telegram.WebApp.close();
                }
                return
            }
        }
    }, [dataFetched, authToken]);

    const loadAssets = useCallback(async () => {
        await preloadAssets(isNewPlayer ? newPlayerAssets : experiencedPlayerAssets);
    }, [isNewPlayer, preloadAssets]);

    const updateAndRedirect = useCallback(() => {
        const savedInit = JSON.parse(localStorage.getItem('init'));
        const savedFarm = JSON.parse(localStorage.getItem('farm'));
        updateContext();
        if (savedInit?.groupId === 0 || savedFarm?.farmLimit === 0) return;
        router.push(isNewPlayer ? '/getRandom' : '/main');
    }, [isNewPlayer, router, updateContext]);

    useEffect(() => {
        const { token } = router.query;
        if (token) {
            localStorage.setItem('authToken', token);
            setAuthToken(token);
        }
    }, [router.query, authToken]);

    useEffect(() => {
        if (authToken) {
            if (initializeTelegramWebApp()) {
                checkVersion();
                checkLocalStorage();
                const loadDataAndAssets = async () => {
                    await fetchData();
                    if (!hasError) {
                        await loadAssets();
                        updateAndRedirect();
                    }
                };
                loadDataAndAssets();
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