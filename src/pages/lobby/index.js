import {useEffect, useState} from 'react';
import Image from "next/image";
import Head from "next/head";
import {useRouter} from "next/router";
import {toast} from "react-toastify";
import {useTranslation} from "react-i18next";
import axiosInstance from "@/utils/axios";
import {IconButton} from "@/components/buttons/icon-btn/IconButton";
import {useLastGames, useProfileStats} from "@/utils/api";

import styles from '@/styles/Lobby.module.scss'
import axios from "@/utils/axios";
import teamData from "@/mock/teamsData";
import {BigButton} from "@/components/buttons/big-btn/BigButton";
import Link from "next/link";

const bg = '/backgrounds/Lobby.png'
const hands = '/main-buttons/hand2.png'
const rich = '/main-buttons/rich.png'
const FAQ = '/main-buttons/pvpfaq.png'
const money = '/money.png'

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
    const { t } = useTranslation();
    const [hintOne, setHintOne] = useState(false)
    const [hintTwo, setHintTwo] = useState(false)
    const [remainingTime, setRemainingTime] = useState(null);
    const [timerActive, setTimerActive] = useState(false);
    const [sessionsCount, setSessionsCount] = useState(0)
    const [clanId, setClanId] = useState(null)
    const [clanPopUp, setClanPopUp] = useState(false)
    const [link, setLink] = useState('')

    const router = useRouter();

    const [pass, setPass] = useState(0)
    const { data: lastGamesData } = useLastGames()
    const { data: statsData, fetchProfileStats } = useProfileStats()

    useEffect(() => {
        fetchProfileStats()
        if (typeof window !== 'undefined') {
            const passes = JSON.parse(localStorage.getItem('init'))
            setPass(passes.pass)
        }
    }, [pass])

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
        if (lastGamesData) {
            const { session } = lastGamesData;
            setSessionsCount(session.count);

            if (session.count >= 5) {
                const firstGame = localStorage.getItem('firstGame') || session.first;
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
        }
    }, [lastGamesData]);

    useEffect(() => {
        const lastClan = localStorage.getItem('dailyClan');
        const today = new Date().toISOString().split('T')[0];
        if (lastClan !== today) {
            axios.get('/group/last')
                .then(response => {
                    const { groupId } = response.data;
                    setClanId(groupId);
                    setClanPopUp(true);
                    localStorage.setItem('dailyClan', today);
                })
                .catch(error => {
                    console.error('Ошибка при выполнении запроса:', error);
                });
        }
    }, []);

    const handlePvpClick = async () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
        if (typeof window === "undefined") return;

        try {
            const response = await axiosInstance.get(`/farm/last-games`);
            const data = response.data;
            setSessionsCount(data.session.count);

            if (data.session.count < 5) {
                router.push('/pvp');
            } else if (data.session.count >= 5 && pass > 0) {
                router.push('/pvp');
            } else {
                toast.warn("You have reached the maximum number of games. Please wait for the timer to expire.");
            }
        } catch (error) {
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

    useEffect(() => {
        const fetchLink = async () => {
            try {
                const response = await axios.get('/buy/pass');
                if (response.status === 200 && response.data.invoiceLink) {
                    setLink(response.data.invoiceLink);
                } else {
                    throw new Error('Ссылка для оплаты не найдена');
                }
            } catch (err) {
                console.error('Error while fetching invoice link:', err);
            }
        };
        fetchLink();
    }, []);

    return (
        <>
            <Head>
                {gameIconsAssets.map((src, index) => (
                    <link key={index} rel="preload" href={src} as="image" />
                ))}
            </Head>
            <div className={styles.root}>
                <Image className={styles.image} src={bg} alt={''} width={450} height={1000} loading="lazy"/>
                <div className={styles.container}>
                    <div className={styles.col}>
                        <div className={styles.card} onClick={handlePvpClick}>
                            <div className={styles.icon}>
                                <div>{t('PVP.battle')}</div>
                                {remainingTime > 0 ?
                                    <p>
                                        {formatTime(remainingTime)}
                                    </p> : <p className={styles.hiddenText}>{t('PVP.battle')}</p>}
                                <Image className={styles.logo} src={hands} alt={''} width={150} height={75} loading="lazy"/>
                            </div>
                            <div className={styles.lable}>
                                <div className={styles.title}>
                                    <div>{sessionsCount > 5 ? 0 : (5 - sessionsCount)}</div>
                                    <p>{t('PVP.left')}</p>
                                </div>
                            </div>
                            <div className={styles.lable}>
                                <div className={styles.title}>
                                    <div>{pass}</div>
                                    <p>{t('PVP.extra')}</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.btn} onClick={() => {
                            if (window.Telegram?.WebApp?.HapticFeedback) {
                                window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
                            }
                            // router.push('/faq/pvp')
                            setHintOne(!hintOne)
                        }}>?</div>
                    </div>
                    <div>
                        <div className={styles.hidderRoot} >
                            <div className={styles.card}>
                                <div className={styles.icon}>
                                    <div>ton</div>
                                    <p>{t('PVP.battle')}</p>
                                    <Image className={styles.logo} src={rich} alt={''} width={150} height={75} loading="lazy"/>
                                </div>
                                <div className={styles.lable}>
                                    {' '}
                                </div>
                                <div className={styles.lable}>
                                    <div className={styles.title}>
                                        <div>{t('PVP.soon')}</div>
                                    </div>
                                </div>
                                <div className={styles.lable}>
                                    {' '}
                                </div>
                            </div>
                        </div>
                        <div className={styles.hidderRoot} >
                            <div className={styles.btn}
                                //  onClick={() => {
                                // if (window.Telegram?.WebApp?.HapticFeedback) {
                                //     window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
                                // }
                                // setHintTwo(!hintTwo)}}
                            >?</div>
                        </div>
                    </div>
                    {hintOne && <div className={styles.hint1}>
                        {t('PVP.against')}
                        <p>{t('PVP.luck')}</p>
                    </div>}
                    {hintTwo && <div className={styles.hint2}>
                        <p>feeling bold?</p>
                        Put your Ton on the line in this high-stakes mode!
                    </div>}
                </div>
                <div className={styles.faq}>
                    <IconButton image={FAQ} alt={'home'} title={t('PVP.faq')} onClick={() => {router.push('/faq/pvp')}} />
                </div>
                <Link href={link} className={styles.buyPass}>
                    {/*<div image={FAQ} alt={'home'} title={"buy passes"} onClick={() => {router.push('/faq/pvp')}} />*/}
                    <Image src={FAQ} alt={''} width={60} height={40} />
                    <div>buy passes</div>
                </Link>
            </div>
            {clanPopUp &&
                <div className={styles.popUpBG}>
                    <div className={styles.clanPopUp}>
                        <div className={styles.clanLabel}>{t('main.DailyPvp')} {t('main.results')}</div>
                        <div className={styles.clanName}>{teamData[clanId]?.Name}</div>
                        <Image src={teamData[clanId]?.logo} alt={''} width={120} height={120} lazy />
                        <div className={styles.clanLabel}>{t('main.are')} <a>{t('main.OG')}</a>{t('main.today')}</div>
                        <div className={styles.clanName}>+50000 <Image src={money} alt="" width={25} height={25} /></div>
                        <button className={styles.dilybtn} onClick={() => setClanPopUp(false)}>{t('random.continue')}</button>
                    </div>
                </div>}
        </>
    );
};
