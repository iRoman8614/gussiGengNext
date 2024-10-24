import React, {useEffect, useState} from "react";
import Head from "next/head";
import Image from "next/image";
import axiosInstance from '@/utils/axios';

import skinData from '@/mock/skinsData'
import teamData from "@/mock/teamsData";
import {useRouter} from "next/router";

import styles from '@/styles/Account.module.scss'

const bg = '/backgrounds/accountBG.png'
const money = '/money.png'

export default function Page() {
    const router = useRouter();
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

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const init = JSON.parse(localStorage.getItem('init'));
            if (init && init.group) {
                setTeamId(init.group.id);
            }
            const start = JSON.parse(localStorage.getItem('start'));
            if (start) {
                setTotalCoins(start.totalCoins);
                setBalance(start.balance)
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const search = window.Telegram.WebApp.initData;
            const urlParams = new URLSearchParams(search);
            const userParam = urlParams.get('user');

            if (userParam) {
                const decodedUserParam = decodeURIComponent(userParam);
                const userObject = JSON.parse(decodedUserParam);
                setUserId(userObject.id);
                setUserName(userObject.username);
            } else {
                setUserId(111);
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
                fetchStats(userObject.id);
            } else {
                setUserId(111);
                fetchStats(111);
            }
        }
    }, []);

    const fetchStats = async (userId) => {
        try {
            const response = await axiosInstance.get(`/profile/stats?profileId=${userId}`);
            if (response.status === 400 || response.status === 401 || response.status === 403) {
                console.log("Требуется обновление токена, выполняем запрос /profile/init");
                await axiosInstance.get(`/profile/init?profileId=${userId}`)
                    .then(initResponse => {
                        const data = initResponse.data;
                        const token = data.jwt.replace(/"/g, '');
                        localStorage.setItem('GWToken', token);
                        console.log("JWT token saved:", token);
                    })
                    .catch(error => {
                        console.error('Ошибка при запросе /profile/init:', error);
                        throw error;
                    });
                const retryResponse = await axiosInstance.get(`/profile/stats?profileId=${userId}`);
                const retryData = retryResponse.data;
                setStats(retryData);
            } else {
                const data = response.data;
                setStats(data);
            }
        } catch (error) {
            console.error('Ошибка при получении статистики:', error);
        }
    };

    function formatNumberFromEnd(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1 ");
    }

    const handleTab = (tab) => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }
        setActiveTab(tab)
    }

    return(
        <>
            <Head>
                <link rel="preload" href="/backgrounds/accountBG.png" as="image" />
                <link rel="preload" href="/money.png" as="image" />
            </Head>
            <div className={styles.root}>
                <Image src={bg} alt={'bg'} width={450} height={1000} className={styles.bg} />
                <div className={styles.container}>
                    <div className={styles.seasonBlock}>
                        <div className={styles.season}>
                            season 1 <br/><br />
                            {userName}
                        </div>
                        <div className={styles.avatarContainer}>
                            <Image className={styles.logo} src={teamData[teamId].logo} alt={''} width={40} height={40} />
                            <Image className={styles.character} src={skinData[teamId][level].icon} alt={''} width={100} height={178} />
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
                                 onClick={() => handleTab(1)}
                            >stats</div>
                            {/*<div*/}
                            {/*    className={styles.folderBtnSkins}*/}
                            {/*    style={{*/}
                            {/*        zIndex: activeTab === 2 ? 113 : 110,*/}
                            {/*        marginBottom:  activeTab === 2 ? '-0px' : '2px',*/}
                            {/*    }}*/}
                            {/*    onClick={() => handleTab(2)}*/}
                            {/*>skins</div>*/}
                        </div>
                        {activeTab === 1 &&<div className={styles.personalContainer}>
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
                                <div className={styles.barItem}>total coins earned</div>
                                <div className={styles.barItemStats}>{formatNumberFromEnd(totalCoins)}</div>
                                <div className={styles.barItem}>total skins owned</div>
                                <div className={styles.barItemStats}>1/11</div>
                                <div className={styles.barItem}>friends invited</div>
                                <div className={styles.barItemStats}>15</div>
                            </div>
                            <div>
                                <div className={styles.barItem}>current balance</div>
                                <div className={styles.balance}>{balance}{' '}<Image src={money} alt={''} width={21} height={21} /></div>
                            </div>
                        </div>}
                        {/*{activeTab === 2 && <div className={styles.skinContainer}>*/}
                        {/*    <div className={styles.list}>*/}
                        {/*        <ItemPlaceholder />*/}
                        {/*    </div>*/}
                        {/*</div>}*/}
                    </div>
                </div>
            </div>
        </>
    )
}
