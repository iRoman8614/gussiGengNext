import React, {useEffect, useRef, useState} from 'react';
import Image from "next/image";
import Head from "next/head";
import {useRouter} from "next/router";
import {ItemPlaceholder} from "@/components/itemPlaceholder/ItemPlaceholder";
import {TaskBtn} from "@/components/taskBtn/TaskBtn";
import axiosInstance from '@/utils/axios';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/controller';
import styles from '@/styles/Upgrades.module.scss'
import {Controller, Navigation} from "swiper/modules";

const bg = '/backgrounds/accountBG.png'
const money = '/money.png'

export default function Page() {
    const router = useRouter();
    const swiperRef = useRef(null);
    const [balance, setBalance] = useState(0);
    const [activeTab, setActiveTab] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [limitLevels, setLimitLevels] = useState([]);
    const [rateLevels, setRateLevels] = useState([]);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false); // Модальное окно для апгрейда
    const [selectedItem, setSelectedItem] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const Tasks = {
        daily: [
            // {
            //     name: 'daily login',
            //     desc: 'daily login',
            //     complite: 'false',
            //     action: 'modal'
            // },
            {
                name: 'PLay 5 games',
                desc: '4/5',
                complite: 'false',
                action: 'navigate',
                path: '/pvp'
            },
        ],
        main: [
            {
                name: 'subscribe to GW telegram',
                desc: '',
                complite: 'false',
                action: 'link',
                url: 'https://t.me/gang_wars_game'
            },
            {
                name: 'subscribe to Gw x',
                desc: '',
                complite: 'true',
                action: 'link',
                url: 'https://x.com/gangwars_game'
            },
            {
                name: 'invite 5 friends',
                desc: '3/5',
                complite: 'false',
                action: 'navigate',
                path: '/friends'
            },
            {
                name: 'win 10 pvp games',
                desc: '7/10',
                complite: 'false',
                action: 'navigate',
                path: '/pvp'
            },
        ]
    };

    const sliderImages = [
        '/upgradesCards/slider/rateSlide.png',
        '/upgradesCards/slider/limitSlide.png',
    ]

    const rateImages = [
        '/upgradesCards/rate/rate1.png',
        '/upgradesCards/rate/rate2.png',
        '/upgradesCards/rate/rate3.png',
        '/upgradesCards/rate/rate4.png',
        '/upgradesCards/rate/rate5.png'
    ]

    const limitImages = [
        '/upgradesCards/limit/limit1.png',
        '/upgradesCards/limit/limit2.png',
        '/upgradesCards/limit/limit3.png',
        '/upgradesCards/limit/limit4.png',
        '/upgradesCards/limit/limit5.png'
    ]

    const upgradesList = [
        'speed upgrades',
        'limits upgrades'
    ]

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

    // Открытие модального окна для апгрейда
    const openUpgradeModal = (item) => {
        setSelectedItem(item);
        setIsUpgradeModalOpen(true);
    };

    // Закрытие модального окна для апгрейда
    const closeUpgradeModal = () => {
        setIsUpgradeModalOpen(false);
        setSelectedItem(null);
    };

    // Функция для обработки клика по карточке улучшения лимита
    const handleLimitUpgrade = async (levelId, cost) => {
        try {
            const response = await axiosInstance.get(`/farm/limit-level-up?levelId=${levelId}`);
            console.log('Улучшение лимита:', response.data);
            setLimitLevels(prevLevels => prevLevels.map(item =>
                item.Id === levelId ? response.data : item
            ));
            // Вычитаем стоимость из баланса
            const updatedBalance = balance - cost;
            setBalance(updatedBalance);

            // Обновляем баланс в localStorage
            const start = JSON.parse(localStorage.getItem("start"));
            start.balance = updatedBalance;
            localStorage.setItem("start", JSON.stringify(start));
            closeUpgradeModal();
            fetchLevels();
        } catch (error) {
            console.error('Ошибка при улучшении лимита:', error);
        }
    };

    // Функция для обработки клика по карточке улучшения прокачки
    const handleRateUpgrade = async (levelId, cost) => {
        try {
            const response = await axiosInstance.get(`/farm/rate-level-up?levelId=${levelId}`);
            console.log('Улучшение прокачки:', response.data);
            setRateLevels(prevLevels => prevLevels.map(item =>
                item.Id === levelId ? response.data : item
            ));
            const updatedBalance = balance - cost;
            setBalance(updatedBalance);
            const start = JSON.parse(localStorage.getItem("start"));
            start.balance = updatedBalance;
            localStorage.setItem("start", JSON.stringify(start));
            closeUpgradeModal();
            fetchLevels();
        } catch (error) {
            console.error('Ошибка при улучшении прокачки:', error);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };
    const navigateToPage = (path) => {
        router.push(path);
    };
    const openLink = (url) => {
        window.open(url, '_blank');
    };
    const handleTaskClick = (task) => {
        switch (task.action) {
            case 'modal':
                openModal();
                break;
            case 'navigate':
                navigateToPage(task.path);
                break;
            case 'link':
                openLink(task.url);
                break;
            default:
                console.log('No action for this task.');
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            const start = JSON.parse(localStorage.getItem("start"));
            if (start) {
                setBalance(start.balance);
            }
        }
    }, []);

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

    const handleTab = (tab) => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }
        setActiveTab(tab)
    }

    const handleSlideChange = (swiper) => {
        setActiveIndex(swiper.realIndex);
    };

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

    return (
        <>
            <Head>
                <link rel="preload" href="/backgrounds/accountBG.png" as="image" />
                <link rel="preload" href="/money.png" as="image" />
            </Head>
            <div className={styles.root}>
                <Image src={bg} alt={'bg'} width={450} height={1000} className={styles.bg} />
                <div className={styles.container}>
                    <div className={styles.balance}>{balance}{' '}<Image src={money} alt={''} width={21} height={21} /></div>
                    <div className={styles.block}>
                        <div className={styles.buttonSet}>
                            <div className={styles.folderBtnStats}
                                 style={{
                                     zIndex: activeTab === 1 ? 112 : 110,
                                     marginBottom:  activeTab === 1 ? '0px' : '-12px',
                                     borderRight:  activeTab === 1 ? '2px solid #3842a4' : 'none',
                                 }}
                                 onClick={() => {
                                     handleTab(1)
                                     setIsModalOpen(false)
                                 }}>Upgrades</div>
                            <div
                                className={styles.folderBtnSkins}
                                style={{
                                    zIndex: activeTab === 2 ? 113 : 110,
                                    marginBottom:  activeTab === 2 ? '-0px' : '2px',
                                }}
                                onClick={() => {
                                    handleTab(2)
                                    setIsModalOpen(false)
                                }}
                            >tasks</div>
                        </div>
                        {activeTab === 1 && <div className={styles.personalContainer}>
                            <div className={styles.warning}>
                                Upgrades are applied after collecting the current earnings.
                            </div>
                            <div className={styles.list}>
                                <div className={styles.containerSwiper}>
                                    <button className={styles.navLeft} onClick={handleSlidePrev}>
                                        <Image src={'/Arrow.png'} alt={''} width={15} height={15} />
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
                                                    width={100}
                                                    height={194}
                                                    src={image}
                                                    alt={''}
                                                    className={styles.icon}
                                                />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                    <button className={styles.navRight} onClick={handleSlideNext}>
                                        <Image src={'/Arrow.png'} alt={''} width={15} height={15} />
                                    </button>
                                </div>
                                <div className={styles.caption}>
                                    <span>{upgradesList[activeIndex]}</span>
                                </div>
                                {activeIndex === 0 && <>
                                    {rateLevels.length !== 0 ? <>{rateLevels.map((item, index) => (
                                        <ItemPlaceholder img={rateImages[index]} item={item} key={index} onClick={() => openUpgradeModal(item)} />
                                    ))}</> : <div className={styles.warning}>No available rate upgrades</div>}
                                </>}
                                {activeIndex === 1 && <>
                                    {limitLevels.length !== 0 ? <>{limitLevels.map((item, index) => (
                                        <ItemPlaceholder img={limitImages[index]} item={item} key={index} onClick={() => openUpgradeModal(item)} />
                                    ))}</> : <div className={styles.warning}>No available limit upgrades</div>}
                                </>}
                            </div>
                        </div>}
                        {activeTab === 2 && <div className={styles.skinContainer}>
                            <div className={styles.col}>
                                <div className={styles.label}>Daily</div>
                                {Tasks.daily.map((task, index) => {
                                    return(
                                        <TaskBtn title={task.name} desc={task.desc} complite={task.complite} key={index} onClick={() => handleTaskClick(task)} />
                                    )
                                })}
                                <div className={styles.label}>MAIn tasks</div>
                                {Tasks.main.map((task, index) => {
                                    return(
                                        <TaskBtn subtitle={task.name} desc={task.desc} complite={task.complite} key={index} onClick={() => handleTaskClick(task)} />
                                    )
                                })}
                            </div>
                        </div>}
                    </div>
                    {isUpgradeModalOpen && selectedItem && (
                        <div className={styles.modalOverlay}>
                            <div className={styles.modalUpgrades}>
                                <h2>
                                    {selectedItem.type === 'limit' ? `limit +${selectedItem.Name}` : `rate +${selectedItem.Name}`}
                                </h2>
                                <p>Cost: {selectedItem.Cost}</p>
                                <p>Increase per: {selectedItem.IncreasePer}</p>
                                <p>Card level: {selectedItem.Level}</p>
                                <div className={styles.modalButtons}>
                                    <button
                                        className={styles.btnUpgrade}
                                        onClick={() => {
                                            if (window.Telegram?.WebApp?.HapticFeedback) {
                                                window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
                                            }
                                            if (selectedItem) {
                                                selectedItem.type === 'limit'
                                                    ? handleLimitUpgrade(selectedItem.Id, selectedItem.Cost)
                                                    : handleRateUpgrade(selectedItem.Id, selectedItem.Cost);
                                            }
                                        }}
                                        disabled={selectedItem && balance < selectedItem.Cost} // Делаем кнопку неактивной, если баланс меньше стоимости
                                    >
                                        Upgrade
                                    </button>
                                    <button className={styles.btnClose} onClick={closeUpgradeModal}>Close</button>
                                </div>
                                {selectedItem && balance < selectedItem.Cost && (
                                    <p className={styles.errorMessage}>Not enough coins available.</p>
                                )}
                            </div>
                        </div>
                    )}
                    {isModalOpen && <div className={styles.modal}>
                        <div className={styles.label}>Daily rewards</div>
                    </div>}
                </div>
            </div>
        </>
    );
};
