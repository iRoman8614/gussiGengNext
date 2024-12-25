import {useEffect, useState} from "react";
import Image from "next/image";
import {useRouter} from "next/router";
import {useTranslation} from "react-i18next";
import {IconButton} from "@/components/buttons/icon-btn/IconButton";
import {NavBar} from "@/components/nav-bar/NavBar";
import {CollectBar} from "@/components/bars/CollectBar";
import {useInit} from '@/context/InitContext';
import {useFarmCollect} from "@/utils/api";

import teamData from "@/mock/teamsData.js";
import skinData from '@/mock/skinsData'

import styles from "@/styles/Home.module.scss";
import {formatNumber} from "@/utils/formatNumber";
import axios from "@/utils/axios";
import {toast} from "react-toastify";

const account = '/main-buttons/account.png'
const settings = '/main-buttons/settings.png'
const boards = '/main-buttons/boards.png'
const wallet = '/main-buttons/wallet.png'
const claim = '/lootBTN.png'
const claimClicked = '/lootBTNclicked.png'
const border = '/totalbar.png'
const background = '/backgrounds/nightcity.png'
const bonus = '/main-buttons/bonus.png'
const money = '/money.png'
const dailyBils = '/dailyBills.png'
const walletPH = '/walletPH.png'
const itemsPH ='/itemsPH.png'

