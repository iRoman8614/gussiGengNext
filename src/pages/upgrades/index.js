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
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [tasks, setTasks] = useState([]);

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

    const mapTaskName = (originalName) => {
        if (originalName.includes("TG")) {
            return 'subscribe to GW telegram';
        } else if (originalName.includes("twitter")) {
            return 'subscribe to Gw x';
        }
        return originalName;
    };

    useEffect(() => {
        const fetchTasksAndFriends = async () => {
            try {
                const statsResponse = await axiosInstance.get('/profile/stats');
                const stats = statsResponse.data;
                const friendsResponse = await axiosInstance.get('/profile/my-invitees');
                const numFriends = friendsResponse.data.length;
                const tasksResponse = await axiosInstance.get('/task/all');
                let tasks = tasksResponse.data;
                const completedTasksResponse = await axiosInstance.get('/task/completed-tasks');
                const completedTasks = completedTasksResponse.data.map(task => task.task.id);
                tasks = tasks.map(task => {
                    const isCompleted = completedTasks.includes(task.id);
                    if (task.type === 1) {
                        return {
                            ...task,
                            current: numFriends,
                            completed: isCompleted || numFriends >= task.amount,
                            path: '/friends'
                        };
                    } else if (task.type === 2) {
                        return {
                            ...task,
                            name: mapTaskName(task.name),
                            url: task.name.includes("TG") ? "https://t.me/gang_wars_game" : "https://x.com/gangwars_game",
                            completed: isCompleted
                        };
                    } else if (task.type === 5) {
                        return {
                            ...task,
                            current: stats.victory,
                            completed: isCompleted || stats.victory >= task.amount,
                            path: '/pvp'
                        };
                    }
                    return {
                        ...task,
                        completed: isCompleted
                    };
                });
                setTasks(tasks);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        };
        fetchTasksAndFriends();
    }, []);



    useEffect(() => {
        fetchLevels();
    }, []);

    const openUpgradeModal = (item) => {
        setSelectedItem(item);
        setIsUpgradeModalOpen(true);
    };

    const closeUpgradeModal = () => {
        setIsUpgradeModalOpen(false);
        setSelectedItem(null);
    };

    const handleLimitUpgrade = async (levelId, cost) => {
        try {
            const response = await axiosInstance.get(`/farm/limit-level-up?levelId=${levelId}`);
            console.log('Улучшение лимита:', response.data);
            setLimitLevels(prevLevels => prevLevels.map(item =>
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
            console.error('Ошибка при улучшении лимита:', error);
        }
    };

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
        switch (task.type) {
            case 1:
                navigateToPage(task.path);
                break;
            case 2:
                openLink(task.url);
                break;
            case 5:
                navigateToPage(task.path);
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
                router.push('/main');
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
                                 }}>upgrades</div>
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
                                    {rateLevels.length !== 0 ? <div className={styles.itemsList}>{rateLevels.map((item, index) => (
                                        <ItemPlaceholder img={rateImages[index]} item={item} key={index} onClick={() => openUpgradeModal(item)} />
                                    ))}</div> : <div className={styles.warning}>No available rate upgrades</div>}
                                </>}
                                {activeIndex === 1 && <>
                                    {limitLevels.length !== 0 ? <div className={styles.itemsList}>{limitLevels.map((item, index) => (
                                        <ItemPlaceholder img={limitImages[index]} item={item} key={index} onClick={() => openUpgradeModal(item)} />
                                    ))}</div> : <div className={styles.warning}>No available limit upgrades</div>}
                                </>}
                            </div>
                        </div>}
                        {activeTab === 2 && <div className={styles.skinContainer}>
                            <div className={styles.col}>
                                {/*<div className={styles.label}>Daily</div>*/}
                                {/*{Tasks.daily.map((task, index) => {*/}
                                {/*    return(*/}
                                {/*        <TaskBtn title={task.name} desc={task.desc} complite={task.complite} key={index} onClick={() => handleTaskClick(task)} />*/}
                                {/*    )*/}
                                {/*})}*/}
                                <div className={styles.label}>main tasks</div>
                                {tasks.map((task, index) => {
                                    return(
                                        <TaskBtn
                                            subtitle={task.name}
                                            desc={task.type !== 2 ? `${task.current} / ${task.amount}` : ''}
                                            completed={task.completed}
                                            key={index}
                                            onClick={() => handleTaskClick(task)}
                                        />
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
