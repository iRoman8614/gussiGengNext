import React, {useEffect, useState} from 'react';
import Image from "next/image";
import Head from "next/head";
import {useRouter} from "next/router";

import styles from '@/styles/Lobby.module.scss'
import {toast} from "react-toastify";
import axiosInstance from "@/utils/axios";

const bg = '/backgrounds/Lobby.png'
const hands = '/main-buttons/hand2.png';
const rich = '/main-buttons/rich.png';

export default function Page() {
    const [hintOne, setHintOne] = useState(false)
    const [hintTwo, setHintTwo] = useState(false)
    const [userId, setUserId] = useState(111);
    const [remainingTime, setRemainingTime] = useState(null);
    const [timerActive, setTimerActive] = useState(false);
    const [sessionsCount, setSessionsCount] = useState(0)

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
        if (typeof window !== "undefined" && window.Telegram?.WebApp) {
            const search = window.Telegram.WebApp.initData;
            const urlParams = new URLSearchParams(search);
            const userParam = urlParams.get("user");
            if (userParam) {
                const decodedUserParam = decodeURIComponent(userParam);
                const userObject = JSON.parse(decodedUserParam);
                console.log("User ID from Telegram:", userObject.id);
                setUserId(userObject.id);
            }
        }
    }, []);

    const handlePvpClick = async () => {
        if (typeof window === "undefined") return;
        const firstGame = sessionStorage.getItem('firstGame');
        if (firstGame) {
            const firstGameTime = new Date(firstGame);
            const now = new Date();
            const timeDiffInMs = now - firstGameTime;
            const remainingTimeInMs = (6 * 60 * 60 * 1000) - timeDiffInMs;
            if (remainingTimeInMs > 0) {
                setTimer(remainingTimeInMs);
                setTimerActive(true);
                toast.warn("You have reached the maximum number of games.");
                return;
            } else {
                sessionStorage.removeItem('firstGame');
            }
        }
        try {
            const response = await axiosInstance.get(`/farm/last-games?profileId=${userId}`);
            const data = response.data;
            setSessionsCount(data.session.count)
            if (data.session.count < 5) {
                router.push('/pvp');
            } else {
                const firstGameTime = new Date(data.session.first);
                const now = new Date();
                const timeDiffInMs = now - firstGameTime;
                const remainingTimeInMs = (6 * 60 * 60 * 1000) - timeDiffInMs;

                if (remainingTimeInMs > 0) {
                    setTimer(remainingTimeInMs);
                    setTimerActive(true);
                    toast.warn(`The next game will be available in ${Math.floor(remainingTimeInMs / (1000 * 60 * 60))} h. ${Math.floor((remainingTimeInMs % (1000 * 60 * 60)) / (1000 * 60))} min.`);
                } else {
                    sessionStorage.removeItem('firstGame');
                    router.push('/pvp');
                }
            }
        } catch (error) {
            console.error("Error during /last-games request:", error);
            toast.error('Error while checking game availability');
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
        <>
            <Head>
                <link rel="preload" href="/backgrounds/Lobby.png" as="image" />
                <link rel="preload" href="/main-buttons/hand2.png" as="image" />
                <link rel="preload" href="/main-buttons/rich.png" as="image" />
            </Head>
            <div className={styles.root}>
                <Image className={styles.image} src={bg} alt={''} width={450} height={1000} />
                <div className={styles.container}>
                    <div>
                        <div className={styles.card}>
                            <div className={styles.icon} onClick={handlePvpClick}>
                                <div>battle</div>
                                <p> </p>
                                <Image className={styles.logo} src={hands} alt={''} width={150} height={75} />
                            </div>
                            <div className={styles.lable}>
                                {remainingTime > 0  && <div className={styles.timer}>{formatTime(remainingTime)}</div>}
                                <div className={styles.title}>
                                    {/*<div>0</div>*/}
                                    {/*<p>passes</p>*/}
                                    {sessionsCount < 6 ? <div>{5 - (sessionsCount) }</div> : <div>0</div>}
                                    <p>games left</p>
                                </div>
                            </div>
                            <div className={styles.btn} onClick={() => {
                                if (window.Telegram?.WebApp?.HapticFeedback) {
                                    window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
                                }
                                setHintOne(!hintOne)}}>?</div>
                        </div>
                        {hintOne && <div className={styles.hint}>
                            Battle against others, earn rewards, and climb the ranks.
                            <p>No luck, just skill!</p>
                        </div>}
                    </div>
                    <div>
                        <div className={styles.card}>
                            <div className={styles.icon}>
                                <div>ton</div>
                                <p>battle</p>
                                <Image className={styles.logo} src={rich} alt={''} width={150} height={75} />
                            </div>
                            <div className={styles.lable}>
                                <div className={styles.timer}></div>
                                <div className={styles.title}>
                                    <div>1</div>
                                    <p>ton</p>
                                </div>
                                <div className={styles.btn} onClick={() => {
                                    if (window.Telegram?.WebApp?.HapticFeedback) {
                                        window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
                                    }
                                    setHintTwo(!hintTwo)}}>?</div>
                            </div>

                        </div>
                        {hintTwo && <div className={styles.hint}>
                            <p>FEELING BOLD?</p>
                            Put your TON on the line in this high-stakes mode!
                        </div>}
                    </div>
                </div>
            </div>
        </>

    );
};
