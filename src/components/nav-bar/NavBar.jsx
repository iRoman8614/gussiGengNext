import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { IconButton } from "../buttons/icon-btn/IconButton.jsx";
import { BigButton } from "../buttons/big-btn/BigButton.jsx";
import { toast } from "react-toastify";
import axiosInstance from '@/utils/axios';

import home from '../../../public/main-buttons/home.png';
import upgrades from '../../../public/main-buttons/upgrades.png';
import hands from '../../../public/main-buttons/hands.png';
import friends from '../../../public/main-buttons/friends.png';
import bag from '../../../public/main-buttons/bag.png';

import styles from './NavBar.module.scss';
import 'react-toastify/dist/ReactToastify.css';

export const NavBar = () => {
    const router = useRouter();
    const [userId, setUserId] = useState(111);

    useEffect(() => {
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
        if (typeof window === "undefined") return;

        const firstGame = sessionStorage.getItem('firstGame');
        if (firstGame) {
            const firstGameTime = new Date(firstGame);
            const now = new Date();
            const timeDiffInMs = now - firstGameTime; // Разница во времени в миллисекундах
            const remainingTimeInMs = (6 * 60 * 60 * 1000) - timeDiffInMs; // Оставшееся время до 6 часов в миллисекундах

            if (remainingTimeInMs > 0) {
                const hours = Math.floor(remainingTimeInMs / (1000 * 60 * 60));
                const minutes = Math.floor((remainingTimeInMs % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((remainingTimeInMs % (1000 * 60)) / 1000);
                toast.warn(`The next game will be available in ${hours} h. ${minutes} min. ${seconds} sec.`);
                return;
            } else {
                sessionStorage.removeItem('firstGame');
            }
        }
        try {
            const response = await axiosInstance.get(`/farm/last-games?profileId=${userId}`);
            const data = response.data;

            if (data.session.count < 6) {
                router.push('/pvp');
            } else {
                const firstGameTime = new Date(data.session.first);
                const now = new Date();
                const timeDiffInMs = now - firstGameTime; // Разница во времени в миллисекундах
                const remainingTimeInMs = (6 * 60 * 60 * 1000) - timeDiffInMs; // Оставшееся время до 6 часов в миллисекундах

                if (remainingTimeInMs > 0) {
                    const hours = Math.floor(remainingTimeInMs / (1000 * 60 * 60));
                    const minutes = Math.floor((remainingTimeInMs % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((remainingTimeInMs % (1000 * 60)) / 1000);
                    toast.warn(`The next game will be available in ${hours} h. ${minutes} min. ${seconds} sec.`);
                } else {
                    sessionStorage.removeItem('firstGame');
                    router.push('/pvp');
                }
            }
        } catch (error) {
            console.error("Ошибка при запросе /last-games:", error);
            toast.error('Error while checking game availability');
        }
    };

    return (
        <div className={styles.root}>
            <IconButton image={home} alt={'home'} title={'home'} onClick={() => {router.push('/main')}} />
            <IconButton image={upgrades} alt={'upgrades'} title={'exp'} onClick={() => {router.push('/upgrades')}} />
            <BigButton image={hands} alt={'pvp'} title={'pvp'} onClick={handlePvpClick} />
            <IconButton image={friends} alt={'friends'} title={'friends'} onClick={() => {router.push('/friends')}} />
            <IconButton image={bag} alt={'items'} title={'items'} onClick={() => {router.push('/main')}} />
        </div>
    );
};
