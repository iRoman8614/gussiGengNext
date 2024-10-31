import {useEffect, useState} from 'react';
import Image from "next/image";
import Link from "next/link";
import {useRouter} from "next/router";
import axiosInstance from "@/utils/axios";
import {toast} from "react-toastify";
import { useAssetsCache } from "@/context/AssetsCacheContext";

import styles from '@/styles/Lobby.module.scss'
import {IconButton} from "@/components/buttons/icon-btn/IconButton";

const bg = '/backgrounds/Lobby.png'
const hands = '/main-buttons/hand2.png';
const rich = '/main-buttons/rich.png';
const FAQ = '/main-buttons/FAQ.png'

const gameIconsAssets = [
    '/game-icons/animation_hand_pap.gif',
    '/game-icons/animation_hand_rock.gif',
    '/game-icons/animation_hand_sci.gif',
    '/game-icons/hand_pap.png',
    '/game-icons/hand_rock.png',
    '/game-icons/hand_sci.png',
    '/game-icons/heart.png',
    '/game-icons/lose.png',
    '/game-icons/paper.png',
    '/game-icons/rock.png',
    '/game-icons/scissors.png'
];

export default function Page() {
    const [hintOne, setHintOne] = useState(false)
    const [hintTwo, setHintTwo] = useState(false)
    const [remainingTime, setRemainingTime] = useState(null);
    const [timerActive, setTimerActive] = useState(false);
    const [sessionsCount, setSessionsCount] = useState(0)
    const [passes, setPasses] = useState(0)

    const router = useRouter();
    const { preloadAssets } = useAssetsCache();

    useEffect(() => {
        preloadAssets(gameIconsAssets);
    }, [preloadAssets]);

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

    const fetchStats = async () => {
        try {
            const response = await axiosInstance.get(`/profile/stats`);
            const data = response.data;
            setPasses(data.pass);
        } catch (error) {
            console.error('Ошибка при получении статистики:', error);
        }
    };

    const fetchLastGames = async () => {
        try {
            const response = await axiosInstance.get(`/farm/last-games`);
            const data = response.data;
            setSessionsCount(data.session.count);
            if (data.session.count >= 5) {
                const firstGame = localStorage.getItem('firstGame') || data.session.first;
                if (!localStorage.getItem('firstGame')) {
                    localStorage.setItem('firstGame', firstGame);
                }
                const firstGameTime = new Date(firstGame);
                const now = new Date();
                const timeDiffInMs = now - firstGameTime;
                const remainingTimeInMs = (6 * 60 * 60 * 1000) - timeDiffInMs;
                if (remainingTimeInMs > 0) {
                    setRemainingTime(remainingTimeInMs);
                    setTimerActive(true);
                } else {
                    localStorage.removeItem('firstGame');
                }
            }
        } catch (error) {
            console.error('Error fetching last games:', error);
        }
    };

    useEffect(() => {
        fetchLastGames();
        fetchStats();
    }, []);

    const handlePvpClick = async () => {
        if (typeof window === "undefined") return;
        try {
            const response = await axiosInstance.get(`/farm/last-games`);
            const data = response.data;
            setSessionsCount(data.session.count);
            if (data.session.count < 5) {
                router.push('/pvp');
            } else if(data.session.count >= 5 && passes > 0) {
                router.push('/pvp');
            } else {
                toast.warn("You have reached the maximum number of games. Please wait for the timer to expire.");
            }
        } catch (error) {
            console.error("Error during /last-games request:", error);
            toast.error('Game unavailable');
        }
    };

    useEffect(() => {
        let timerId;
        if (remainingTime > 0 && timerActive) {
            timerId = setInterval(() => {
                setRemainingTime((prevTime) => prevTime - 1000);
            }, 1000);
        }
        return () => clearInterval(timerId);
    }, [remainingTime, timerActive]);

    const formatTime = (ms) => {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);
        return `${hours}h ${minutes}m ${seconds}s`;
    };

    return (
        <div className={styles.root}>
                <Image className={styles.image} src={bg} alt={''} width={450} height={1000} />
                <div className={styles.container}>
                    <div>
                        <div className={styles.card}>
                            <div className={styles.icon} onClick={handlePvpClick}>
                                <div>battle</div>
                                <p className={styles.hiddenText}>free</p>
                                <Image className={styles.logo} src={hands} alt={''} width={150} height={75} />
                            </div>
                            <div className={styles.lable}>
                                {remainingTime > 0 &&
                                    <div className={styles.timer}>
                                        {formatTime(remainingTime)}
                                    </div>}
                                <div className={styles.title}>
                                    {sessionsCount < 5 ? (
                                        <>
                                            <div>{5 - sessionsCount}</div>
                                            <p>games left</p>
                                        </>
                                    ) : (
                                        <>
                                            <div>{passes}</div>
                                            <p>extra games</p>
                                        </>)
                                    }
                                </div>
                            </div>
                            <div className={styles.btn} onClick={() => {
                                if (window.Telegram?.WebApp?.HapticFeedback) {
                                    window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
                                }
                                // router.push('/faq/pvp')
                                setHintOne(!hintOne)
                            }}>?</div>
                        </div>
                        {hintOne && <div className={styles.hint}>
                            Battle against others, earn rewards, and climb the ranks.
                            <p>no luck, just skill!</p>
                        </div>}
                    </div>
                    <div>
                        <div className={styles.hidderRoot}>
                            <div className={styles.card}>
                                <Link href={'/lobby'} className={styles.icon}>
                                    <div>ton</div>
                                    <p>battle</p>
                                    <Image className={styles.logo} src={rich} alt={''} width={150} height={75} />
                                </Link>
                                <div className={styles.lable}>
                                    <div className={styles.timer}><p>{' '}</p></div>
                                    <div className={styles.title}>
                                        <div>Soon</div>
                                        {/*<p>ton</p>*/}
                                    </div>
                                </div>
                                <div className={styles.btn} onClick={() => {
                                    if (window.Telegram?.WebApp?.HapticFeedback) {
                                        window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
                                    }
                                    setHintTwo(!hintTwo)}}>?</div>
                            </div>
                        </div>
                        {hintTwo && <div className={styles.hint}>
                            <p>feeling bold?</p>
                            Put your Ton on the line in this high-stakes mode!
                        </div>}
                    </div>
                </div>
                <div className={styles.faq}>
                    <IconButton image={FAQ} alt={'home'} title={'faq'} onClick={() => {router.push('/faq/pvp')}} />
                </div>
            </div>
    );
};
