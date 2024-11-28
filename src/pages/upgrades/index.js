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
    const [completedTasks, setCompletedTasks] = useState([]);
    const [tasks, setTasks] = useState([]);

    const sliderImages = [
        '/upgradesCards/slider/rateSlide.png',
        '/upgradesCards/slider/limitSlide.png',
    ]

    const rateImages = {
        "farm_rate_level_2.5_0": '/upgradesCards/rate/1rate.png',
        "farm_rate_level_2.5": '/upgradesCards/rate/2rate.png',
        "farm_rate_level_4": '/upgradesCards/rate/3rate.png',
        "farm_rate_level_5": '/upgradesCards/rate/4rate.png',
        "farm_rate_level_10": '/upgradesCards/rate/5rate.png',
    };

    const limitImages = {
        "farm_limit_level_2.5_0": '/upgradesCards/limit/1limit.png',
        "farm_limit_level_2.5": '/upgradesCards/limit/2limit.png',
        "farm_limit_level_4": '/upgradesCards/limit/3limit.png',
        "farm_limit_level_5": '/upgradesCards/limit/4limit.png',
        "farm_limit_level_10": '/upgradesCards/limit/5limit.png'
    }

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

    const fetchTasks = async () => {
        try {
            const response = await axiosInstance.get("/task/all");
            if (response?.data) {
                const filteredTasks = response.data.filter(task => task.type === 5 || task.type === 6);
                setTasks(filteredTasks);
            } else {
                console.error("Ответ от /task/all пустой");
            }
        } catch (error) {
            console.error("Ошибка при загрузке заданий:", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        updateContext()
    }, [rate, limit])

    useEffect(() => {
        fetchCompletedTasks();
    }, []);

    const isAvailable = (item) => {
        if (item.id === 1) return true;
        const taskKey = item.key;
        return completedTasks.some(task => task.task.key === taskKey);
    };

    const fetchCompletedTasks = async () => {
        try {
            const response = await axiosInstance.get(`/task/completed-tasks`);
            setCompletedTasks(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке выполненных заданий:', error);
        }
    };

    const fetchRateLevels = async () => {
        try {
            const rateResponse = await axiosInstance.get(`/farm/rate-levels`);
            const rateLevelsWithType = rateResponse.data.map(level => ({ ...level, type: 'rate' }));
            setRateLevels(rateLevelsWithType);
        } catch (error) {
            console.error('Ошибка при загрузке уровней:', error);
        }
    };

    const fetchLimitLevels = async () => {
        try {
            const limitResponse = await axiosInstance.get(`/farm/limit-levels`);
            const limitLevelsWithType = limitResponse.data.map(level => ({ ...level, type: 'limit' }));
            setLimitLevels(limitLevelsWithType);
        } catch (error) {
            console.error('Ошибка при загрузке уровней:', error);
        }
    };

    useEffect(() => {
        fetchRateLevels()
        fetchLimitLevels()
        executeAvailableTasks()
        fetchCompletedTasks()
    }, [completedTasks]);

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
                item.id === levelId ? response.data : item
            ));
            const collectData = await collectAndStart();
            const updatedBalance = collectData.totalCoins;
            setBalance(updatedBalance);
            updateContext()
            setShowLevelUp(true);
            fetchCompletedTasks();
            fetchLimitLevels();
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
                item.id === levelId ? response.data : item
            ));
            const collectData = await collectAndStart();
            const updatedBalance = collectData.totalCoins;
            setBalance(updatedBalance);
            updateContext()
            setShowLevelUp(true);
            fetchCompletedTasks();
            fetchRateLevels();
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

    const executeTask = async (taskId) => {
        try {
            const response = await axiosInstance.get(`/task/execute?taskId=${taskId}`);
            if (response.data) {
                toast.success("Следующий апгрейд разблокирован")
                console.log(response.data)
                fetchCompletedTasks();
            } else {
                console.error("Ошибка выполнения задания.");
            }
        } catch (error) {
            console.error("Ошибка при выполнении задания:", error);
        }
    };

    const executeAvailableTasks = () => {
        tasks.forEach(task => {
            const metaKey = task.type === 5 ? "farming_limit_level" : "farming_rate_level";
            const relatedCard = [...limitLevels, ...rateLevels].find(card => {
                if (task.meta[metaKey]) {
                    return card.key === task.meta[metaKey];
                } else {
                    return card.key === task.key;
                }
            });
            const isTaskCompleted = completedTasks.some(completed => completed.task.id === task.id);
            if (!isTaskCompleted && relatedCard && relatedCard.level >= task.amount) {
                console.log(`Выполняется задание ID: ${task.id}`);
                executeTask(task.id);
            }
        })
    };

    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <div className={styles.balanceContainer}>
                    <div className={styles.title}>{t('EXP.upgrades')}</div>
                    <div className={styles.balance}>{formatNumberFromEnd(coins)}{' '}<Image src={money} alt={''} width={21} height={21} loading="lazy" /></div>
                </div>
                <div className={styles.block}>
                    <div className={styles.personalContainer}>
                        <div className={styles.list}>
                            <div className={styles.containerSwiper}>
                                <button className={styles.navLeft} onClick={handleSlidePrev}>
                                    <Image src={'/ArrowWhite.png'} alt={''} width={20} height={20} loading="lazy" />
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
                                    <Image src={'/ArrowWhite.png'} alt={''} width={20} height={20} loading="lazy" />
                                </button>
                            </div>
                            {activeIndex === 0 && <>
                                {rateLevels.length !== 0 ? <div className={styles.itemsList}>{rateLevels.map((item, index) => (
                                    <ItemPlaceholder img={rateImages[item.key]} item={item} key={index} onClick={() => openUpgradeModal(item)} available={isAvailable(item)} />
                                ))}</div> : <div className={styles.warning}>{t('EXP.noups')}</div>}
                            </>}
                            {activeIndex === 1 && <>
                                {limitLevels.length !== 0 ? <div className={styles.itemsList}>{limitLevels.map((item, index) => (
                                    <ItemPlaceholder img={limitImages[item.key]} item={item} key={index} onClick={() => openUpgradeModal(item)} available={isAvailable(item)} />
                                ))}</div> : <div className={styles.warning}>{t('EXP.noups')}</div>}
                            </>}
                        </div>
                    </div>
                </div>
                {isUpgradeModalOpen && selectedItem && (
                    <div className={styles.modalOverlay}>
                        <div className={showLevelUp ? styles.modalUpBoreder : styles.modalBorder}>
                            <div className={styles.modalUpgrades}>
                                <h3>
                                    <a className={styles.green}>
                                        {
                                            (selectedItem.type === 'limit' ?
                                                (Number(limit) * (1 + (Number(selectedItem.increasePer)/100)))
                                                :
                                                (Number(rate) * (1 + (Number(selectedItem.increasePer)/100)))).toFixed(3)
                                        }
                                    </a>
                                </h3>
                                <Image src={'/ArrowWhite.png'} alt={''} width={15} height={15} className={styles.arrowUp} loading="lazy" />
                                <p>
                                    <a>
                                        {selectedItem.type === 'limit' ?
                                            Number(limit)
                                            :
                                            Number(rate).toFixed(3)
                                        }
                                    </a>
                                </p>
                                <p>
                                    {selectedItem.type === 'limit' ? `${t('EXP.limit')} +${selectedItem.name}%` : `${t('EXP.rate')} +${selectedItem.name}%`}
                                </p>
                                <p>{t('EXP.lvl')}: {selectedItem.level}</p>
                                <p>{t('EXP.cost')}: {selectedItem.cost}</p>
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
                                        ? handleLimitUpgrade(selectedItem.id, selectedItem.cost)
                                        : handleRateUpgrade(selectedItem.id, selectedItem.cost);
                                }
                                if(selectedItem && coins < selectedItem.cost) {
                                    toast.error('Not enough coins available.')
                                }
                            }}
                            disabled={selectedItem && coins < selectedItem.cost}
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