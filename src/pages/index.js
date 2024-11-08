import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Head from "next/head";
import { toast } from "react-toastify";
import { useInit } from '@/context/InitContext';
import { useProfileInit, useFarmStart } from '@/utils/api';

import styles from '@/styles/Loader.module.scss';

const loaderImage = '/loadingImg.jpg';

const newPlayerAssets = [
    '/backgrounds/backalley.png', '/backgrounds/leaderboardBG.png',
    '/backgrounds/Lobby.png', '/backgrounds/nightcity.png',
    '/backgrounds/randomBG.png', '/random/blueCard.png',
    '/random/card.png', '/random/dialog.png', '/random/dialog2.png',
    '/random/greenCard.png', '/random/hand.png', '/random/oneCard.png',
    '/random/person.png', '/random/redCard.png', '/random/yellowCard.png',
];

export default function LoaderPage() {
    const router = useRouter();
    const { updateContext } = useInit();
    const [isNewPlayer, setIsNewPlayer] = useState(false);
    const [dataFetched, setDataFetched] = useState(false);
    const [authToken, setAuthToken] = useState(null);

    const CURRENT_VERSION = process.env.NEXT_PUBLIC_CURRENT_VERSION

    const { fetchProfileInit } = useProfileInit(authToken);
    const { fetchFarmStart } = useFarmStart();

    useEffect(() => {
        const { token } = router.query;
        if (token) {
            localStorage.setItem('authToken', token);
            setAuthToken(token);
        } else {
            console.error("Unauthorized");
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
                let userId = (userObject.id);
            }
            window.addEventListener('resize', updateBodyHeight);
        } else {
            toast.error("Telegram WebApp unavailable");
        }
        checkVersion();
    }, [updateBodyHeight]);

    const checkVersion = useCallback(() => {
        if (typeof window !== 'undefined') {
            console.log('проверка версии бд')
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
            console.log("проверка ls")
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
            console.log('запросы')
            try {
                const {data, error: initError } = await fetchProfileInit()
                if (initError) {
                    throw new Error('Initialization failed, restart app');
                }
                await fetchFarmStart()
                setDataFetched(true);
            } catch (error) {
                if(error.status === 401) {
                    toast.error('error during init request, restart app');
                    return;
                }
                return;
            }
        }
    }, [dataFetched, authToken]);


    const updateAndRedirect = useCallback(() => {
        console.log('upadete ls')
        const savedInit = JSON.parse(localStorage.getItem('init'));
        const savedFarm = JSON.parse(localStorage.getItem('farm'));
        const isExperiencedPlayer = savedInit && savedFarm
        updateContext();
        if (savedInit.groupId === 0 || savedFarm.farmLimit === 0) {
            return;
        }
        if (isNewPlayer) {
            console.log('to getRandom')
            router.push('/getRandom');
        } else if (isExperiencedPlayer) {
            console.log('to main')
            router.push('/main');
        }
    }, [isNewPlayer]);

    useEffect(() => {
        const { token } = router.query;
        const executeAfterToken = async (token) => {
            initializeTelegramWebApp()
            localStorage.setItem('authToken', token);
            await new Promise((resolve) => {
                localStorage.setItem('authToken', token);
                resolve();
            });
            const hasData = checkLocalStorage();
            if (!hasData) {
                await fetchData();
            }
            updateAndRedirect();
        };
        if (token) {
            executeAfterToken(token);
        } else {
            return
        }
    }, [router.query, authToken]);


    return (
        <>
            <Head>
                <link rel="preload" href={loaderImage} as="image" />
                {newPlayerAssets.map((src, index) => (
                    <link key={index} rel="preload" href={src} as="image" />
                ))}
            </Head>
            <div className={styles.root}>
                <Image className={styles.video} src={loaderImage} alt="Loading..." width={500} height={500} priority />
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