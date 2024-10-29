import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import {useRouter} from "next/router";
import { Navigation, Controller } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import styles from '@/styles/faq.module.scss'
import Link from "next/link";

const bg = '/backgrounds/leaderboardBG.png'

const slides = [
    '/faq/homeslide.png',
    '/faq/pvpslide.png',
    '/faq/homeslide.png',
    '/faq/pvpslide.png'
]

export default function Page() {
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);

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

    const slideNames = [
        {
            text: 'home screen',
            link: '/faq/home'
        },
        {
            text: 'pvp screen',
            link: '/faq/pvp'
        },
        {
            text: 'home screen',
            link: '/faq/home'
        },
        {
            text: 'pvp screen',
            link: '/faq/pvp'
        },
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
                        {slides.map((character, index) => (
                            <SwiperSlide
                                key={index}
                                className={index === activeIndex ? styles.activeSlide : styles.inactiveSlide}
                            >
                                <div className={index === activeIndex ? styles.activeSlideImageWrapper : styles.inactiveSlideImageWrapper}>
                                    <Image
                                        width={index === activeIndex ? 100 : 80}
                                        height={index === activeIndex ? 194 : 155}
                                        src={slides[index]}
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
                        <span>{slideNames[activeIndex].text}</span>
                    </div>
                    <button className={styles.navRight} onClick={handleSlideNext}>
                        <Image src={'/Arrow.png'} alt={''} width={15} height={15} />
                    </button>
                </div>
                <Image src={bg} alt={''} className={styles.bg} width={450} height={1000} />
                <div className={styles.container}>
                    {slideNames.slice(2).map((item, index) => <Link href={item.link} className={styles.listItem} key={index}>{item.text}</Link>)}
                </div>
            </div>
    )
}