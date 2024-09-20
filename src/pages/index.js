import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import styles from '../styles/Loader.module.scss'; // путь к вашему стилю

const loaderImage = '/loadingImg.jpg';

export default function LoaderPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState(null); // Состояние для хранения userId
    const router = useRouter();

    useEffect(() => {
        // Функция установки высоты экрана под Telegram WebApp
        function setTelegramHeight() {
            const availableHeight = window.innerHeight;
            document.body.style.height = `${availableHeight}px`;
        }

        const initializeTelegramWebApp = () => {
            if (window.Telegram?.WebApp) {
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
                    setUserId(111); // Если userParam не найден, используем userId = 1
                }
            } else {
                console.log("Telegram WebApp недоступен, используем userId = 111");
                setUserId(111); // Если Telegram WebApp недоступен, используем userId = 1
            }
        };

        // Проверка localStorage и запрос init
        const checkLocalStorageAndInit = async () => {
            console.log("Запуск проверки localStorage и init");

            const tgUserId = userId || 111; // Если userId не получен, подставляем 1 по умолчанию
            console.log("Используемый userId для запроса:", tgUserId);

            const init = localStorage.getItem('init');

            if (!init) {
                console.log("Данных init нет в localStorage, выполняем запрос /profile/init");
                try {
                    const response = await fetch(`https://supavpn.lol/profile/init?profileId=${tgUserId}`);
                    const data = await response.json();

                    console.log("Ответ от /profile/init:", data);

                    const initData = {
                        group: data.group,
                        farm: data.farm,
                    };
                    localStorage.setItem('init', JSON.stringify(initData));

                    checkStartData(tgUserId);
                } catch (error) {
                    console.error('Ошибка при запросе /init:', error);
                }
            } else {
                console.log("Данные init уже есть в localStorage");
                checkStartData(tgUserId);
            }
        };

        const checkStartData = async (tgUserId) => {
            const start = localStorage.getItem('start');

            if (!start) {
                console.log("Данных start нет в localStorage, выполняем запрос /farm/start");
                try {
                    const response = await fetch(`https://supavpn.lol/farm/start?profileId=${tgUserId}`);
                    const data = await response.json();
                    console.log("Ответ от /farm/start:", data);
                    localStorage.setItem('start', JSON.stringify(data));
                } catch (error) {
                    console.error('Ошибка при запросе /start:', error);
                }
            }
            router.push('/main'); // Перенаправляем на главную страницу
        };

        // Запускаем логику при монтировании компонента
        if (typeof window !== 'undefined') {
            window.Telegram?.WebApp.ready(); // Инициализация Telegram WebApp
            initializeTelegramWebApp(); // Запуск логики работы с Telegram WebApp

            if (userId !== null) {
                // Если userId уже получен, запускаем проверку localStorage
                console.log("userId уже получен:", userId);
                checkLocalStorageAndInit();
            } else {
                // Если userId еще не получен, ждем инициализации
                console.log("Ждем получения userId");
                setTimeout(() => {
                    console.log("userId после ожидания:", userId);
                    if (userId !== null) {
                        checkLocalStorageAndInit();
                    }
                }, 1000); // Даем 1 секунду на инициализацию Telegram WebApp
            }
        }

        return () => {
            window.removeEventListener('resize', setTelegramHeight); // Убираем обработчик события при размонтировании
        };
    }, [userId, router]);

    return (
        <div className={styles.root}>
            {isLoading && (
                <>
                    <Image className={styles.video} src={loaderImage} alt="Loading..." width={500} height={500} />
                    <LoadingText />
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
