import React, {useEffect, useRef, useState} from "react";
import Image from "next/image";
import {useRouter} from "next/router";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Controller } from 'swiper/modules';
import {ListItem} from "@/components/ListItem/ListItem";

import {ratingData} from '@/mock/ratingData'

import styles from '@/styles/Boards.module.scss'

const bg = '/backgrounds/leaderboardBG.png'

export default function Page() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [teamId, setTeamId] = useState(1)
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            // Получаем init из localStorage
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
        if (swiperRef.current) {
            swiperRef.current.slidePrev();
        }
    };

    const handleSlideNext = () => {
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
            </div>
            <Image src={bg} alt={''} className={styles.bg} width={450} height={1000} />
            <div className={styles.container}>
                {ratingData[activeIndex].map((item, index) => <ListItem key={index} item={item} index={index+1} />)}
            </div>
        </div>
    )
}



