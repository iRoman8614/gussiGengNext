import React, {useCallback, useEffect, useRef, useState} from "react";
import Image from "next/image";
import {useRouter} from "next/router";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Controller } from 'swiper/modules';
import {ListItem} from "@/components/ListItem/ListItem";
import axiosInstance from "@/utils/axios";

import styles from '@/styles/Boards.module.scss'
import Head from "next/head";

const bg = '/backgrounds/leaderboardBG.png'

export default function Page() {
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);
    const [teamId, setTeamId] = useState(1)
    const [currentWins, setCurrentWins] = useState(0)
    const [userId, setUserId] = useState(null);
    const [liga, setLiga] = useState(1)
    const [leaderData, setLeaderData] = useState([]);

    const ligsLimits = ['10', '25', '50', '100', '250', '500', '500+']
    const length = currentWins / ligsLimits[activeIndex] * 100

    // Кэш для данных лидеров по лигам
    const leadersCache = useRef({});

// useCallback для запроса лидеров по лиге
    const fetchLeaderboard = useCallback(async (liga) => {
        // Проверяем кэш
        if (leadersCache.current[liga]) {
            setLeaderData((prevData) => ({
                ...prevData,
                [liga]: leadersCache.current[liga]
            }));
            return;
        }

        try {
            const response = await axiosInstance.get(`/profile/leaders?liga=${liga}`);
            const data = response.data;
            // Сохраняем данные в кэш
            leadersCache.current[liga] = data;
            setLeaderData((prevData) => ({
                ...prevData,
                [liga]: data
            }));
        } catch (error) {
            console.error("Ошибка при запросе данных лидеров:", error);
        }
    }, []);

    useEffect(() => {
        const liga = activeIndex + 1;
        if (!leaderData[liga]) {
            fetchLeaderboard(liga);
        }
    }, [activeIndex, leaderData, fetchLeaderboard]);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const search = window.Telegram.WebApp.initData;
            const urlParams = new URLSearchParams(search);
            const userParam = urlParams.get('user');
            if (userParam) {
                const decodedUserParam = decodeURIComponent(userParam);
                const userObject = JSON.parse(decodedUserParam);
                setUserId(userObject.id);
                fetchStats(userObject.id)
            } else {
                setUserId(111);
                fetchStats(111);
            }
        }
    }, []);

    const fetchStats = async (userId) => {
        try {
            const response = await axiosInstance.get(`/profile/stats`);
            if (response.status === 400 || response.status === 401 || response.status === 403) {
                // Вызов /profile/init для обновления токена
                await axiosInstance.get(`/profile/init?profileId=${userId}`)
                    .then(initResponse => {
                        const data = initResponse.data;
                        const token = data.jwt.replace(/"/g, '');
                        localStorage.setItem('GWToken', token);
                        console.log("JWT token saved:", token);
                    })
                    .catch(error => {
                        throw error;
                    });
                const retryResponse = await axiosInstance.get(`/profile/stats`);
                const retryData = retryResponse.data;
                setCurrentWins(retryData.victory);
                setLiga(retryData.liga);
            } else {
                const data = response.data;
                setCurrentWins(data.victory);
                setLiga(data.liga);
            }
        } catch (error) {
            console.error('Ошибка при получении статистики:', error);
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            const init = JSON.parse(localStorage.getItem("init"));
            if (init && init.group) {
                setTeamId(init.group.id);
            }
        }
    }, [])

    useEffect(() => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp?.BackButton) {
            window.Telegram.WebApp.BackButton.show();
            window.Telegram.WebApp.BackButton.onClick(() => {
                router.push('/');
            });
            return () => {
                window.Telegram.WebApp.BackButton.hide();
            };
        }
    }, [router]);

    const characters ={
        1: [
            { name: 'Associate', icon: '/skins/gg.png' },
            { name: 'Street soldier', icon: '/skins/gg2.png' },
            { name: 'Hood hustler', icon: '/skins/gg3.png' },
            { name: 'Block boss', icon: '/skins/gg4.png' },
            { name: 'CApo', icon: '/skins/gg5.png' },
            { name: 'Syndicate kingpin', icon: '/skins/gg6.png' },
        ],
        2: [
            { name: 'Associate', icon: '/skins/bg.png' },
            { name: 'Street soldier', icon: '/skins/bg2.png' },
            { name: 'Hood hustler', icon: '/skins/bg3.png' },
            { name: 'Block boss', icon: '/skins/bg4.png' },
            { name: 'CApo', icon: '/skins/bg5.png' },
            { name: 'Syndicate kingpin', icon: '/skins/bg6.png' },
        ],
        3: [
            { name: 'Associate', icon: '/skins/yg.png' },
            { name: 'Street soldier', icon: '/skins/yg2.png' },
            { name: 'Hood hustler', icon: '/skins/yg3.png' },
            { name: 'Block boss', icon: '/skins/yg4.png' },
            { name: 'CApo', icon: '/skins/yg5.png' },
            { name: 'Syndicate kingpin', icon: '/skins/yg6.png' },
        ],
        4: [
            { name: 'Associate', icon: '/skins/rg.png' },
            { name: 'Street soldier', icon: '/skins/rg2.png' },
            { name: 'Hood hustler', icon: '/skins/rg3.png' },
            { name: 'Block boss', icon: '/skins/rg4.png' },
            { name: 'CApo', icon: '/skins/rg5.png' },
            { name: 'Syndicate kingpin', icon: '/skins/rg6.png' },
        ],
    };

    const swiperRef = useRef(null);
    const handleSlidePrev = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }
        if (swiperRef.current) {
            swiperRef.current.slidePrev();
        }
    };

    const handleSlideNext = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }
        if (swiperRef.current) {
            swiperRef.current.slideNext();
        }
    };

    const handleSlideChange = (swiper) => {
        setActiveIndex(swiper.realIndex);
    };

    return(
        <>
            <Head>
                <link rel="preload" href="/backgrounds/leaderboardBG.png" as="image" />
                <link rel="preload" href="/Arrow.png" as="image" />
            </Head>
            <div className={styles.root}>
                <div className={styles.containerSwiper}>
                    <Swiper
                        modules={[Navigation, Controller]}
                        spaceBetween={-3}
                        slidesPerView={3}
                        centeredSlides={true}
                        loop={true}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        onSlideChange={handleSlideChange}
                        className={styles.swiper}
                    >
                        {characters[teamId].map((character, index) => (
                            <SwiperSlide
                                key={index}
                                className={index === activeIndex ? styles.activeSlide : styles.inactiveSlide}
                            >
                                <div className={index === activeIndex ? styles.activeSlideImageWrapper : styles.inactiveSlideImageWrapper}>
                                    <Image
                                        width={index === activeIndex ? 100 : 80}
                                        height={index === activeIndex ? 194 : 155}
                                        src={character.icon}
                                        alt={''}
                                        className={styles.icon}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
                <div className={styles.navigation}>
                    <button className={styles.navLeft} onClick={handleSlidePrev}>
                        <Image src={'/Arrow.png'} alt={''} width={15} height={15} />
                    </button>
                    <div className={styles.caption}>
                        <span>{characters[teamId][activeIndex].name}</span>
                    </div>
                    <button className={styles.navRight} onClick={handleSlideNext}>
                        <Image src={'/Arrow.png'} alt={''} width={15} height={15} />
                    </button>
                </div>
                <div className={styles.progressBar}>
                    <div className={styles.progress} style={{width: `${length}%`}}></div>
                </div>
                <div className={styles.winsCounter}>{`wins ${currentWins}/${ligsLimits[activeIndex]}`}</div>
                <Image src={bg} alt={''} className={styles.bg} width={450} height={1000} />
                <div className={styles.container}>
                    {leaderData[activeIndex + 1] && leaderData[activeIndex + 1].length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>Nobody has reached this league yet.</p>
                            <p>Be the first!</p>
                        </div>
                    ) : leaderData[activeIndex + 1] ? (
                        leaderData[activeIndex + 1].map((user, index) => (
                            <ListItem key={index} item={user} index={index + 1} />
                        ))
                    ) : (
                        <div className={styles.emptyState}>Loading...</div> // Или другой индикатор загрузки
                    )}
                </div>
            </div>
        </>
    )
}