import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { IconButton } from "../buttons/icon-btn/IconButton.jsx";
import { BigButton } from "../buttons/big-btn/BigButton.jsx";
import { toast } from "react-toastify"; // Подключаем react-toastify

import home from '../../../public/main-buttons/home.png';
import upgrades from '../../../public/main-buttons/upgrades.png';
import hands from '../../../public/main-buttons/hands.png';
import friends from '../../../public/main-buttons/friends.png';
import bag from '../../../public/main-buttons/bag.png';

import styles from './NavBar.module.scss';
import 'react-toastify/dist/ReactToastify.css';

export const NavBar = () => {
    const router = useRouter();
    const [userId, setUserId] = useState(111); // Используем стандартный userId = 111

    useEffect(() => {
        // Проверяем, есть ли доступ к window, так как это может быть серверный рендеринг
        if (typeof window !== "undefined" && window.Telegram?.WebApp) {
            const search = window.Telegram.WebApp.initData;
            const urlParams = new URLSearchParams(search);
            const userParam = urlParams.get("user");
            if (userParam) {
                const decodedUserParam = decodeURIComponent(userParam);
                const userObject = JSON.parse(decodedUserParam);
                console.log("User ID from Telegram:", userObject.id);
                setUserId(userObject.id);
            }
        }
    }, []);

    const handlePvpClick = async () => {
        // Проверяем, есть ли доступ к window и sessionStorage
        if (typeof window === "undefined") return;

        const firstGame = sessionStorage.getItem('firstGame');

        if (firstGame) {
            // Если есть firstGame, считаем время до следующей игры
            const firstGameTime = new Date(firstGame);
            const now = new Date();
            const timeDiff = (now - firstGameTime) / (1000 * 60 * 60); // Разница в часах

            if (timeDiff < 6) {
                toast.warn(`Следующая игра доступна через ${6 - timeDiff.toFixed(2)} часов.`);
                return; // Игры еще не доступны
            } else {
                // Если прошло более 6 часов, удаляем firstGame и продолжаем
                sessionStorage.removeItem('firstGame');
            }
        }

        // Если firstGame нет, делаем запрос к /farm/first-winners
        try {
            const response = await fetch(`https://supavpn.lol/farm/first-winners?profileId=${userId}`);
            const data = await response.json();
            console.log("Ответ от /farm/first-winners:", data);

            if (data.count < 6) {
                // Если меньше 6 игр, разрешаем переход на /pvp
                router.push('/pvp');
            } else {
                // Если уже сыграно 6 игр, вычисляем время до следующей игры
                const firstGameTime = new Date(data.firstTime);
                const now = new Date();
                const timeDiff = (now - firstGameTime) / (1000 * 60 * 60); // Разница в часах

                if (timeDiff < 6) {
                    toast.warn(`Следующая игра доступна через ${6 - timeDiff.toFixed(2)} часов.`);
                } else {
                    // Удаляем firstGame из sessionStorage и продолжаем игру
                    sessionStorage.removeItem('firstGame');
                    router.push('/pvp');
                }
            }
        } catch (error) {
            console.error("Ошибка при запросе /first-winners:", error);
            toast.error('Ошибка при проверке доступности игры.');
        }
    };

    return (
        <div className={styles.root}>
            <IconButton image={home} alt={'home'} title={'home'} />
            <IconButton image={upgrades} alt={'upgrades'} title={'exp'} />
            <BigButton image={hands} alt={'pvp'} title={'pvp'} onClick={handlePvpClick} />
            <IconButton image={friends} alt={'friends'} title={'friends'} onClick={() => {router.push('/friends')}} />
            <IconButton image={bag} alt={'items'} title={'items'} />
        </div>
    );
};
