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

const money = '/money.png'

export default function Page() {
    const router = useRouter();
    const { t } = useTranslation();
    const { coins } = useInit();
    const [balance, setBalance] = useState(0);
    const [tasks, setTasks] = useState([]);
    const { collectAndStart } = useFarmCollect();


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

    useEffect(() => {
        setBalance(coins)
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

    const navigateToPage = (path) => {
        router.push(path);
    };

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
                        const timestamp = Date.now();
                        localStorage.setItem(`task_${task.id}`, timestamp);
                        window.open(url, '_blank');
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
        const interval = setInterval(() => {
            const oneHourInMs = 60 * 60 * 1000;
            const now = Date.now();
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('task_')) {
                    const taskId = key.replace('task_', '');
                    const timestamp = parseInt(localStorage.getItem(key), 10);
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

    function formatNumberFromEnd(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1 ");
    }

    return (
        <div className={styles.root}>
            <div className={styles.container}>
                <div className={styles.balanceContainer}>
                    <div className={styles.title}>{t('main.tasks')}</div>
                    <div className={styles.balance}>{formatNumberFromEnd(balance)}{' '}<Image src={money} alt={''} width={21} height={21} loading="lazy" /></div>
                </div>
                <div className={styles.block}>
                    <div className={styles.skinContainer}>
                        <div className={styles.col}>
                            <div className={styles.label}>{t('EXP.main')}</div>
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
                    </div>
                </div>
            </div>
        </div>
    );
};