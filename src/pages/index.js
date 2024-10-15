import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { toast } from "react-toastify";
import axiosInstance from '@/utils/axios';

import styles from '@/styles/Loader.module.scss';
import Head from "next/head";

const loaderImage = '/loadingImg.jpg';

export default function LoaderPage() {
    const router = useRouter();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        function setTelegramHeight() {
            const availableHeight = window.innerHeight;
            document.body.style.height = `${availableHeight}px`;
        }
        const initializeTelegramWebApp = () => {
            if (window.Telegram?.WebApp) {
                // const platform = window.Telegram.WebApp.platform;
                // const screenWidth = window.innerWidth;
                // if ((platform !== 'ios' && platform !== 'android') || (screenWidth > 450)) {
                //     router.push('/qr');
                //     return;
                // }
                window.Telegram.WebApp.setHeaderColor('#183256');
                window.Telegram.WebApp.expand();
                setTelegramHeight();
                window.addEventListener('resize', setTelegramHeight);
                const search = window.Telegram.WebApp.initData;
                const urlParams = new URLSearchParams(search);
                const userParam = urlParams.get('user');
                if (userParam) {
                    const decodedUserParam = decodeURIComponent(userParam);
                    const userObject = JSON.parse(decodedUserParam);
                    setUserId(userObject.id);
                }
            } else {
                toast.error("Telegram WebApp недоступен");
                // router.push('/qr');
            }
        };

        const checkReferralLink = () => {
            const { referal } = router.query;
            if (referal) {
                return axiosInstance.get(`/profile/referal`, {
                    params: {
                        referal: referal
                    }
                }).then(response => {
                    console.log('Ответ от сервера при передаче referal:', response.data);
                }).catch(error => {
                    console.error('Ошибка при запросе /referal:', error);
                });
            } else {
                return Promise.resolve();
            }
        };

        const checkLocalStorageAndInit = () => {
            localStorage.removeItem("GWToken");
            const tgUserId = userId || 111;
            const init = localStorage.getItem('init');
            const myToken = window.localStorage.getItem('GWToken');
            if (!init || !myToken) {
                axiosInstance.get(`/profile/init?profileId=${tgUserId}`)
                    .then(response => {
                        const data = response.data;
                        const initData = {
                            group: data.group,
                            farm: data.farm,
                            balance: data.balance,
                        };
                        localStorage.setItem('init', JSON.stringify(initData));
                        const token = data.jwt.replace(/"/g, '');
                        localStorage.setItem('GWToken', token);
                    })
                    .then(() => checkReferralLink())
                    .then(() => {
                        checkStartData(tgUserId);
                    })
                    .catch(error => {
                        toast.error('Error during init request');
                        console.error('Ошибка при запросе /init:', error);
                    });
            } else {checkReferralLink().then(() => {checkStartData(tgUserId)})}
        };

        const checkStartData = (tgUserId) => {
            const start = localStorage.getItem('start');
            if (!start) {
                axiosInstance.get(`/farm/start?profileId=${tgUserId}`)
                    .then(response => {
                        const data = response.data;
                        const startData = {
                            startTime: data.startTime,
                            rate: data.rate,
                            limit: data.limit,
                            balance: data.balance,
                            totalCoins: data.totalBalance,
                        };
                        localStorage.setItem('start', JSON.stringify(startData));
                        router.push('/getRandom');
                    })
                    .catch(error => {
                        toast.error('Error during start request');
                        console.error('Ошибка при запросе /start:', error);
                    });
            } else {
                router.push('/main');
            }
        };
        if (typeof window !== 'undefined') {
            window.Telegram?.WebApp.ready();
            initializeTelegramWebApp();
            if (userId !== null) {checkLocalStorageAndInit()}
            else {setTimeout(() => {if (userId !== null) {checkLocalStorageAndInit()}}, 1000)}}
        return () => {
            window.removeEventListener('resize', setTelegramHeight);
        };
    }, [userId, router]);

    return (
        <>
            <Head>
                <link rel="preload" href="/loadingImg.jpg" as="image" />
            </Head>
            <div className={styles.root}>
                <Image className={styles.video} src={loaderImage} alt="Loading..." width={500} height={500}/>
                <LoadingText/>
            </div>
        </>
    );
}

const LoadingText = () => {
    const [dots, setDots] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {setDots(prevDots => (prevDots + 1) % 4)}, 500);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className={styles.loading}>
            Loading{'.'.repeat(dots)}
        </div>
    );
};
