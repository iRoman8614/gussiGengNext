import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { toast } from "react-toastify";
import axiosInstance from '@/utils/axios';

import styles from '../styles/Loader.module.scss';

const loaderImage = '/loadingImg.jpg';
const qr = '/qr.png'
const bg = '/backgrounds/randomBG.png'

export default function LoaderPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        function setTelegramHeight() {
            const availableHeight = window.innerHeight;
            document.body.style.height = `${availableHeight}px`;
        }
        const initializeTelegramWebApp = () => {
            if (window.Telegram?.WebApp) {
                // Проверяем платформу Telegram WebApp
                const platform = window.Telegram.WebApp.platform;
                console.log("Платформа:", platform);
                // Если не мобильная платформа, устанавливаем флаг
                if (platform === 'ios' && platform === 'android') {
                    setIsMobile(true); // Устанавливаем, что это не мобильное устройство
                }
                // Устанавливаем цвет заголовка
                window.Telegram.WebApp.setHeaderColor('#183256');
                window.Telegram.WebApp.expand();
                // Устанавливаем высоту под Telegram Web App
                setTelegramHeight();
                window.addEventListener('resize', setTelegramHeight);
                // Чтение initData и получение userId
                const search = window.Telegram.WebApp.initData;
                const urlParams = new URLSearchParams(search);
                const userParam = urlParams.get('user');
                if (userParam) {
                    const decodedUserParam = decodeURIComponent(userParam);
                    const userObject = JSON.parse(decodedUserParam);
                    console.log("Telegram userObject:", userObject);
                    console.log("User ID from Telegram:", userObject.id);
                    setUserId(userObject.id); // Сохраняем userId в состоянии
                } else {
                    console.log("Нет userParam, используем userId = 111");
                    setUserId(111); // Если userParam не найден, используем userId = 111
                }
            } else {
                toast.error("Telegram WebApp недоступен");
                setUserId(111); // Если Telegram WebApp недоступен, используем userId = 111
            }
        };

        // Проверка наличия параметра referal в URL
        const checkReferralLink = () => {
            const { referal } = router.query;
            if (referal) {
                console.log(`Отправляем запрос на сервер с referal: ${referal}`);
                return axiosInstance.get(`/profile/referal`, {
                    params: {
                        referal: referal
                    }
                }).then(response => {
                    console.log('Ответ от сервера при передаче referal:', response.data);
                }).catch(error => {
                    toast.error('Ошибка при обработке реферальной ссылки');
                    console.error('Ошибка при запросе /referal:', error);
                });
            } else {
                console.log("Параметр referal отсутствует");
                return Promise.resolve();
            }
        };

        // Проверка localStorage и запрос init
        const checkLocalStorageAndInit = () => {
            const tgUserId = userId || 111;
            console.log("Используемый userId для запроса:", tgUserId);
            const init = localStorage.getItem('init');
            const myToken = window.localStorage.getItem('GWToken');
            if (!init || !myToken) {
                console.log("Данных init нет в localStorage, выполняем запрос /profile/init");
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
                        console.log("JWT token saved:", token);
                    })
                    .then(() => checkReferralLink()) // Проверяем реферальную ссылку
                    .then(() => {
                        // После сохранения init и проверки реферальной ссылки, вызываем метод start
                        checkStartData(tgUserId);
                    })
                    .catch(error => {
                        toast.error('Error during init request');
                        console.error('Ошибка при запросе /init:', error);
                    });
            } else {
                console.log("Данные init уже есть в localStorage");
                checkReferralLink() // Если init уже есть, проверяем реферальную ссылку
                    .then(() => {
                        checkStartData(tgUserId); // И проверяем данные start
                    });
            }
        };

        // Метод для запроса /farm/start и сохранения в localStorage
        const checkStartData = (tgUserId) => {
            const start = localStorage.getItem('start');
            if (!start) {
                console.log("Данных start нет в localStorage, выполняем запрос /farm/start");
                axiosInstance.get(`/farm/start?profileId=${tgUserId}`)
                    .then(response => {
                        const data = response.data;
                        console.log("Ответ от /farm/start:", data);
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
                console.log("Данные start уже есть в localStorage, перенаправляем на /main");
                router.push('/main');
            }
        };
        if (typeof window !== 'undefined') {
            window.Telegram?.WebApp.ready();
            initializeTelegramWebApp();
            if(isMobile) {
                if (userId !== null) {
                    checkLocalStorageAndInit();
                } else {
                    setTimeout(() => {
                        if (userId !== null) {
                            checkLocalStorageAndInit();
                        }
                    }, 1000);
                }
            }
        }
        return () => {
            window.removeEventListener('resize', setTelegramHeight);
        };
    }, [userId, router]);


    return (
        <div className={styles.root}>
            {isMobile ? (
                isLoading && (
                    <>
                        <Image className={styles.video} src={loaderImage} alt="Loading..." width={500} height={500} />
                        <LoadingText />
                    </>
                )
            ) : (
                <>
                    <div className={styles.placeholder}>
                        <h2>Play on your mobile</h2>
                        <Image className={styles.qr} src={qr} alt="QR Code" width={200} height={200} />
                        <h2>@vodoleyservicebot</h2>
                    </div>
                </>

            )}
        </div>
    );
}

const LoadingText = () => {
    const [dots, setDots] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prevDots => (prevDots + 1) % 4);
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.loading}>
            Loading{'.'.repeat(dots)}
        </div>
    );
};