export default function Home() {
    const router = useRouter();
    const { t } = useTranslation();
    const { groupId, liga, rate, limit, updateContext, coins, dailyEntries } = useInit();
    const [balance, setBalance] = useState(0)
    const [currentFarmCoins, setCurrentFarmCoins] = useState(0);
    const [startFarmTime, setStartFarmTime] = useState(Date.now());
    const [isClaimClicked, setIsClaimClicked] = useState(false);
    const [gameBonus, setGameBonus] = useState(false)
    const [dailyPopUp, setDailyPopUp] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [completedTaskIds, setCompletedTaskIds] = useState([]);
    const [skinSource, setSkinSource] = useState('');
    const [itemPlaceholder, setItemPlaceholder] = useState(false)
    const [walletPlaceholder, setWalletPlaceholder] = useState(false)

    const { collectAndStart } = useFarmCollect();

    useEffect(() => {
        updateContext();
        if (typeof window !== "undefined") {
            const start = JSON.parse(localStorage.getItem("farm"));
            if (start) {
                setBalance(start.coins)
            } else {
                setBalance(coins)
            }
            const startTime = localStorage.getItem("startTime")
            if(startTime) {
                setStartFarmTime(new Date(startTime).getTime());
            }
            const gameBonus = sessionStorage.getItem('gameBonus')
            console.log('gameBonus', gameBonus)
            if(gameBonus !== undefined && gameBonus > 0) {
                setGameBonus(true)
            }
        }
    }, [balance, startFarmTime, isClaimClicked, coins]);

    // useEffect(() => {
    //     const skinFromSession = sessionStorage.getItem('skin');
    //     const skin = skinFromSession ? JSON.parse(skinFromSession) : null;
    //     if (skin && skin.key) {
    //         setSkinSource(skinData[skin.key] || skinData[groupId]?.[liga]?.icon);
    //     } else {
    //         setSkinSource(skinData[groupId]?.[liga]?.icon);
    //     }
    // }, [groupId, liga]);

    useEffect(() => {
        const skinFromSession = sessionStorage.getItem('skin');
        const skin = skinFromSession ? JSON.parse(skinFromSession) : null;
        function getSkinIcon(skinKey, groupId) {
            const skin = skinData[skinKey];
            if (Array.isArray(skin)) {
                const iconEntry = skin.find(entry => entry[groupId]);
                return iconEntry ? iconEntry[groupId] : null;
            } else {
                return skin;
            }
        }
        if (skin && skin.key) {
            const icon = getSkinIcon(skin.key, groupId);
            if (icon) {
                setSkinSource(icon);
            } else {
                const defaultIcon = skinData[groupId][liga].icon;
                setSkinSource(defaultIcon);
            }
        } else {
            const defaultIcon = skinData[groupId][liga].icon;
            setSkinSource(defaultIcon);
        }
    }, [groupId, liga]);


    useEffect(() => {
        if (typeof window !== "undefined") {
            const interval = setInterval(() => {
                const secondsPassed = Math.floor((Date.now() - startFarmTime) / 1000);
                const accumulatedCoins = Math.min(rate * secondsPassed, limit);
                setCurrentFarmCoins(accumulatedCoins);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [rate, startFarmTime, limit]);

    const handleClaimClick = async () => {
        try {
            if (typeof window !== "undefined" && window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred("heavy");
            }
            const collectData = await collectAndStart();
            const updatedBalance = collectData.totalCoins;
            setBalance(updatedBalance);
            setCurrentFarmCoins(0)
            const farm = JSON.parse(localStorage.getItem('farm')) || {}
            const updatedFarmData = {
                ...farm,
                coins: updatedBalance,
                farmRate: collectData.rate,
                farmLimit: limit,
            };
            localStorage.setItem('farm', JSON.stringify(updatedFarmData));
            triggerClaimAnimation()
            updateContext();
        } catch (error) {
            console.error("Ошибка при сборе монет:", error);
        }
    };

    let claimTimeout;
    const triggerClaimAnimation = () => {
        setIsClaimClicked(true);
        claimTimeout = setTimeout(() => {
            setIsClaimClicked(false);
        }, 500);
    };

    useEffect(() => {
        return () => {
            if (claimTimeout) {
                clearTimeout(claimTimeout);
            }
        };
    }, [])

    function formatNumberFromEnd(num) {
        if (isNaN(num) || typeof num !== 'number') {
            return '10800';
        }
        return Math.floor(num).toString().replace(/(\d)(?=(\d{3})+$)/g, "$1 ");
    }

    const maxWidth = 224;
    const currentWidth = (currentFarmCoins / limit) * maxWidth;


    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        const dailyTaskDate = localStorage.getItem("dailyTaskDate");

        if (!dailyTaskDate || dailyTaskDate !== today) {
            localStorage.setItem("dailyTaskDate", today);
            loadAndExecuteTasks();
        }
    }, [dailyEntries]);

    const loadAndExecuteTasks = async () => {
        try {
            console.log("Загрузка всех задач типа 4...");
            const allTasksResponse = await axios.get("/task/all-type?type=4");
            const allTasks = allTasksResponse.data;
            const sortedTasks = allTasks.sort((a, b) => a.amount - b.amount);
            setTasks(sortedTasks);
            console.log("Загрузка завершённых задач...");
            const completedTasksResponse = await axios.get("/task/completed-tasks");
            let completedTaskIds = completedTasksResponse.data
                .filter((item) => item.task.type === 4)
                .map((item) => item.task.id);
            console.log("Проверка и выполнение недостающих задач...");
            const isSpecialDay = (dailyEntries - 1) % 14 === 0;
            const todaysAmount = (dailyEntries - 1) % 14 + 1;
            const tasksToExecute = sortedTasks.filter((task) => {
                const isTaskOneOnSpecialDay = isSpecialDay && task.amount === 1;
                return (task.amount <= todaysAmount && !completedTaskIds.includes(task.id)) || isTaskOneOnSpecialDay;
            });
            for (const task of tasksToExecute) {
                await executeTask(task);
            }
            console.log("Обновление списка завершённых задач...");
            const updatedCompletedTasksResponse = await axios.get("/task/completed-tasks");
            const updatedCompletedTaskIds = updatedCompletedTasksResponse.data
                .filter((item) => item.task.type === 4)
                .map((item) => item.task.id);
            setCompletedTaskIds(updatedCompletedTaskIds);
            console.log("Все недостающие задания выполнены.");
            setDailyPopUp(true);
        } catch (error) {
            console.error("Ошибка при загрузке или выполнении задач:", error);
        }
    };

    const checkAndActivateSkin = async () => {
        if (dailyEntries >= 10) {
            try {
                const mySkinsResponse = await axios.get('/skin/my');
                const mySkins = mySkinsResponse.data;
                const hasThugLifeSkin = mySkins.some(skin => skin.key === 'thug_life');
                if (!hasThugLifeSkin) {
                    const allSkinsResponse = await axios.get('/skin/all');
                    const allSkins = allSkinsResponse.data;
                    const thugLifeSkin = allSkins.find(skin => skin.key === 'thug_life');
                    if (thugLifeSkin) {
                        await axios.post(`/skin/update?skinId=${thugLifeSkin.id}`);
                        console.log('Скин "Thug Life" активирован');
                    }
                    const authToken = localStorage.getItem('authToken');
                    try {
                        const response = await axios.get(`https://supavpn.lol/profile/init?token=${authToken}`);
                        const { skin } = response.data;
                        if (skin && skin.id !== 1) {
                            console.log('скин сохранен в ss')
                            sessionStorage.setItem('skin', JSON.stringify(skin));
                        }
                        if (skin && skin.key) {
                            setSkinSource(skinData[skin.key] || skinData[groupId]?.[liga]?.icon);
                        }
                    } catch (error) {
                        toast.error("Failed to authenticate.");
                        console.error("Error refreshing JWT token:", error);
                    }
                }
            } catch (error) {
                console.error('Ошибка при работе с API скинов:', error);
            }
        }
    };

    useEffect(() => {
        checkAndActivateSkin();
    }, [dailyEntries]);

    const executeTask = async (task) => {
        try {
            console.log(`Выполнение задания с ID ${task.id}...`);
            const response = await axios.post(`/task/execute?taskId=${task.id}`);
            console.log(`Задание с ID ${task.id} выполнено успешно:`, response.data);
        } catch (error) {
            console.error(`Ошибка выполнения задания с ID ${task.id}:`, error);
        }
    };

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

    return (
        <>
            <div className={styles.root}>
                <Image className={styles.background} src={background} width={300} height={1000}  alt={'bg'} loading="lazy"/>
                <div className={styles.item1}>
                    <IconButton image={account} alt={'account'} title={t('main.account')}  onClick={() => {router.push('/account')}} direction={'left'} />
                </div>
                <div className={styles.item2}>
                    <div onClick={() => {router.push('/change')}} className={styles.gangs}>
                        <Image className={styles.gangIcon} src={teamData[groupId]?.logo} alt={''} width={40} height={40} />
                        <div>{teamData[groupId]?.Name}</div>
                    </div>
                </div>
                <div className={styles.item3}>
                    <IconButton image={settings} alt={'settings'} title={t('main.settings')} onClick={() => {router.push('/settings');}} direction={'right'} />
                </div>
                <div className={styles.item4}>
                    <IconButton image={boards} alt={'boards'} title={t('main.boards')} onClick={() => {router.push('/boards');}} direction={'left'} />
                </div>
                <div className={styles.item5}>
                    <Image src={border} width={600} height={200} alt={'border'} className={styles.totalBarRoot} loading="lazy"/>
                    <div className={styles.totalText}>{formatNumber(balance, 9)}{' '}<Image src={money} alt={''} width={21} height={21} /></div>
                </div>
                <div className={styles.item6}>
                    <IconButton image={wallet} alt={'wallet'} title={t('main.wallet')} hidden={true} direction={'right'} onClick={() => setWalletPlaceholder(true)} />
                </div>
                {/*<div className={styles.item7}>*/}
                {/*    <Image width={1000} height={1000} className={styles.char} alt={'character'} src={skinData[groupId]?.[liga]?.icon} loading="lazy"/>*/}
                {/*</div>*/}
                <div className={styles.item7}>
                    <Image width={1000} height={1000} className={styles.char} alt={'character'} src={skinSource} loading="lazy"/>
                </div>
                {gameBonus && <div className={styles.bonusItem}>
                    <Image src={bonus} alt={''} width={60} height={60}/>
                </div>}
                <div className={styles.item8}>
                    <CollectBar
                        currentCoins={formatNumberFromEnd(currentFarmCoins < 0 ? 0 : currentFarmCoins)}
                        maxCoins={formatNumber(Number(limit), 6)}
                        width={currentWidth}
                    />
                </div>
                <div className={styles.item9} id={"loot"} onClick={handleClaimClick}>
                    <Image id={"loot"} className={styles.claimRoot} width={600} height={200} src={isClaimClicked ? claimClicked : claim} alt={'claim'} loading="lazy" />
                    <p id={"loot"} className={isClaimClicked ? styles.btnClicked : styles.btn}>{t('main.loot')}</p>
                </div>
                <div className={styles.item10}>
                    <NavBar clickItem={() => setItemPlaceholder(true)} />
                </div>
            </div>
            {dailyPopUp && (
                <div className={styles.dailyBG}>
                    <div className={styles.dailyPopup}>
                        <div className={styles.dailyLabel}>{t('main.daily')}</div>
                        <div className={styles.todaysReward}>
                            {tasks
                                .filter((task) => task.type === 4 && completedTaskIds.includes(task.id))
                                .pop()?.reward || 0}<Image src={money} alt="" width={25} height={25} />
                        </div>
                        <div className={styles.dailyContainer}>
                            {tasks.map((day, index) => {
                                return(
                                    <>
                                        {day.type === 4 && <div className={
                                            completedTaskIds.includes(day.id)
                                                ? styles.dailyItem
                                                : styles.dailyItemGray
                                        } key={index}>
                                            <div className={styles.dayTitle}>{t('EXP.day')}{' '}{day.amount}</div>
                                            <Image className={styles.dailyImage} src={dailyBils} alt={''} width={37} height={35}/>
                                            <div className={styles.dailySum}>{formatSum(day.reward)} {day.meta.skin && <><br/>{formatSkinName(day.meta.skin)}</>}</div>
                                        </div>}
                                    </>
                                )
                            })}
                        </div>
                        <button className={styles.dilybtn} onClick={() => setDailyPopUp(false)}>{t('random.continue')}</button>
                    </div>
                </div>
            )}
            {walletPlaceholder && <div className={styles.placeholder}>
                <div className={styles.closePH} onClick={() => setWalletPlaceholder(false)}>x</div>
                <div className={styles.placeholderTitle}><a>{t('main.wallet')}</a>{t('main.way')}</div>
                <div className={styles.imageBorder}>
                    <Image className={styles.phImage} src={walletPH} alt={''} width={450} height={420} />
                </div>
                <div className={styles.placeholderDesk}>{t('main.riches')}</div>
            </div>}
            {itemPlaceholder &&
                <div className={styles.placeholder}>
                    <div className={styles.closePH} onClick={() => setItemPlaceholder(false)}>x</div>
                    <div className={styles.placeholderTitle1}>{t('main.more')}<a>{t('main.drip')}</a><br/>{t('main.foryour')}<a>{t('main.grip')}</a></div>
                    <div className={styles.imageBorder}>
                        <Image className={styles.phImage} src={itemsPH} alt={''} width={450} height={420} />
                    </div>
                    <div className={styles.placeholderDesk1}>{t('main.watches')}</div>
                    <div className={styles.placeholderTitle1}><a>{t('main.tuned')}</a></div>
                </div>
            }
        </>
    );
}
