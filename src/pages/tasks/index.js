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

    // const dailyRewards = [
    //     {
    //         "id": 11,
    //         "name": "День 1",
    //         "description": "День 1",
    //         "reward": 1000,
    //         "amount": 1,
    //         "type": 4,
    //         "createdAt": "2024-10-05T13:17:42.20166Z",
    //         "key": "",
    //         "meta": {}
    //     },
    //     {
    //         "id": 12,
    //         "name": "День 2",
    //         "description": "День 2",
    //         "reward": 2500,
    //         "amount": 2,
    //         "type": 4,
    //         "createdAt": "2024-10-05T13:17:42.20166Z",
    //         "key": "",
    //         "meta": {}
    //     },
    //     {
    //         "id": 13,
    //         "name": "День 3",
    //         "description": "День 3",
    //         "reward": 5000,
    //         "amount": 3,
    //         "type": 4,
    //         "createdAt": "2024-10-05T13:17:42.20166Z",
    //         "key": "",
    //         "meta": {}
    //     },
    //     {
    //         "id": 14,
    //         "name": "День 4",
    //         "description": "День 4",
    //         "reward": 10000,
    //         "amount": 4,
    //         "type": 4,
    //         "createdAt": "2024-10-05T13:17:42.20166Z",
    //         "key": "",
    //         "meta": {}
    //     },
    //     {
    //         "id": 15,
    //         "name": "День 5",
    //         "description": "День 5",
    //         "reward": 25000,
    //         "amount": 5,
    //         "type": 4,
    //         "createdAt": "2024-10-05T13:17:42.20166Z",
    //         "key": "",
    //         "meta": {}
    //     },
    //     {
    //         "id": 16,
    //         "name": "День 6",
    //         "description": "День 6",
    //         "reward": 50000,
    //         "amount": 6,
    //         "type": 4,
    //         "createdAt": "2024-10-05T13:17:42.20166Z",
    //         "key": "",
    //         "meta": {}
    //     },
    //     {
    //         "id": 17,
    //         "name": "День 7",
    //         "description": "День 7",
    //         "reward": 100000,
    //         "amount": 7,
    //         "type": 4,
    //         "createdAt": "2024-10-05T13:17:42.20166Z",
    //         "key": "",
    //         "meta": {}
    //     },
    //     {
    //         "id": 18,
    //         "name": "День 8",
    //         "description": "День 8",
    //         "reward": 250000,
    //         "amount": 8,
    //         "type": 4,
    //         "createdAt": "2024-10-05T13:17:42.20166Z",
    //         "key": "",
    //         "meta": {}
    //     },
    //     {
    //         "id": 19,
    //         "name": "День 9",
    //         "description": "День 9",
    //         "reward": 500000,
    //         "amount": 9,
    //         "type": 4,
    //         "createdAt": "2024-10-05T13:17:42.20166Z",
    //         "key": "",
    //         "meta": {}
    //     },
    //     {
    //         "id": 20,
    //         "name": "День 10",
    //         "description": "День 10",
    //         "reward": 1000000,
    //         "amount": 10,
    //         "type": 4,
    //         "createdAt": "2024-10-05T13:17:42.20166Z",
    //         "key": "",
    //         "meta": {}
    //     },
    //     {
    //         "id": 21,
    //         "name": "День 11",
    //         "description": "День 11",
    //         "reward": 2500000,
    //         "amount": 11,
    //         "type": 4,
    //         "createdAt": "2024-10-05T13:17:42.20166Z",
    //         "key": "",
    //         "meta": {}
    //     },
    //     {
    //         "id": 22,
    //         "name": "День 12",
    //         "description": "День 12",
    //         "reward": 5000000,
    //         "amount": 12,
    //         "type": 4,
    //         "createdAt": "2024-10-05T13:17:42.20166Z",
    //         "key": "",
    //         "meta": {}
    //     },
    //     {
    //         "id": 23,
    //         "name": "День 13",
    //         "description": "День 13",
    //         "reward": 10000000,
    //         "amount": 13,
    //         "type": 4,
    //         "createdAt": "2024-10-05T13:17:42.20166Z",
    //         "key": "",
    //         "meta": {}
    //     },
    //     {
    //         "id": 24,
    //         "name": "День 14",
    //         "description": "День 14",
    //         "reward": 25000000,
    //         "amount": 14,
    //         "type": 4,
    //         "createdAt": "2024-10-05T13:17:42.20166Z",
    //         "key": "",
    //         "meta": {}
    //     }
    // ]

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
                    icon = task.name.includes("TG") ? "tg" : task.name.includes("X") ? "x" : '';
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
                }
                break;
            default:
                return name;
        }
    }

    const navigateToPage = (path) => {
        router.push(path);
    };

    const handleTaskClick = (task) => {
        if (typeof window === "undefined") {
            console.warn("localStorage is not available on the server.");
            return;
        }

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
                        executeTask(task.id);
                        window.open(url, '_blank');
                    } else if (task.id === 9 || task.name && (task.name.toLowerCase().includes("x") || task.name.toLowerCase().includes("twitter"))) {
                        url = "https://x.com/gangwars_game";
                    } else {
                        console.error('URL could not be determined. Task name:', task.name);
                    }
                    if (url && task.id !== 8) {
                        const existingTimestamp = localStorage.getItem(`task_${task.id}`);
                        if (!existingTimestamp) {
                            window.open(url, '_blank');
                            const timestamp = Date.now();
                            localStorage.setItem(`task_${task.id}`, timestamp);
                        } else {
                            console.log(`Task ${task.id} already clicked at ${new Date(parseInt(existingTimestamp, 10)).toLocaleString()}`);
                        }
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

    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <div className={styles.balanceContainer}>
                    <div className={styles.title}>{t('main.tasks')}</div>
                    <div className={styles.balance}>{formatNumber(balance, 9)}{' '}<Image src={money} alt={''} width={21} height={21} loading="lazy" /></div>
                </div>
                <div className={styles.block}>
                    <div className={styles.skinContainer}>
                        <div className={styles.col}>
                            <div className={styles.label}>{t('EXP.main')}</div>
                            {tasks.map((task, index) => {
                                return(
                                    <>
                                        {(task.type !== 4 && task.type !== 5 && task.type !== 6) && <TaskBtn
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
                                    return(
                                        <>
                                            {day.type === 4 && <div className={
                                                day.completed
                                                    ? styles.dailyItem
                                                    : styles.dailyItemHidden
                                            } key={index}>
                                                <div className={styles.dayTitle}>{t('EXP.day')}{' '}{day.amount}</div>
                                                <Image className={styles.dailyImage} src={dailyBils} alt={''} width={37} height={35}/>
                                                <div className={styles.dailySum}>{formatSum(day.reward)}</div>
                                            </div>}
                                        </>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};