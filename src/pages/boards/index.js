import {useCallback, useEffect, useRef, useState} from "react";
import Image from "next/image";
import {useRouter} from "next/router";
import { Navigation, Controller } from 'swiper/modules';
import {ListItem} from "@/components/ListItem/ListItem";
import { Swiper, SwiperSlide } from 'swiper/react';
import axiosInstance from "@/utils/axios";
import skinData from '@/mock/skinsData'

import 'swiper/css';
import 'swiper/css/navigation';
import styles from '@/styles/Boards.module.scss'
import {useInit} from "@/context/InitContext";
import {useProfileStats} from "@/utils/api";

const bg = '/backgrounds/leaderboardBG.png'

export default function Page() {
    const router = useRouter();
    const { groupId, updateContext } = useInit();
    const [activeIndex, setActiveIndex] = useState(0);
    const [leaderData, setLeaderData] = useState([]);

    const { fetchProfileStats, data: stats } = useProfileStats();

    useEffect(() => {
        fetchProfileStats()
        updateContext()
    }, []);

    const ligsLimits = ['10', '25', '50', '100', '250', '500', '1000']
    const length = stats?.victory / ligsLimits[activeIndex] * 100

    const leadersCache = useRef({});

    const fetchLeaderboard = useCallback(async (liga) => {
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
        fetchStats()
    }, []);


    useEffect(() => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp?.BackButton) {
            window.Telegram.WebApp.BackButton.show();
            window.Telegram.WebApp.BackButton.onClick(() => {
                router.push('/main');
            });
            return () => {
                window.Telegram.WebApp.BackButton.hide();
            };
        }
    }, [router]);

    const ligsNames = [
        'associate',
        'street soldier',
        'hood hustler',
        'block boss',
        'capo',
        'syndicate kingpin',
        'seven',
    ]

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
                        {skinData[groupId]?.map((character, index) => (
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
                        <Image src={'/ArrowWhite.png'} alt={''} width={15} height={15} />
                    </button>
                    <div className={styles.caption}>
                        <span>{ligsNames[activeIndex]}</span>
                    </div>
                    <button className={styles.navRight} onClick={handleSlideNext}>
                        <Image src={'/ArrowWhite.png'} alt={''} width={15} height={15} />
                    </button>
                </div>
                <div className={styles.progressBar}>
                    <div className={styles.progress} style={{width: `${length}%`}}></div>
                </div>
                <div className={styles.winsCounter}>{`wins ${stats?.victory}}/${ligsLimits[activeIndex]}+`}</div>
                <Image src={bg} alt={''} className={styles.bg} width={450} height={1000} />
                <div className={styles.container}>
                    {leaderData[activeIndex + 1] && leaderData[activeIndex + 1].length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>Nobody has reached this league yet.</p>
                            <p>Be the first!</p>
                        </div>
                    ) : leaderData[activeIndex + 1] ? (
                        leaderData[activeIndex + 1].map((user, index) => (
                            <ListItem key={index} teamId={user.groupId} item={user} index={index + 1} />
                        ))
                    ) : (
                        <div className={styles.emptyState}>Loading...</div>
                    )}
                </div>
            </div>
    )
}