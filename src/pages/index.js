import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Head from "next/head";
import { toast } from "react-toastify";
import { useInit } from '@/context/InitContext';
import { useProfileInit, useFarmStart } from '@/utils/api';
import CryptoJS from 'crypto-js';

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

    const CURRENT_VERSION = process.env.NEXT_PUBLIC_CURRENT_VERSION

    const token = createEncryptedToken();
    const { data: profileData, loading: profileLoading, error: profileError, fetchProfileInit } = useProfileInit(token);
    const { data: farmData, loading: farmLoading, error: farmError, fetchFarmStart } = useFarmStart();

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
                setIsNewPlayer(true);
                localStorage.setItem('version', CURRENT_VERSION);
            }
            else {
                const init = localStorage.getItem('init');
                const farm = localStorage.getItem('farm');
                const GWToken = localStorage.getItem('GWToken');
                setIsNewPlayer(!init || !farm || !GWToken);
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

    const fetchData = useCallback(async () => {
        try {
            await fetchProfileInit()
            await fetchFarmStart();
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
        } else if (!isNewPlayer && isExperiencedPlayer) {
            router.push('/main');
        }
    }, [isNewPlayer]);

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