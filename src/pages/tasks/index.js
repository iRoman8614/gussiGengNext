import {useEffect, useRef, useState} from 'react';
import Image from "next/image";
import {useRouter} from "next/router";
import {TaskBtn} from "@/components/taskBtn/TaskBtn";
import axiosInstance from '@/utils/axios';
import {useTranslation} from "react-i18next";
import {useInit} from "@/context/InitContext";
import {useFarmCollect} from "@/utils/api";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/controller';
import styles from '@/styles/Upgrades.module.scss'
import {formatNumber} from "@/utils/formatNumber";

const money = '/money.png'
const dailyBils = '/dailyBills.png'

export default function Page() {
    const router = useRouter();
    const { t } = useTranslation();
    const { coins } = useInit();
    const [balance, setBalance] = useState(0);
    const [tasks, setTasks] = useState([]);
    const { collectAndStart } = useFarmCollect();
    const [dailyRewards, setDailyRewards] = useState([])
    const [activeTab, setActiveTab] = useState(1);

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
            //
            // const typeTwoTasks = tasks.filter(task => task.type === 2);
            // const subscriptionTasks = typeTwoTasks.filter(task =>
            //     task.key === "subscription_tg_channel" || task.key === "subscription_x_channel");
            // setLinkTasks(subscriptionTasks)
            // const otherTypeTwoTasks = typeTwoTasks.filter(task =>
            //     task.key !== "subscription_tg_channel" && task.key !== "subscription_x_channel");
            // setPartnersTasks(otherTypeTwoTasks)


            tasks = tasks.sort((a, b) => {
                if (a.type === 2 && b.type === 2) {
                    return a.id - b.id;
                }
                return 0;
            });

            const dailyTasks = tasks
                .filter(task => task.type === 4)
                .map(task => ({
                    ...task,
                    completed: completedTasks.includes(task.id),
                }))
                .sort((a, b) => a.amount - b.amount);
            setDailyRewards(dailyTasks);
            const lastCompletedTaskIdType1 = Math.max(0, ...tasks.filter(task => task.type === 1 && completedTasks.includes(task.id)).map(task => task.id));
            const type3Tasks = tasks
                .filter(task => task.type === 3)
                .sort((a, b) => a.id - b.id);
            const lastCompletedTaskIndexType3 = type3Tasks.findIndex(task => task.id === Math.max(...completedTasks.filter(id => type3Tasks.some(task => task.id === id))));
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
                    if (task.name.includes("TG")) {
                        icon = "tg";
                    } else if (task.name.includes("X")) {
                        icon = "x";
                    } else if (task.name.includes("Kat")) {
                        icon = "kat";
                    } else if (task.name.includes("Gridbybot")) {
                        icon = "Gridbybot";
                    } else if (task.name.includes("Mushroom")) {
                        icon = 'MushWarr'
                    }
                }
                const isVisible = (task.type === 1 && task.id <= lastCompletedTaskIdType1 + 1) ||
                    (task.type === 3 && (isCompleted || type3Tasks[lastCompletedTaskIndexType3 + 1]?.id === task.id)) ||
                    (task.type !== 1 && task.type !== 3);

                return {
                    ...task,
                    name: mapTaskName(task.name, task.type, task.amount),
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

    useEffect(() => {
        setBalance(coins)
        fetchTasksAndFriends();
    }, []);

    const mapTaskName = (name, type, amount) => {
        switch (type) {
            case 1:
                const referralKey = amount === 1 ? '1referral' : amount === 3 ? '3referral' : '5referral';
                return `${amount}${t(`EXP.${referralKey}`)}`;
            case 3:
                return `${t(`EXP.win`)}${amount}${t(`EXP.pvp`)}`;
            case 2:
                if (name.includes('TG')) {
                    return t(`EXP.tg`);
                } else if (name.includes('X')) {
                    return t(`EXP.x`);
                } else if (name.includes('Kat')) {
                    return t(`EXP.Kat`);
                } else if (name.includes('Gridbybot')) {
                    return t('EXP.Gridbybot')
                } else if (name.includes('Mushroom')) {
                    return t('EXP.Mushroom')
                }
                break;
            default:
                return name;
        }
    }

    const navigateToPage = (path) => {
        router.push(path);
    };

    // const handleTaskClick = (task) => {
    //     if (typeof window === "undefined") {
    //         console.warn("localStorage is not available on the server.");
    //         return;
    //     }
    //
    //     if (task.readyToComplete) {
    //         executeTask(task.id);
    //         task.readyToComplete = false
    //     } else {
    //         switch (task.type) {
    //             case 1:
    //                 navigateToPage(task.path);
    //                 break;
    //             case 2:
    //                 let url = '';
    //                 if (task.id === 8) {
    //                     url = "https://t.me/gang_wars_game";
    //                     executeTask(task.id);
    //                     window.open(url, '_blank');
    //                 } else if (task.id === 9 || task.name && (task.name.toLowerCase().includes("x") || task.name.toLowerCase().includes("twitter"))) {
    //                     url = "https://x.com/gangwars_game";
    //                 } else if (task.id === 39) {
    //                     url = "https://t.me/katknight_bot/app?startapp=nqPn_0GUEV";
    //                 } else {
    //                     console.error('URL could not be determined. Task name:', task.name);
    //                 }
    //                 if (url && task.id !== 8) {
    //                     const existingTimestamp = localStorage.getItem(`task_${task.id}`);
    //                     if (!existingTimestamp) {
    //                         window.open(url, '_blank');
    //                         const timestamp = Date.now();
    //                         localStorage.setItem(`task_${task.id}`, timestamp);
    //                     } else {
    //                         console.log(`Task ${task.id} already clicked at ${new Date(parseInt(existingTimestamp, 10)).toLocaleString()}`);
    //                     }
    //                 }
    //                 break;
    //             case 3:
    //                 navigateToPage(task.path);
    //                 break;
    //             default:
    //                 console.log('No action for this task.');
    //         }
    //     }
    // };

    const handleTaskClick = (task) => {
        if (typeof window === "undefined") {
            console.warn("localStorage is not available on the server.");
            return;
        }

        if (task.readyToComplete) {
            executeTask(task.id);
            task.readyToComplete = false;
        } else {
            switch (task.type) {
                case 1:
                    navigateToPage(task.path);
                    break;
                case 2:
                    const url = task.meta && task.meta.url ? task.meta.url : '';
                    if (url) {
                        window.open(url, '_blank');
                        if (task.id !== 8) {
                            const existingTimestamp = localStorage.getItem(`task_${task.id}`);
                            if (!existingTimestamp) {
                                const timestamp = Date.now();
                                localStorage.setItem(`task_${task.id}`, timestamp);
                            } else {
                                console.log(`Task ${task.id} already clicked at ${new Date(parseInt(existingTimestamp, 10)).toLocaleString()}`);
                            }
                        }
                    } else {
                        console.error('URL could not be determined. Task name:', task.name);
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
        if (typeof window === "undefined") {
            console.warn("localStorage is not available on the server.");
            return;
        }

        const interval = setInterval(() => {
            const oneHourInMs = 60 * 60 * 1000;
            const now = Date.now();
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('task_')) {
                    const taskId = key.replace('task_', '');
                    const timestamp = parseInt(localStorage.getItem(key), 10);
                    const task = tasks.find(task => task.id === parseInt(taskId));
                    if (task?.type === 2 && task?.id === 8) {
                        continue;
                    }
                    if (now - timestamp > oneHourInMs) {
                        executeTask(taskId);
                        localStorage.removeItem(key);
                    }
                }
            }
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const executeTask = async (taskId) => {
        try {
            await axiosInstance.get(`/task/execute?taskId=${taskId}`);
            fetchCompletedTasks();
            const collectData = await collectAndStart();
            const updatedBalance = collectData.totalCoins;
            setBalance(updatedBalance);
            fetchTasksAndFriends()
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

    function formatSum(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace('.0', '') + 'к';
        }
        return num.toString();
    }

    function formatSkinName(key) {
        return key
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    const handleTab = (tab) => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
        setActiveTab(tab)
    }

    const allowedKeys = ['app_kat_knight', "app_play_mushroom_warrior"];

    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <div className={styles.balanceContainer}>
                    <div className={styles.title}>{t('main.tasks')}</div>
                    <div className={styles.balance}>{formatNumber(balance, 9)}{' '}<Image src={money} alt={''} width={21} height={21} loading="lazy" /></div>
                </div>
                <div className={styles.buttonSet}>
                    <div className={styles.folderBtnStats}
                         style={{
                             zIndex: activeTab === 1 ? 112 : 110,
                             marginBottom:  activeTab === 1 ? '0px' : '-12px',
                             borderRight:  activeTab === 1 ? '2px solid #3842a4' : 'none',
                         }}
                         onClick={() => handleTab(1)}
                    >{t('account.main')}</div>
                    <div
                        className={styles.folderBtnSkins}
                        style={{
                            zIndex: activeTab === 2 ? 113 : 110,
                            marginBottom:  activeTab === 2 ? '-0px' : '2px',
                        }}
                        onClick={() => handleTab(2)}
                    >{t('account.partner')}</div>
                </div>
                {activeTab ===1 &&
                    <div className={styles.personalContainer}>
                        <div className={styles.col}>
                            <div className={styles.label}>{t('EXP.main')}</div>
                            {tasks.map((task, index) => {
                                return (
                                    <>
                                        {(task.type !== 4 && task.type !== 5 && task.type !== 6 && task.type !== 2) && <TaskBtn
                                            id={task.id}
                                            subtitle={task.name}
                                            desc={task.type !== 2 ? `${task.current} / ${task.amount}` : ''}
                                            completed={task.completed}
                                            key={index}
                                            icon={task.icon}
                                            type={task.type}
                                            readyToComplete={task.readyToComplete}
                                            reward={formatNumber(task.reward, 9)}
                                            onClick={() => handleTaskClick(task)}
                                        />}
                                    </>
                                )
                            })}
                            {tasks
                                .filter(task =>
                                task.key === "subscription_tg_channel" || task.key === "subscription_x_channel")
                                .map((task, index) => {
                                return (
                                    <>
                                        {(task.type === 2) && <TaskBtn
                                            id={task.id}
                                            subtitle={task.name}
                                            desc={task.type !== 2 ? `${task.current} / ${task.amount}` : ''}
                                            completed={task.completed}
                                            key={index}
                                            icon={task.icon}
                                            type={task.type}
                                            readyToComplete={task.readyToComplete}
                                            reward={formatNumber(task.reward, 9)}
                                            onClick={() => handleTaskClick(task)}
                                        />}
                                    </>
                                )
                            })}
                            <div className={styles.label}>{t('EXP.daily')}</div>
                            <div className={styles.dailyContainer}>
                                {dailyRewards.map((day, index) => {
                                    return (
                                        <>
                                            {day.type === 4 && <div className={
                                                day.completed
                                                    ? styles.dailyItem
                                                    : styles.dailyItemHidden
                                            } key={index}>
                                                <div className={styles.dayTitle}>{t('EXP.day')}{' '}{day.amount}</div>
                                                <Image className={styles.dailyImage} src={dailyBils} alt={''} width={37}
                                                       height={35}/>
                                                <div
                                                    className={styles.dailySum}>{formatSum(day.reward)} {day.meta.skin && <>
                                                    <br/>
                                                    {t('EXP.skin')}
                                                    {/*{formatSkinName(day.meta.skin)}*/}
                                                </>}</div>
                                            </div>}
                                        </>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                }
                {activeTab === 2 && <div className={styles.skinContainer}>
                    <div className={styles.col}>
                        {tasks
                            .filter(task =>
                                allowedKeys.includes(task.key))
                                // task.key !== "subscription_tg_channel" && task.key !== "subscription_x_channel")
                            .map((task, index) => {
                            return (
                                <>
                                    {(task.type === 2) && <TaskBtn
                                        id={task.id}
                                        subtitle={task.name}
                                        desc={task.type !== 2 ? `${task.current} / ${task.amount}` : ''}
                                        completed={task.completed}
                                        key={index}
                                        icon={task.icon}
                                        type={task.type}
                                        readyToComplete={task.readyToComplete}
                                        reward={formatNumber(task.reward, 9)}
                                        onClick={() => handleTaskClick(task)}
                                    />}
                                </>
                            )
                        })}
                    </div>
                </div>}
            </div>
        </div>
    );
};