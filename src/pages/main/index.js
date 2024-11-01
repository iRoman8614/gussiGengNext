import {useEffect, useState} from "react";
import Image from "next/image";
import {useRouter} from "next/router";
import {IconButton} from "@/components/buttons/icon-btn/IconButton";
import {NavBar} from "@/components/nav-bar/NavBar";
import {CollectBar} from "@/components/bars/CollectBar";
import axiosInstance from '@/utils/axios';
import { useInit } from '@/context/InitContext';

import teamData from "@/mock/teamsData.js";
import skinData from '@/mock/skinsData'

import styles from "@/styles/Home.module.scss";

const account = "/main-buttons/account.png";
const settings = "/main-buttons/settings.png";
const boards = "/main-buttons/boards.png";
const wallet = "/main-buttons/wallet.png";
const claim = '/claimBTN.png'
const border = '/totalbar.png'
const claimClicked = '/claimBTNclicked.png'
const background = '/backgrounds/nightcity.png'

export default function Home() {
    const router = useRouter();
    const { groupId, liga, rate, limit, setRate, setLimit } = useInit();
    const [totalCoins, setTotalCoins] = useState(0);
    const [balance, setBalance] = useState(0)
    const [currentFarmCoins, setCurrentFarmCoins] = useState(0);
    const [startFarmTime, setStartFarmTime] = useState(Date.now());
    const [isClaimClicked, setIsClaimClicked] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const start = JSON.parse(localStorage.getItem("start"));
            if (start) {
                setTotalCoins(start.totalCoins);
                console.log('start.limit:', start.limit);
                setBalance(start.coins)
                setStartFarmTime(new Date(start.startTime).getTime());
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const interval = setInterval(() => {
                const now = Date.now();
                const secondsPassed = Math.floor((now - startFarmTime) / 1000);
                const accumulatedCoins = Math.min(rate * secondsPassed, limit);

                setCurrentFarmCoins(accumulatedCoins);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [rate, startFarmTime, limit]);

    const handleClaimClick = async () => {
        if (typeof window !== "undefined") {
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred("heavy");
            }
            try {
                await axiosInstance.get(`/farm/collect`)
                    .then(response => {
                        processCollectResponse(response.data);
                    })
                setIsClaimClicked(true);
                setTimeout(() => {
                    setIsClaimClicked(false);
                }, 500);
            } catch (error) {
                console.error("Ошибка при сборе монет:", error);
            }
        }
    };

    const processCollectResponse = (collectData) => {
        const updatedTotalCoins = Math.max(collectData.totalCoins, 0);
        setTotalCoins(updatedTotalCoins);
        setCurrentFarmCoins(0);
        setStartFarmTime(new Date(collectData.startTime).getTime());

        axiosInstance.get(`/farm/start`)
            .then(startResponse => {
                const startData = startResponse.data;
                console.log("Ответ от /farm/start:", startData);
                const updatedStartTotalCoins = Math.max(startData.totalCoins, 0);
                const updatedRate = Math.max(startData.rate, 0);
                const updatedLimit = Math.max(startData.limit, 0);
                const updatedBalance = Math.max(startData.coins, 0);
                setTotalCoins(updatedStartTotalCoins);
                setRate(updatedRate)
                setLimit(updatedLimit);
                setBalance(updatedBalance);
                setStartFarmTime(new Date(startData.startTime).getTime());

                localStorage.setItem("start", JSON.stringify({
                    totalCoins: updatedStartTotalCoins,
                    startTime: new Date(startData.startTime).toISOString(),
                    rate: updatedRate,
                    limit: updatedLimit,
                    balance: updatedBalance,
                }));
            })
            .catch(error => {
                console.error("Ошибка при запросе /farm/start:", error);
            });
    };

    function formatNumberFromEnd(num) {
        if (isNaN(num) || typeof num !== 'number') {
            return '10800';
        }
        return Math.round(num).toString().replace(/(\d)(?=(\d{3})+$)/g, "$1 ");
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

    return (
        <div className={styles.root}>
                <Image className={styles.background} src={background} width={300} height={1000}  alt={'bg'}/>
                <div className={styles.item1}>
                    <IconButton image={account} alt={'account'} title={'account'}  onClick={() => {router.push('/account')}}/>
                </div>
                <div className={styles.item2}>
                    <IconButton image={teamData[groupId]?.logo} alt={'gang'} onClick={() => {router.push('/change')}}/>
                </div>
                <div className={styles.item3}>
                    <IconButton image={settings} alt={'settings'} title={'settings'} onClick={() => {router.push('/settings');}}/>
                </div>
                <div className={styles.item4}>
                    <IconButton image={boards} alt={'boards'} title={'board'} onClick={() => {router.push('/boards');}}/>
                </div>
                <div className={styles.item5}>
                    <Image src={border} width={600} height={200} alt={'border'} className={styles.totalBarRoot}/>
                    <div className={styles.totalText}>{formatNumberFromEnd(balance)}</div>
                </div>
                <div className={styles.item6}>
                    <IconButton image={wallet} alt={'wallet'} title={'wallet'} hidden={true} onClick={() => {router.push('/getRandom')}}/>
                </div>
                <div className={styles.item7}>
                    <Image width={1000} height={1000} className={styles.char} alt={'character'} src={skinData[groupId]?.[liga]?.icon}/>
                </div>
                <div className={styles.item8}>
                    <CollectBar
                        currentCoins={formatNumberFromEndDot(currentFarmCoins < 0 ? 0 : currentFarmCoins)}
                        maxCoins={formatNumberFromEnd(Number(limit))}
                        width={currentWidth}
                    />
                </div>
                <div className={styles.item9}>
                    <Image className={styles.claimRoot} width={600} height={200} src={isClaimClicked ? claimClicked : claim} onClick={handleClaimClick} alt={'claim'} />
                </div>
                <div className={styles.item10}>
                    <NavBar/>
                </div>
            </div>
    );
}