import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Head from "next/head";
import { toast } from "react-toastify";
import axiosInstance from '@/utils/axios';
import { useAssetsCache } from '@/context/AssetsCacheContext';

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
    '/random/blueCard.png',
    '/random/card.png',
    '/random/dialog.png',
    '/random/dialog2.png',
    '/random/greenCard.png',
    '/random/hand.png',
    '/random/oneCard.png',
    '/random/person.png',
    '/random/redCard.png',
    '/random/yellowCard.png'
];

const experiencedPlayerAssets = [
    ...backgroundAssets,
    '/main-buttons/account.png',
    '/main-buttons/bag.png',
    '/main-buttons/boards.png',
    '/main-buttons/FAQ.png',
    '/main-buttons/friends.png',
    '/main-buttons/hand2.png',
    '/main-buttons/hands.png',
    '/main-buttons/home.png',
    '/main-buttons/rich.png',
    '/main-buttons/settings.png',
    '/main-buttons/upgrades.png',
    '/main-buttons/wallet.png'
];

export default function LoaderPage() {
    const router = useRouter();
    const { preloadAssets } = useAssetsCache();
    const [userId, setUserId] = useState(null);

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
                setUserId(userObject.id);
            }
            window.addEventListener('resize', updateBodyHeight);
        } else {
            toast.error("Telegram WebApp недоступен");
        }
    }, [updateBodyHeight]);

    const checkLocalStorageAndRedirect = useCallback(async () => {
        localStorage.removeItem('GWToken')
        const init = localStorage.getItem('init');
        const start = localStorage.getItem('start');
        const myToken = localStorage.getItem('GWToken');
        const authToken = localStorage.getItem('authToken');

        if(!myToken) {
            const response = await axiosInstance.get(`/profile/init?token=${authToken}`);
            const data = response.data;
            localStorage.setItem('GWToken', data.jwt)
        }

        if (!init) {
            try {
                const response = await axiosInstance.get(`/profile/init?token=${authToken}`);
                const data = response.data;
                localStorage.setItem('init', JSON.stringify(data));
                localStorage.setItem('GWToken', data.jwt)
                await checkStartData();
            } catch (error) {
                toast.error('Error during init request');
            }
        } else if (!start) {
            checkStartData();
        } else {
            await preloadAssets(experiencedPlayerAssets);
            router.push('/main');
        }
    }, [userId, router]);

    const checkStartData = useCallback(async () => {
        try {
            const response = await axiosInstance.get(`/farm/start`);
            localStorage.setItem('start', JSON.stringify(response.data));
            await preloadAssets(newPlayerAssets);
            router.push('/getRandom');
        } catch (error) {
            toast.error('Error during start request');
        }
    }, [router]);

    useEffect(() => {
        const { token } = router.query;
        if (token) {
            localStorage.setItem('authToken', token);
        }
    }, [router.query]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            initializeTelegramWebApp();
            window.Telegram?.WebApp.ready();
            if (userId !== null) {
                checkLocalStorageAndRedirect();
            }
        }
        return () => {
            window.removeEventListener('resize', updateBodyHeight);
        };
    }, [initializeTelegramWebApp, checkLocalStorageAndRedirect, userId, updateBodyHeight]);

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
