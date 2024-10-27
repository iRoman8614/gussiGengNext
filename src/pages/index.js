import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Head from "next/head";
import { toast } from "react-toastify";
import axiosInstance from '@/utils/axios';

import styles from '@/styles/Loader.module.scss';

const loaderImage = '/loadingImg.jpg';

export default function LoaderPage() {
    const router = useRouter();
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
        const init = localStorage.getItem('init');
        const start = localStorage.getItem('start');
        const authToken = localStorage.getItem('authToken');
        const myToken = localStorage.getItem('GWToken');

        if (!init || !myToken) {
            try {
                const response = await axiosInstance.get(`/profile/init?token=${authToken}`);
                const data = response.data;
                localStorage.setItem('init', JSON.stringify(data));
                localStorage.setItem('GWToken', data.jwt)
                await checkStartData();
            } catch (error) {
                toast.error('Error during init request');
            }
        }
        else if (!start) {
            checkStartData();
        }
        else {
            router.push('/main');
        }
    }, [userId, router]);

    const checkStartData = useCallback(async () => {
        try {
            const response = await axiosInstance.get(`/farm/start`);
            localStorage.setItem('start', JSON.stringify(response.data));
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
        const initData = async(token) => {
            try {
                const response = await axiosInstance.get(`/profile/init?token=${token}`);
                localStorage.setItem('GWToken', response.data.jwt)
            } catch (e) {
                console.log(e)
            }
        }
        initData(token)
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
