import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Image from "next/image";
import axiosInstance from '@/utils/axios';
import { useInit } from '@/context/InitContext';

import skinData from '@/mock/skinsData'
import teamData from "@/mock/teamsData";

import styles from '@/styles/Account.module.scss'

const money = '/money.png'

export default function Page() {
    const router = useRouter();
    const { groupId, liga } = useInit();
    const [activeTab, setActiveTab] = useState(1);
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(null);
    const [friends, setFriends] = useState([]);
    const [daily, setDaily] = useState(0)
    const [stats, setStats] = useState({
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
            const start = JSON.parse(localStorage.getItem('start'));
            if (start) {
                setTotalCoins(start.totalBalance);
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
            }
        }

    }, []);


    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        initData(authToken)
        fetchStats()
        fetchFriends();
    }, [userId]);

    const initData = async (authToken) => {
        try {
            const response = await axiosInstance.get(`/profile/init?token=${authToken}`);
            const data = response.data;
            setDaily(data.delayEntries)
        } catch (error) {
            console.error(error);
        }
    }

    const fetchFriends = async () => {
        try {
            const response = await axiosInstance.get('/profile/my-invitees');
            setFriends(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке списка друзей:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axiosInstance.get(`/profile/stats`);
            const data = response.data;
            setStats(data);
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
        <div className={styles.root}>
                <div className={styles.container}>
                    <div className={styles.seasonBlock}>
                        <div className={styles.season}>
                            season 1 <br/><br />
                            {userName}
                        </div>
                        <div className={styles.avatarContainer}>
                            <Image className={styles.logo} src={teamData[groupId]?.logo} alt={''} width={40} height={40} />
                            <Image className={styles.character} src={skinData[groupId]?.[liga]?.icon} alt={''} width={100} height={178} />
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
                                <div className={styles.nickname}>league {stats?.liga}</div>
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
                                {/*<div className={styles.barItem}>total skins owned</div>*/}
                                {/*<div className={styles.barItemStats}>1/11</div>*/}
                                <div className={styles.barItem}>friends invited</div>
                                <div className={styles.barItemStats}>{friends.length}</div>
                                <div className={styles.barItem}>login streak</div>
                                <div className={styles.barItemStats}>{daily}</div>
                            </div>
                            <div>
                                <div className={styles.barItem}>current balance</div>
                                <div className={styles.balance}>{formatNumberFromEnd(balance)}{' '}<Image src={money} alt={''} width={21} height={21} /></div>
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
    )
}
