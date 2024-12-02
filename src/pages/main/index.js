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

export default function Home() {
    const router = useRouter();
    const { t } = useTranslation();
    const { groupId, liga, rate, limit, updateContext, coins } = useInit();
    const [balance, setBalance] = useState(0)
    const [currentFarmCoins, setCurrentFarmCoins] = useState(0);
    const [startFarmTime, setStartFarmTime] = useState(Date.now());
    const [isClaimClicked, setIsClaimClicked] = useState(false);
    const [gameBonus, setGameBonus] = useState(false)
    const [clanId, setClanId] = useState(null)
    const [clanPopUp, setClanPopUp] = useState(false)

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

    useEffect(() => {
        const lastClan = localStorage.getItem('dailyClan');
        const today = new Date().toISOString().split('T')[0];
        if (lastClan !== today) {
            axios.get('/group/last')
                .then(response => {
                    const { groupId } = response.data;
                    setClanId(groupId);
                    setClanPopUp(true);
                    localStorage.setItem('lastFetchDate', today);
                })
                .catch(error => {
                    console.error('Ошибка при выполнении запроса:', error);
                });
        }
    }, []);

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

    function formatNumberFromEndDot(num) {
        if (typeof num !== 'number') {
            return '0';
        }
        if (num < 100) {
            return num.toFixed(2).toString().replace(/(\d)(?=(\d{3})+$)/g, "$1 ");
        } else {
            return Math.floor(num).toString().replace(/(\d)(?=(\d{3})+$)/g, "$1 ");
        }
    }

    const maxWidth = 224;
    const currentWidth = (currentFarmCoins / limit) * maxWidth;

    const closePopUp = () => {
        setClanPopUp(false)
    }

    return (
        <>
            <div className={styles.root}>
                <Image className={styles.background} src={background} width={300} height={1000}  alt={'bg'} loading="lazy"/>
                <div className={styles.item1}>
                    <IconButton image={account} alt={'account'} title={t('main.account')}  onClick={() => {router.push('/account')}}/>
                </div>
                <div className={styles.item2}>
                    <IconButton image={teamData[groupId]?.logo} alt={'gang'} onClick={() => {router.push('/change')}}/>
                </div>
                <div className={styles.item3}>
                    <IconButton image={settings} alt={'settings'} title={t('main.settings')} onClick={() => {router.push('/settings');}}/>
                </div>
                <div className={styles.item4}>
                    <IconButton image={boards} alt={'boards'} title={t('main.boards')} onClick={() => {router.push('/boards');}}/>
                </div>
                <div className={styles.item5}>
                    <Image src={border} width={600} height={200} alt={'border'} className={styles.totalBarRoot} loading="lazy"/>
                    <div className={styles.totalText}>{formatNumber(balance, 12)}</div>
                </div>
                <div className={styles.item6}>
                    <IconButton image={wallet} alt={'wallet'} title={t('main.wallet')} hidden={true} onClick={() => {router.push('/main')}}/>
                </div>
                <div className={styles.item7}>
                    <Image width={1000} height={1000} className={styles.char} alt={'character'} src={skinData[groupId]?.[liga]?.icon} loading="lazy"/>
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
                    <NavBar/>
                </div>
            </div>
            {clanPopUp && <div className={styles.clanPopUp}>
                <div className={styles.popUpClose} onClick={closePopUp}>x</div>
                <div className={styles.clanBorder}>
                    <div className={styles.clanContainer}>
                        <div className={styles.clanLabel}>Daily Pvp<br/> results  </div>
                        <div className={styles.clanName}>{teamData[clanId]?.Name}</div>
                        <Image src={teamData[clanId]?.logo} alt={''} width={120} height={120} />
                        <div className={styles.clanLabel}>Are <a>oG</a>s TODAY</div>
                        <div className={styles.clanName}>+50000 <Image src={money} alt="" width={15} height={15} /></div>
                    </div>
                </div>
            </div>}
        </>

    );
}
