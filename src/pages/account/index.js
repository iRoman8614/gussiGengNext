import styles from '@/styles/Account.module.scss'
import Image from "next/image";
import React, {useEffect, useState} from "react";
import axiosInstance from '@/utils/axios';

import skinData from '@/mock/skinsData'
import teamData from "@/mock/teamsData";
import {useRouter} from "next/router";
import {ItemPlaceholder} from "@/components/itemPlaceholder/ItemPlaceholder";

const bg = '/backgrounds/accountBG.png'
export default function Page() {
    const [teamId, setTeamId] = useState(1)
    const [level, setLevel] = useState(1)
    const [activeTab, setActiveTab] = useState(1);
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(null);
    const [stats, setStats] = useState({
        liga: 0,
        count: 0,
        victory: 0,
        lost: 0,
    });
    const [totalCoins, setTotalCoins] = useState(0);
    const [balance, setBalance] = useState(0)

    const router = useRouter();

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


    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Получаем init из localStorage
            const init = JSON.parse(localStorage.getItem('init'));
            if (init && init.group) {
                setTeamId(init.group.id); // Устанавливаем команду
            }
            // Получаем start из localStorage
            const start = JSON.parse(localStorage.getItem('start'));
            if (start) {
                setTotalCoins(start.totalCoins);
                setBalance(start.balance)
            }
        }
    }, []);

    // Получаем userId из Telegram
    useEffect(() => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const search = window.Telegram.WebApp.initData;
            const urlParams = new URLSearchParams(search);
            const userParam = urlParams.get('user');

            if (userParam) {
                const decodedUserParam = decodeURIComponent(userParam);
                const userObject = JSON.parse(decodedUserParam);
                setUserId(userObject.id);  // Сохраняем userId
                setUserName(userObject.username);
            } else {
                setUserId(111);  // Если userId не найден, используем 111 по умолчанию
                setUserName('you');
            }
        }
    }, []);

    function getRandomNumber() {
        return Math.floor(Math.random() * 6) + 1;
    }
    useEffect(() => {
        const level = getRandomNumber()
        setLevel(level)
    }, [])

    // Получение profileId из Telegram WebApp
    useEffect(() => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const search = window.Telegram.WebApp.initData;
            const urlParams = new URLSearchParams(search);
            const userParam = urlParams.get('user');
            if (userParam) {
                const decodedUserParam = decodeURIComponent(userParam);
                const userObject = JSON.parse(decodedUserParam);
                setUserId(userObject.id);
                fetchStats(userObject.id); // Запрос на получение статистики
            } else {
                setUserId(111);
                fetchStats(111); // Запрос для ID по умолчанию
            }
        }
    }, []);

// Функция для запроса статистики
    const fetchStats = async () => {
        try {
            const response = await axiosInstance.get(`/profile/stats?profileId=${userId}`);

            // Проверяем, если статус ответа 400, 401 или 403
            if (response.status === 400 || response.status === 401 || response.status === 403) {
                console.log("Требуется обновление токена, выполняем запрос /profile/init");

                // Вызов /profile/init для обновления токена
                await axiosInstance.get(`/profile/init?profileId=${userId}`)
                    .then(initResponse => {
                        const data = initResponse.data;
                        console.log("Ответ от /profile/init:", data);

                        // Сохраняем новый JWT в localStorage
                        localStorage.setItem('GWToken', data.jwt);
                    })
                    .catch(error => {
                        console.error('Ошибка при запросе /profile/init:', error);
                        throw error;  // Если запрос /profile/init не удался, выходим
                    });

                // Повторяем запрос к /profile/stats после обновления токена
                const retryResponse = await axiosInstance.get(`/profile/stats?profileId=${userId}`);
                const retryData = retryResponse.data;
                setStats(retryData); // Сохраняем данные статистики в состояние
            } else {
                const data = response.data;
                setStats(data); // Сохраняем данные статистики в состояние
            }

        } catch (error) {
            console.error('Ошибка при получении статистики:', error);
        }
    };



    // Вычисляем процент для прогресс-бара
    const progressPercentage = ((totalCoins % 100000) / 100000) * 100;

    return(
        <div className={styles.root}>
            <Image src={bg} alt={'bg'} width={450} height={1000} className={styles.bg} />
            <div className={styles.container}>
                <div className={styles.seasonBlock}>
                    <div className={styles.season}>season 1</div>
                    <div className={styles.avatarContainer}>
                        <Image className={styles.logo} src={teamData[teamId].logo} alt={''} width={40} height={40} />
                        <Image className={styles.character} src={skinData[teamId][level]} alt={''} width={100} height={178} />
                    </div>
                </div>
                <div className={styles.block}>
                    <div className={styles.buttonSet}>
                        <div className={styles.folderBtnStats}
                             style={{
                                 zIndex: activeTab === 1 ? 112 : 110,
                                 marginBottom:  activeTab === 1 ? '0px' : '-12px',
                                 borderRight:  activeTab === 1 ? '2px solid #3842a4' : 'none',
                             }}
                             onClick={() => setActiveTab(1)}>STATS</div>
                        <div
                            className={styles.folderBtnSkins}
                            style={{
                                zIndex: activeTab === 2 ? 113 : 110,
                                marginBottom:  activeTab === 2 ? '-0px' : '2px',
                            }}
                             onClick={() => setActiveTab(2)}
                        >SkinS</div>
                    </div>
                    {activeTab === 1 &&<div className={styles.personalContainer}>
                        <div className={styles.nickname}>
                            {userName}
                        </div>
                        <div className={styles.stats}>
                            <div className={styles.nickname}>League {stats?.liga}</div>
                            <div className={styles.stat}>
                                total <p>{stats?.count}</p>
                            </div>
                            <div className={styles.stat}>
                                wins <p>{stats.victory}</p>
                            </div>
                            <div className={styles.stat}>
                                defeats <p>{stats.lost}</p>
                            </div>
                            <div className={styles.stat}>
                                winrate <p>{stats.count === 0 ? '0%' : `${((stats.victory / stats.count) * 100).toFixed(2)}%`}</p>
                            </div>
                        </div>
                        <div className={styles.barBlock}>
                            <div className={styles.ballanceLabel}>
                                earn a total of 100 k to get extra games
                            </div>
                            <div className={styles.bar}>
                                <div
                                    className={styles.progress}
                                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                                ></div>
                            </div>
                            <div className={styles.ballanceLabel}>{totalCoins}</div>
                        </div>
                        <div>
                            <div className={styles.ballanceLabel}>current balance</div>
                            <div className={styles.balance}>{balance}</div>
                        </div>
                    </div>}
                    {activeTab === 2 && <div className={styles.skinContainer}>
                        <div className={styles.list}>
                            <ItemPlaceholder />
                            <ItemPlaceholder />
                            <ItemPlaceholder />
                            <ItemPlaceholder />
                            <ItemPlaceholder />
                            <ItemPlaceholder />
                            <ItemPlaceholder />
                            <ItemPlaceholder />
                            <ItemPlaceholder />
                            <ItemPlaceholder />
                            <ItemPlaceholder />
                            <ItemPlaceholder />
                            <ItemPlaceholder />
                            <ItemPlaceholder />
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    )
}
