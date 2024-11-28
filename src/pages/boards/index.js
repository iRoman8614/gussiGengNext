import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import {useRouter} from "next/router";
import { Navigation, Controller } from 'swiper/modules';
import {useTranslation} from "react-i18next";
import {useInit} from "@/context/InitContext";
import {useProfileStats, useProfileLeaders} from "@/utils/api";
import {ListItem} from "@/components/ListItem/ListItem";
import { Swiper, SwiperSlide } from 'swiper/react';

import skinData from '@/mock/skinsData'

import 'swiper/css';
import 'swiper/css/navigation';
import styles from '@/styles/Boards.module.scss'

const bg = "/backgrounds/leaderboardBG.png"
const arrowWhite = "/ArrowWhite.png"

export default function Page() {
    const router = useRouter();
    const { t } = useTranslation();
    const { groupId, updateContext, liga } = useInit();
    const [activeIndex, setActiveIndex] = useState(liga);

    useEffect((setActiveIndex(liga)), [liga])

    console.log('liga', liga)
    console.log('activeIndex', activeIndex)

    const { fetchProfileStats, data: stats } = useProfileStats();
    const { data: leaderData } = useProfileLeaders(activeIndex + 1);

    useEffect(() => {
        fetchProfileStats()
        updateContext()
    }, []);

    const ligsLimits = ['10', '25', '50', '100', '250', '500', '1000']
    const length = stats?.victory / ligsLimits[activeIndex] * 100

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
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
        if (swiperRef.current) {
            swiperRef.current.slidePrev();
        }
    };

    const handleSlideNext = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
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
                                    loading="lazy"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <div className={styles.navigation}>
                <button className={styles.navLeft} onClick={handleSlidePrev}>
                    <Image src={arrowWhite} alt={''} width={15} height={15} loading="lazy" />
                </button>
                <div className={styles.caption}>
                    <span>{ligsNames[activeIndex]}</span>
                </div>
                <button className={styles.navRight} onClick={handleSlideNext}>
                    <Image src={arrowWhite} alt={''} width={15} height={15} loading="lazy" />
                </button>
            </div>
            <div className={styles.progressBar}>
                <div className={styles.progress} style={{width: `${length}%`}}></div>
            </div>
            <div className={styles.winsCounter}>{`${t('boards.wins')} ${stats?.victory}/${ligsLimits[activeIndex]}+`}</div>
            <Image src={bg} alt={''} className={styles.bg} width={450} height={1000} loading="lazy" />
            <div className={styles.container}>
                {leaderData && leaderData.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>{t('boards.nobody')}</p>
                        <p>{t('boards.first')}</p>
                    </div>
                ) : leaderData ? (
                    leaderData.map((user, index) => (
                        <ListItem key={index} teamId={user.teamId} item={user} index={index + 1} />
                    ))
                ) : (
                    <div className={styles.emptyState}>Loading...</div>
                )}
            </div>
        </div>
    )
}