import {useEffect, useRef, useState} from 'react';
import Image from "next/image";
import {useRouter} from "next/router";
import {ItemPlaceholder} from "@/components/itemPlaceholder/ItemPlaceholder";
import axiosInstance from '@/utils/axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import {useTranslation} from "react-i18next";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/controller';
import styles from '@/styles/Upgrades.module.scss'
import {Controller, Navigation} from "swiper/modules";
import {toast} from "react-toastify";
import {useInit} from "@/context/InitContext";
import {useFarmCollect} from "@/utils/api";

const money = '/money.png'

export default function Page() {
    const router = useRouter();
    const { t } = useTranslation();
    const { coins, updateContext, limit, rate } = useInit();
    const { collectAndStart } = useFarmCollect();

    const swiperRef = useRef(null);
    const [balance, setBalance] = useState(0);
    const [limitLevels, setLimitLevels] = useState([]);
    const [rateLevels, setRateLevels] = useState([]);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [showLevelUp, setShowLevelUp] = useState(false);

    const sliderImages = [
        '/upgradesCards/slider/rateSlide.png',
        '/upgradesCards/slider/limitSlide.png',
    ]

    const rateImages = [
        '/upgradesCards/rate/1rate.png',
        '/upgradesCards/rate/2rate.png',
        '/upgradesCards/rate/3rate.png',
        '/upgradesCards/rate/4rate.png',
        '/upgradesCards/rate/5rate.png'
    ]

    const limitImages = [
        '/upgradesCards/limit/1limit.png',
        '/upgradesCards/limit/2limit.png',
        '/upgradesCards/limit/3limit.png',
        '/upgradesCards/limit/4limit.png',
        '/upgradesCards/limit/5limit.png'
    ]

    const upgradesList = [
        t('EXP.speeds'),
        t('EXP.limits')
    ]

    useEffect(() => {
        if (typeof window !== "undefined") {
            const start = JSON.parse(localStorage.getItem("start"));
            if (start) {
                setRate(start.rate);
                setLimit(start.limit);
            }
        }
    }, []);

    useEffect(() => {
        updateContext()
    }, [rate, limit])

    const fetchLevels = async () => {
        try {
            const limitResponse = await axiosInstance.get(`/farm/limit-levels`);
            const limitLevelsWithType = limitResponse.data.map(level => ({ ...level, type: 'limit' }));
            setLimitLevels(limitLevelsWithType);
            const rateResponse = await axiosInstance.get(`/farm/rate-levels`);
            const rateLevelsWithType = rateResponse.data.map(level => ({ ...level, type: 'rate' }));
            setRateLevels(rateLevelsWithType);
        } catch (error) {
            console.error('Ошибка при загрузке уровней:', error);
        }
    };

    useEffect(() => {
        fetchLevels();
    }, []);

    const openUpgradeModal = (item) => {
        setSelectedItem(item);
        updateContext()
        setIsUpgradeModalOpen(true);
    };

    const closeUpgradeModal = () => {
        setIsUpgradeModalOpen(false);
        setSelectedItem(null);
    };

    const handleLimitUpgrade = async (levelId) => {
        try {
            const response = await axiosInstance.get(`/farm/limit-level-up?levelId=${levelId}`);
            setLimitLevels(prevLevels => prevLevels.map(item =>
                item.Id === levelId ? response.data : item
            ));
            const collectData = await collectAndStart();
            const updatedBalance = collectData.totalCoins;
            setBalance(updatedBalance);
            updateContext()
            setShowLevelUp(true);
            fetchLevels();
            setTimeout(() => {
                closeUpgradeModal();
                setShowLevelUp(false);
            }, 2000);
        } catch (error) {
            console.error('Ошибка при улучшении лимита:', error);
        }
    };

    const handleRateUpgrade = async (levelId) => {
        try {
            const response = await axiosInstance.get(`/farm/rate-level-up?levelId=${levelId}`);
            setRateLevels(prevLevels => prevLevels.map(item =>
                item.Id === levelId ? response.data : item
            ));
            const collectData = await collectAndStart();
            const updatedBalance = collectData.totalCoins;
            setBalance(updatedBalance);
            updateContext()
            setShowLevelUp(true);
            fetchLevels();
            setTimeout(() => {
                closeUpgradeModal();
                setShowLevelUp(false);
            }, 2000);
        } catch (error) {
            console.error('Ошибка при улучшении прокачки:', error);
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            const start = JSON.parse(localStorage.getItem("start"));
            if (start) {
                setBalance(start.coins);
            }
        }
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


    const handleSlideChange = (swiper) => {
        setActiveIndex(swiper.realIndex);
    };

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

    function formatNumberFromEnd(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1 ");
    }

    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <div className={styles.balanceContainer}>
                    <div className={styles.title}>{t('main.exp')}</div>
                    <div className={styles.balance}>{formatNumberFromEnd(coins)}{' '}<Image src={money} alt={''} width={21} height={21} loading="lazy" /></div>
                </div>
                <div className={styles.block}>
                    <div className={styles.personalContainer}>
                        <div className={styles.list}>
                            <div className={styles.containerSwiper}>
                                <button className={styles.navLeft} onClick={handleSlidePrev}>
                                    <Image src={'/ArrowWhite.png'} alt={''} width={15} height={15} loading="lazy" />
                                </button>
                                <Swiper
                                    modules={[Navigation, Controller]}
                                    slidesPerView={1}
                                    centeredSlides={false}
                                    spaceBetween={10}
                                    loop={true}
                                    onSwiper={(swiper) => {
                                        swiperRef.current = swiper;
                                    }}
                                    onSlideChange={handleSlideChange}
                                    className={styles.swiper}
                                >
                                    {sliderImages.map((image, index) => (
                                        <SwiperSlide
                                            key={index}
                                            className={styles.slide}
                                        >
                                            <Image
                                                width={120}
                                                height={194}
                                                src={image}
                                                alt={''}
                                                className={styles.icon}
                                                loading="lazy"
                                            />
                                            <div className={styles.caption}>
                                                {upgradesList[activeIndex]}
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <button className={styles.navRight} onClick={handleSlideNext}>
                                    <Image src={'/ArrowWhite.png'} alt={''} width={15} height={15} loading="lazy" />
                                </button>
                            </div>
                            {activeIndex === 0 && <>
                                {rateLevels.length !== 0 ? <div className={styles.itemsList}>{rateLevels.map((item, index) => (
                                    <ItemPlaceholder img={rateImages[index]} item={item} key={index} onClick={() => openUpgradeModal(item)} />
                                ))}</div> : <div className={styles.warning}>{t('EXP.noups')}</div>}
                            </>}
                            {activeIndex === 1 && <>
                                {limitLevels.length !== 0 ? <div className={styles.itemsList}>{limitLevels.map((item, index) => (
                                    <ItemPlaceholder img={limitImages[index]} item={item} key={index} onClick={() => openUpgradeModal(item)} />
                                ))}</div> : <div className={styles.warning}>{t('EXP.noups')}</div>}
                            </>}
                        </div>
                    </div>
                </div>
                {isUpgradeModalOpen && selectedItem && (
                    <div className={styles.modalOverlay}>
                        {selectedItem && coins < selectedItem.Cost && (
                            toast.error('Not enough coins available.')
                        )}
                        <div className={showLevelUp ? styles.modalUpBoreder : styles.modalBorder}>
                            <div className={styles.modalUpgrades}>
                                <h3>
                                    <a>
                                        {selectedItem.type === 'limit' ?
                                            Number(limit)
                                            :
                                            Number(rate).toFixed(3)
                                        }
                                    </a>
                                    {' '}
                                    <Image src={'/ArrowWhite.png'} alt={''} width={15} height={15} className={styles.navRight} loading="lazy" />
                                    {' '}
                                    <a className={styles.green}>
                                        {
                                            (selectedItem.type === 'limit' ?
                                                (Number(limit) * (1 + (Number(selectedItem.IncreasePer)/100)))
                                                :
                                                (Number(rate) * (1 + (Number(selectedItem.IncreasePer)/100)))).toFixed(3)
                                        }
                                    </a>
                                </h3>
                                <p>
                                    {selectedItem.type === 'limit' ? `${t('EXP.limit')} +${selectedItem.Name}%` : `${t('EXP.rate')} +${selectedItem.Name}%`}
                                </p>
                                <p>{t('EXP.lvl')}: {selectedItem.Level}</p>
                                <p>{t('EXP.cost')}: {selectedItem.Cost}</p>
                            </div>
                        </div>
                        <button
                            className={showLevelUp ? styles.modalUpBoreder : styles.modalBorder}
                            onClick={() => {
                                if (window.Telegram?.WebApp?.HapticFeedback) {
                                    window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
                                }
                                if (selectedItem) {
                                    selectedItem.type === 'limit'
                                        ? handleLimitUpgrade(selectedItem.Id, selectedItem.Cost)
                                        : handleRateUpgrade(selectedItem.Id, selectedItem.Cost);
                                }
                            }}
                            disabled={selectedItem && coins < selectedItem.Cost}
                        >
                            <div className={styles.modalBtn}>{t('EXP.upgrade')}</div>
                        </button>
                        <div className={showLevelUp ? styles.modalUpBoreder : styles.modalBorder} onClick={closeUpgradeModal}>
                            <div className={styles.modalBtn}>{t('EXP.close')}</div>
                        </div>
                    </div>
                )}
                {showLevelUp && <div className={styles.levelUpAnimation}>Level Up!</div>}
            </div>
        </div>
    );
};