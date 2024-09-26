import {useEffect, useState} from "react";
import Image from "next/image";
import {useRouter} from "next/router";
import {IconButton} from "@/components/buttons/icon-btn/IconButton";
import {NavBar} from "@/components/nav-bar/NavBar";
import {CollectBar} from "@/components/bars/CollectBar";

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
    const [totalCoins, setTotalCoins] = useState(0);
    const [currentFarmCoins, setCurrentFarmCoins] = useState(0);
    const [rate, setRate] = useState(1);
    const [limit, setLimit] = useState(3600)
    const [startFarmTime, setStartFarmTime] = useState(Date.now());
    const [teamId, setTeamId] = useState(1)
    const [isClaimClicked, setIsClaimClicked] = useState(false);
    const [userId, setUserId] = useState(null);
    const [level, setLevel] = useState(1)

    useEffect(() => {
        if (typeof window !== "undefined") {
            // Получаем init из localStorage
            const init = JSON.parse(localStorage.getItem("init"));
            if (init && init.group) {
                setTeamId(init.group.id); // Устанавливаем команду
            }

            // Получаем start из localStorage
            const start = JSON.parse(localStorage.getItem("start"));
            if (start) {
                setTotalCoins(start.totalCoins);
                setRate(start.rate);
                setLimit(start.limit);
                setStartFarmTime(new Date(start.startTime).getTime()); // Преобразуем startTime в миллисекунды
            }

            // Чтение Telegram userId
            if (window.Telegram?.WebApp) {
                const search = window.Telegram.WebApp.initData;
                const urlParams = new URLSearchParams(search);
                const userParam = urlParams.get("user");
                if (userParam) {
                    const decodedUserParam = decodeURIComponent(userParam);
                    const userObject = JSON.parse(decodedUserParam);
                    console.log("User ID from Telegram:", userObject.id);
                    setUserId(userObject.id);
                } else {
                    setUserId(111)
                }
            }
        }
    }, []);

    // Логика накопления монет
    useEffect(() => {
        if (typeof window !== "undefined") {
            const now = Date.now();
            const secondsPassed = Math.floor((now - startFarmTime) / 1000);
            const accumulatedCoins = Math.min(rate * secondsPassed, limit);
            setCurrentFarmCoins(accumulatedCoins);
        }
    }, [rate, startFarmTime, limit]);

    // Накопление монет в реальном времени (каждую секунду) (с проверкой на наличие window)
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

// Обработчик для кнопки "Claim"
    const handleClaimClick = async () => {
        if (typeof window !== "undefined") {
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred("heavy");
            }
            try {
                // Запрос к /farm/collect
                const collectResponse = await fetch(
                    `https://supavpn.lol/farm/collect?profileId=${userId}`
                );
                const collectData = await collectResponse.json();
                console.log("Ответ от /farm/collect:", collectData);

                // Обновляем состояния на основе ответа, проверяя на отрицательное значение
                const updatedTotalCoins = Math.max(collectData.totalCoins, 0); // Если totalCoins меньше 0, ставим 0
                setTotalCoins(updatedTotalCoins);
                setCurrentFarmCoins(0); // Обнуляем накопленные монеты
                setStartFarmTime(new Date(collectData.startTime).getTime()); // Обновляем время старта

                // Затем делаем запрос на /farm/start
                const startResponse = await fetch(
                    `https://supavpn.lol/farm/start?profileId=${userId}`
                );
                const startData = await startResponse.json();
                console.log("Ответ от /farm/start:", startData);

                // Обновляем состояния, также проверяя на отрицательные значения
                const updatedStartTotalCoins = Math.max(startData.totalCoins, 0); // Проверяем totalCoins
                const updatedRate = Math.max(startData.rate, 0); // Проверяем rate, если он может быть отрицательным
                const updatedLimit = Math.max(startData.limit, 0); // Проверяем limit, если он может быть отрицательным

                setTotalCoins(updatedStartTotalCoins);
                setRate(updatedRate);
                setLimit(updatedLimit);
                setStartFarmTime(new Date(startData.startTime).getTime());

                // Сохраняем в localStorage данные
                localStorage.setItem(
                    "start",
                    JSON.stringify({
                        totalCoins: updatedStartTotalCoins,
                        startTime: new Date(startData.startTime).toISOString(),
                        rate: updatedRate,
                        limit: updatedLimit,
                    })
                );
            } catch (error) {
                console.error("Ошибка при сборе монет:", error);
            }

            setIsClaimClicked(true);
            setTimeout(() => {
                setIsClaimClicked(false);
            }, 500);
        }
    };

    function getRandomNumber() {
        return Math.floor(Math.random() * 6) + 1;
    }
    useEffect(() => {
        const level = getRandomNumber()
        setLevel(level)
    }, [])

    // Форматирование числа для вывода
    function formatNumberFromEnd(num) {
        if (typeof num !== 'number') {
            return '0';  // Если num не является числом, возвращаем строку '0'
        }
        return num.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1 ");
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
                <IconButton image={teamData[teamId].logo} alt={'gang'} onClick={() => {router.push('/getRandom')}}/>
            </div>
            <div className={styles.item3}>
                <IconButton image={settings} alt={'settings'} title={'settings'} onClick={() => {router.push('/settings');}}/>
            </div>
            <div className={styles.item4}>
                <IconButton image={boards} alt={'boards'} title={'board'} onClick={() => {router.push('/boards');}}/>
            </div>
            <div className={styles.item5}>
                <Image src={border} width={600} height={200} alt={'border'} className={styles.totalBarRoot}/>
                <div className={styles.totalText}>{formatNumberFromEnd(totalCoins)}</div>
            </div>
            <div className={styles.item6}>
                <IconButton image={wallet} alt={'wallet'} title={'wallet'}/>
            </div>
            <div className={styles.item7}>
                <Image width={1000} height={1000} className={styles.char} alt={'character'} src={skinData[teamId][level]}/>
            </div>
            <div className={styles.item8}>
                <CollectBar
                    currentCoins={formatNumberFromEnd(currentFarmCoins < 0 ? 0 : currentFarmCoins)}
                    maxCoins={formatNumberFromEnd(limit)}
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