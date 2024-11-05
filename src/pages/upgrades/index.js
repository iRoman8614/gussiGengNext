import React, {useEffect, useRef, useState} from 'react';
import Image from "next/image";
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
import {toast} from "react-toastify";
import {useInit} from "@/context/InitContext";
import {useFarmCollect} from "@/utils/api";

const money = '/money.png'

export default function Page() {
    const router = useRouter();
    const { coins, updateContext, limit, rate } = useInit();
    const { tab } = router.query;
    const [activeTab, setActiveTab] = useState(tab || '1');
    const { collectAndStart } = useFarmCollect();

    const swiperRef = useRef(null);
    const [balance, setBalance] = useState(0);
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
                const lastCompletedTaskIdType1 = Math.max(0, ...tasks.filter(task => task.type === 1 && completedTasks.includes(task.id)).map(task => task.id));
                tasks = tasks.map(task => {
                    const isCompleted = completedTasks.includes(task.id);
                    let readyToComplete = false;
                    let icon = '';
                    if (task.type === 1 && numFriends >= task.amount && !isCompleted) {
                        readyToComplete = true;
                    }
                    if (task.type === 3 && stats.victory >= task.amount && !isCompleted) {
                        readyToComplete = true;
                    }
                    if (task.type === 2) {
                        icon = task.name.includes("TG") ? "tg" : task.name.includes("X") ? "x" : '';
                    }
                    const isVisible = task.type === 1 ? task.id <= lastCompletedTaskIdType1 + 1 : true;
                    return {
                        ...task,
                        name: mapTaskName(task.name),
                        current: task.type === 1 ? numFriends : stats.victory,
                        completed: isCompleted,
                        path: task.type === 1 ? '/friends' : '/lobby',
                        visible: isVisible,
                        readyToComplete: readyToComplete,
                        icon: icon,
                    };
                });

                setTasks(tasks.filter(task => task.visible));
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        };
        fetchTasksAndFriends();
    }, []);

    const mapTaskName = (originalName) => {
        if (originalName.includes("TG")) {
            return 'sub to GW telegram';
        } else if (originalName.includes("twitter")) {
            return 'sub to Gw x';
        }
        return originalName;
    };

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
            const collectData = await collectAndStart();
            const updatedBalance = collectData.totalCoins;
            setBalance(updatedBalance);
            const farm = JSON.parse(localStorage.getItem('farm')) || {}
            const updatedFarmData = {
                ...farm,
                coins: updatedBalance,
                farmRate: collectData.rate,
                farmLimit: limit,
            };
            localStorage.setItem('farm', JSON.stringify(updatedFarmData));
            closeUpgradeModal();
            fetchLevels();
            updateContext()
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
            const collectData = await collectAndStart();
            const updatedBalance = collectData.totalCoins;
            setBalance(updatedBalance);
            const farm = JSON.parse(localStorage.getItem('farm')) || {}
            const updatedFarmData = {
                ...farm,
                coins: updatedBalance,
                farmRate: collectData.rate,
                farmLimit: limit,
            };
            localStorage.setItem('farm', JSON.stringify(updatedFarmData));
            closeUpgradeModal();
            fetchLevels();
            updateContext()
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

    const timerRef = useRef(null);
    const handleTaskClick = (task) => {
        if (task.readyToComplete) {
            executeTask(task.id);
            task.readyToComplete = false
        } else {
            switch (task.type) {
                case 1:
                    navigateToPage(task.path);
                    break;
                case 2:
                    let url = '';
                    if (task.id === 8) {
                        url = "https://t.me/gang_wars_game";
                    } else if (task.id === 9 || task.name && (task.name.toLowerCase().includes("x") || task.name.toLowerCase().includes("twitter"))) {
                        url = "https://x.com/gangwars_game";
                    } else {
                        console.error('URL could not be determined. Task name:', task.name);
                    }
                    if (url) {
                        window.open(url, '_blank');
                        timerRef.current = setTimeout(() => executeTask(task.id), 500);
                    }
                    break;
                case 3:
                    navigateToPage(task.path);
                    break;
                default:
                    console.log('No action for this task.');
            }
        }
    };
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);
    const executeTask = async (taskId) => {
        try {
            await axiosInstance.get(`/task/execute?taskId=${taskId}`);
            fetchCompletedTasks();
        } catch (error) {
            console.error(`Error executing task ${taskId}:`, error);
        }
    }

    const fetchCompletedTasks = async () => {
        try {
            const response = await axiosInstance.get('/task/completed-tasks');
            const completedTaskIds = response.data.map(task => task.task.id);
            setTasks(tasks.map(task => ({
                ...task,
                completed: completedTaskIds.includes(task.id)
            })));
        } catch (error) {
            console.error('Error fetching completed tasks:', error);
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

    const handleTab = (newTab) => {
        setActiveTab(newTab);
        router.push({
            pathname: router.pathname,
            query: { ...router.query, tab: newTab },
        });
    };

    useEffect(() => {
        if (tab) {
            setActiveTab(tab);
        }
    }, [tab]);

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

    function formatNumberFromEnd(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1 ");
    }

    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <div className={styles.balance}>{formatNumberFromEnd(coins)}{' '}<Image src={money} alt={''} width={21} height={21} /></div>
                <div className={styles.block}>
                    <div className={styles.buttonSet}>
                        <div className={styles.folderBtnStats}
                             style={{
                                 zIndex: activeTab === '1' ? 112 : 110,
                                 marginBottom:  activeTab === '1' ? '0px' : '-12px',
                                 borderRight:  activeTab === '1' ? '2px solid #3842a4' : 'none',
                             }}
                             onClick={() => {
                                 handleTab('1')
                                 setIsModalOpen(false)
                             }}>upgrades</div>
                        <div
                            className={styles.folderBtnSkins}
                            style={{
                                zIndex: activeTab === '2' ? 113 : 110,
                                marginBottom:  activeTab === '2' ? '-0px' : '2px',
                            }}
                            onClick={() => {
                                handleTab('2')
                                setIsModalOpen(false)
                            }}
                        >tasks</div>
                    </div>
                    {activeTab === '1' && <div className={styles.personalContainer}>
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
                                                width={120}
                                                height={194}
                                                src={image}
                                                alt={''}
                                                className={styles.icon}
                                            />
                                            <div className={styles.caption}>
                                                {upgradesList[activeIndex]}
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <button className={styles.navRight} onClick={handleSlideNext}>
                                    <Image src={'/Arrow.png'} alt={''} width={15} height={15} />
                                </button>
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
                    {activeTab === '2' && <div className={styles.skinContainer}>
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
                                    <>
                                        {task.type !== 4 && <TaskBtn
                                            subtitle={task.name}
                                            desc={task.type !== 2 ? `${task.current} / ${task.amount}` : ''}
                                            completed={task.completed}
                                            key={index}
                                            icon={task.icon}
                                            type={task.type}
                                            readyToComplete={task.readyToComplete}
                                            reward={formatNumberFromEnd(task.reward)}
                                            onClick={() => handleTaskClick(task)}
                                        />}
                                    </>
                                )
                            })}
                        </div>
                    </div>}
                </div>
                {isUpgradeModalOpen && selectedItem && (
                    <div className={styles.modalOverlay}>
                        {selectedItem && coins < selectedItem.Cost && (
                            toast.error('Not enough coins available.')
                        )}
                        <div className={styles.modalBorder}>
                            <div className={styles.modalUpgrades}>
                                <h3>
                                    {selectedItem.type === 'limit' ? `limit +${selectedItem.Name}%` : `rate +${selectedItem.Name}%`}
                                </h3>
                                <p>Card level: {selectedItem.Level}</p>
                                <p>Cost: {selectedItem.Cost}</p>
                                <p>
                                    <a>
                                        {selectedItem.type === 'limit' ?
                                            limit
                                            :
                                            rate
                                        }
                                    </a>
                                    {' '}
                                    <Image src={'/ArrowWhite.png'} alt={''} width={15} height={15} className={styles.navRight} />
                                    {' '}
                                    <a className={styles.green}>
                                        {
                                            (selectedItem.type === 'limit' ?
                                                (limit * (1 + (Number(selectedItem.Name)/100))).toFixed(3)
                                            :
                                                (rate * (1 + (Number(selectedItem.Name)/100)))).toFixed(3)
                                        }
                                    </a>
                                </p>
                            </div>
                        </div>
                        <button
                            className={styles.modalBorder}
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
                            disabled={selectedItem && coins < selectedItem.Cost}
                        >
                            <div className={styles.modalBtn}>Upgrade</div>
                        </button>
                        <div className={styles.modalBorder} onClick={closeUpgradeModal}>
                            <div className={styles.modalBtn}>Close</div>
                        </div>
                    </div>
                )}
                {isModalOpen && <div className={styles.modal}>
                    <div className={styles.label}>Daily rewards</div>
                </div>}
            </div>
        </div>
    );
};
