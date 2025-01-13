import {useEffect, useRef, useState} from "react";
import Lottie from 'react-lottie';
import Image from "next/image";
import { useRouter } from 'next/router';
import { IconButton } from "@/components/buttons/icon-btn/IconButton.jsx";
import {PvpBtn} from "@/components/buttons/PvpBtn/PvpBtn";
import {useTriggerBotGame} from "@/utils/api";
import {useInit} from "@/context/InitContext";
import teamData from '@/mock/teamsData.js';
import gangsterNames from '@/mock/gangstersNames.js'
import { gameOptions } from '@/mock/optionData';
import {useTranslation} from "react-i18next";
import roundAnimationData from '@/mock/Round.json';
import startAnimationData from '@/mock/Start_new.json';

import styles from '@/styles/Pvp.module.scss';
import "react-toastify/dist/ReactToastify.css";

const youWin = '/goldwins.png';
const youLose = '/youLose.png'
const timerBG = '/timer.png'
const heart = '/game-icons/heart.png'
const cross = '/game-icons/lose.png'
const gifPaths = {
    rockAnim: '/game-icons/animation_hand_rock.gif',
    scisAnim: '/game-icons/animation_hand_sci.gif',
    papAnim: '/game-icons/animation_hand_pap.gif',
    watchMove: '/game-icons/SciWatchMove.gif'
};
const rock = '/game-icons/rock.png'
const paper = '/game-icons/paper.png'
const scis = '/game-icons/scissors.png'
const watchStart = '/game-icons/SciWatchStart.png'
const watchFinish = '/game-icons/SciWatchFinish.png'


export default function PvpBotPage() {
    const router = useRouter();
    const { t } = useTranslation();
    const { groupId, updateContext } = useInit();
    const { triggerBotGame } = useTriggerBotGame();
    const [visibleImage, setVisibleImage] = useState(0);
    const [playerScore, setPlayerScore] = useState(0);
    const [opponentScore, setOpponentScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [timer, setTimer] = useState(4);
    const [playerChoice, setPlayerChoice] = useState(null);
    const [opponentChoice, setOpponentChoice] = useState(3);
    const [gameEnded, setGameEnded] = useState(false);
    const [userName, setUserName] = useState('you');
    const [oppClan, setOppClan] = useState(null);
    const [opponentName, setOpponentName] = useState("biggie smalls")
    const [resetSequence, setResetSequence] = useState(false);
    const [showChanger, setShowChanger] = useState(false)
    const [isLocked, setIsLocked] = useState(false);
    const [roundProcessed, setRoundProcessed] = useState(false);
    const [preGameStep, setPreGameStep] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [background, setBackground] = useState(null)

    const playerGifCache = useRef({});
    const opponentGifCache = useRef({});
    const preGameSteps = ["Ready!", ""];

    const preloadPlayerGifs = () => {
        const cache = {};
        if (typeof window !== 'undefined') {
            ['rockAnim', 'scisAnim', 'papAnim'].forEach(key => {
                const img = new window.Image();
                img.src = gifPaths[key];
                cache[key] = img;
                console.log(`Игрок - Загружен ${key}: ${img.src}`);
            });
        }
        return cache;
    };

    const preloadOpponentGifs = () => {
        const cache = {};
        if (typeof window !== 'undefined') {
            ['rockAnim', 'scisAnim', 'papAnim'].forEach(key => {
                const img = new window.Image();
                img.src = gifPaths[key];
                cache[key] = img;
                console.log(`Оппонент - Загружен ${key}: ${img.src}`);
            });
        }
        return cache;
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            playerGifCache.current = preloadPlayerGifs();
            opponentGifCache.current = preloadOpponentGifs();
        }
        updateContext()
    }, []);

    useEffect(() => {
        const number = Math.floor(Math.random() * 3) + 1;
        setBackground(number);
    }, []);

    const getBackgroundImageUrl = (number) => {
        switch (number) {
            case 1:
                return '/backgrounds/backalley.png';
            case 2:
                return '/backgrounds/pvpbg2.png';
            case 3:
                return '/backgrounds/pvpbg4.png';
            default:
                return '';
        }
    };

    useEffect(() => {
        if (preGameStep < preGameSteps.length) {
            const timerId = setTimeout(() => {
                setPreGameStep((prevStep) => prevStep + 1);
            }, 2500);
            return () => clearTimeout(timerId);
        } else {
            setGameStarted(true);
        }
    }, [preGameStep]);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const search = window.Telegram.WebApp.initData;
            const urlParams = new URLSearchParams(search);
            const userParam = urlParams.get('user');
            if (userParam) {
                const decodedUserParam = decodeURIComponent(userParam);
                const userObject = JSON.parse(decodedUserParam);
                setUserName(userObject.username);
            } else {
                setUserName('you');
            }
            const randomName = gangsterNames[Math.floor(Math.random() * gangsterNames.length)];
            setOpponentName(randomName)
        }
    }, []);

    useEffect(() => {
        if (groupId !== null) {
            const randomOpponentTeamId = getRandomTeamIdExceptCurrent(groupId);
            setOppClan(randomOpponentTeamId);
        }
    }, [groupId]);

    useEffect(() => {
        let timerId;
        if (timer > 0 && !gameOver && gameStarted) {
            timerId = setTimeout(() => {
                if (window.Telegram?.WebApp?.HapticFeedback) {
                    window.Telegram.WebApp.HapticFeedback.impactOccurred("light");
                }
                setTimer(timer - 1);
            }, 1000);
        } else if (timer === 0 && !roundProcessed) {
            setIsLocked(true);
            setRoundProcessed(true);
            const finalPlayerChoice = playerChoice !== null ? playerChoice : 0;
            setPlayerChoice(finalPlayerChoice);
            const randomOpponentChoice = getRandomOption();
            setOpponentChoice(randomOpponentChoice);
            showGifSequence();
            setTimeout(() => {
                updateScores(finalPlayerChoice, randomOpponentChoice);
            }, 2000);
        }
        return () => clearTimeout(timerId);
    }, [timer, gameOver, playerChoice, roundProcessed, gameStarted]);

    const showGifSequence = () => {
        const timeouts = [];
        const durations = [0, 2080];
        durations.forEach((duration, index) => {
            timeouts.push(
                setTimeout(() => {
                    setVisibleImage(index + 1);
                }, duration)
            );
        });
        return () => timeouts.forEach(timeout => clearTimeout(timeout));
    };

    const updateScores = (playerMoveIndex, opponentMoveIndex) => {
        const playerMove = gameOptions[playerMoveIndex]?.name;
        const opponentMove = gameOptions[opponentMoveIndex].name;

        if (playerMove === "default") {
            setOpponentScore(prev => {
                const newScore = prev + 1;
                if (newScore === 3) {
                    setTimeout(() => handleGameEnd(0), 3000);
                } else {
                    setShowChanger(true);
                }
                return newScore;
            });
        } else if (playerMove === opponentMove) {
            setTimeout(() => {
                resetRoundAfterDelay();
            }, 2000);
        } else if (
            (playerMove === 'paper' && opponentMove === 'rock') ||
            (playerMove === 'rock' && opponentMove === 'scis') ||
            (playerMove === 'scis' && opponentMove === 'paper')
        ) {
            setPlayerScore(prev => {
                const newScore = prev + 1;
                if (newScore === 3) {
                    setTimeout(() => handleGameEnd(1), 3000);
                } else {
                    setShowChanger(true)
                }
                return newScore;
            });
        } else {
            setOpponentScore(prev => {
                const newScore = prev + 1;
                if (newScore === 3) {
                    setTimeout(() => handleGameEnd(0), 3000);
                } else {
                    setShowChanger(true)
                }
                return newScore;
            });
        }
        if(!gameEnded) {
            setTimeout(() => {
                resetRoundAfterDelay();
            }, 2000);
        }
    };

    const handleGameEnd = async (vin) => {
        if (gameEnded) return;
        setGameEnded(true);
        endBotGame(vin)
        setTimeout(() => {
            setGameOver(true);
        }, 3000);
        setTimeout(() => {
            router.push('/lobby');
        }, 5000);
    };
    const endBotGame = async (vin) => {
        try {
            await triggerBotGame(vin);
        } catch (e) {
            console.log(e)
        }
    }

    const resetRoundAfterDelay = () => {
        setShowChanger(false);
        setPlayerChoice(null);
        setOpponentChoice(null);
        setTimer(4);
        setVisibleImage(0);
        setIsLocked(false);
        setResetSequence(!resetSequence);
        setRoundProcessed(false);
    };

    return (
        <>
            {gameEnded && <WinningScreen userName={userName} playerScore={playerScore} />}
            {preGameStep === 1 && <StartAnimation />}
            <div className={styles.root}>
                <Image className={styles.background} src={getBackgroundImageUrl(background)} width={300} height={1000} alt={'bg'} priority />
                <div className={styles.container}>
                    <div className={styles.oppNickname}>
                        {opponentName}
                    </div>
                    <div className={styles.optionBg}>
                        <Image
                            width={90}
                            height={190}
                            layout="fixed"
                            objectFit="contain"
                            className={`${styles.choose} ${styles.overlayOpponent} ${visibleImage === 0 ? styles.visible : styles.hidden}`}
                            src={watchStart}
                            alt="watch start"
                        />
                        <img
                            className={`${styles.choose} ${styles.watchMoveOpp} ${visibleImage === 1 ? styles.visible : styles.hidden}`}
                            src={'/game-icons/SciWatchMove.gif'}
                            alt="watch move"
                        />
                        <img
                            className={`${styles.choose} ${visibleImage === 1 ? styles.visible : styles.hidden}`}
                            src={
                                opponentChoice === 1
                                    ? opponentGifCache.current.rockAnim?.src || gifPaths.rockAnim
                                    : opponentChoice === 2
                                        ? opponentGifCache.current.papAnim?.src || gifPaths.papAnim
                                        : opponentChoice === 3
                                            ? opponentGifCache.current.scisAnim?.src || gifPaths.scisAnim
                                            : gameOptions[4]?.logo
                            }
                            alt="game choice animation"
                        />
                        <Image
                            width={90}
                            height={190}
                            layout="fixed"
                            objectFit="contain"
                            className={`${styles.choose} ${visibleImage !== 1 ? styles.visible : styles.hidden}`}
                            src={
                                visibleImage === 0
                                    ? gameOptions[1]?.logo
                                    : opponentChoice === 0 || opponentChoice === 10
                                        ? gameOptions[4]?.logo
                                        : opponentChoice === 1
                                            ? gameOptions[1]?.logo
                                            : opponentChoice === 2
                                                ? gameOptions[2]?.logo
                                                : gameOptions[3]?.logo
                            }
                            alt="game choice"
                            loading="lazy"
                        />
                        <Image
                            width={90}
                            height={190}
                            layout="fixed"
                            objectFit="contain"
                            className={`${styles.choose} ${styles.overlayOpponent} ${visibleImage !== 1 ? styles.visible : styles.hidden}`}
                            src={watchFinish}
                            alt="watch finish"
                        />
                    </div>
                    <VictoryCounter score={playerScore} />
                    <div className={styles.iconBG}>
                        <Image className={styles.iconImage} src={teamData[groupId]?.logo} alt={''} width={80} height={80} />
                    </div>
                    <div className={styles.roundTimer}>
                        <Image src={timerBG} alt={'timer'} height={144} width={144} className={styles.roundTimerBG} loading="lazy" />
                        <div className={styles.time}>{timer}</div>
                    </div>
                    <div className={styles.iconBG}>
                        <Image className={styles.iconImage} src={teamData[oppClan]?.logo} alt={''} width={80} height={80} />
                    </div>
                    <VictoryCounter score={opponentScore} />
                    <div className={styles.optionBg}>
                        <Image
                            width={90}
                            height={190}
                            layout="fixed"
                            objectFit="contain"
                            className={`${styles.mychoose} ${styles.overlay} ${visibleImage === 0 ? styles.visible : styles.hidden}`}
                            src={watchStart}
                            alt="watch start"
                        />
                        <img
                            className={`${styles.mychoose} ${styles.watchMove} ${visibleImage === 1 ? styles.visible : styles.hidden}`}
                            src='/game-icons/SciWatchMove.gif'
                            alt="watch move"
                        />
                        <img
                            className={`${styles.mychoose} ${visibleImage === 1 ? styles.visible : styles.hidden}`}
                            src={
                                playerChoice === 1
                                    ? playerGifCache.current.rockAnim?.src || gifPaths.rockAnim
                                    : playerChoice === 2
                                        ? playerGifCache.current.papAnim?.src || gifPaths.papAnim
                                        : playerChoice === 3
                                            ? playerGifCache.current.scisAnim?.src || gifPaths.scisAnim
                                            : gameOptions[4]?.logo
                            }
                            alt="game choice animation"
                        />
                        <Image
                            width={90}
                            height={190}
                            layout="fixed"
                            objectFit="contain"
                            className={`${styles.mychoose} ${visibleImage !== 1 ? styles.visible : styles.hidden}`}
                            src={
                                visibleImage === 0
                                    ? gameOptions[4]?.logo
                                    : playerChoice === 0 || playerChoice === 10
                                        ? gameOptions[4]?.logo
                                        : playerChoice === 1
                                            ? gameOptions[1]?.logo
                                            : playerChoice === 2
                                                ? gameOptions[2]?.logo
                                                : gameOptions[3]?.logo
                            }
                            alt="game choice"
                            loading="lazy"
                        />
                        <Image
                            width={90}
                            height={190}
                            layout="fixed"
                            objectFit="contain"
                            className={`${styles.mychoose} ${styles.overlay} ${visibleImage !== 1 ? styles.visible : styles.hidden}`}
                            src={watchFinish}
                            alt="watch finish"
                        />
                    </div>
                    <div className={styles.round}>
                        {t('PVP.rounds')} {playerScore+opponentScore+1}
                    </div>
                    <div className={styles.buttonSet}>
                        <PvpBtn
                            title={t('PVP.rock')}
                            img={rock}
                            value={1}
                            onClick={() => playerChoice === null && !isLocked && gameStarted && setPlayerChoice(1)}
                            choose={playerChoice}
                        />
                        <PvpBtn
                            title={t('PVP.paper')}
                            img={paper}
                            value={2}
                            onClick={() => playerChoice === null && !isLocked && gameStarted && setPlayerChoice(2)}
                            choose={playerChoice}
                        />
                        <PvpBtn
                            title={t('PVP.scissors')}
                            img={scis}
                            value={3}
                            onClick={() => playerChoice === null && !isLocked && gameStarted && setPlayerChoice(3)}
                            choose={playerChoice}
                        />
                    </div>

                </div>
            </div>
            {showChanger && <RoundAnimation round={playerScore + opponentScore + 1}/>}
        </>
    )
}

function getRandomOption() {
    const result = Math.floor(Math.random() * 3) + 1
    return(result);
}
function getRandomTeamIdExceptCurrent(userNumber) {
    const numbers = [1, 2, 3, 4];
    const remainingNumbers = numbers.filter(num => num !== userNumber);
    if (remainingNumbers.length === 0) {
        return null;
    }
    const randomIndex = Math.floor(Math.random() * remainingNumbers.length);
    return remainingNumbers[randomIndex];
}

// eslint-disable-next-line react/prop-types
const VictoryCounter = ({ score }) => (
    <div className={styles.counter}>
        {(score >= 1) ? <Image className={styles.heart} src={cross} alt={''} width={55} height={55} loading="lazy" /> : <Image className={styles.heart} src={heart} alt={''} width={55} height={55} loading="lazy" />}
        {(score >= 2) ? <Image className={styles.heart} src={cross} alt={''} width={55} height={55} loading="lazy" /> : <Image className={styles.heart} src={heart} alt={''} width={55} height={55} loading="lazy" />}
        {(score >= 3) ? <Image className={styles.heart} src={cross} alt={''} width={55} height={55} loading="lazy" /> : <Image className={styles.heart} src={heart} alt={''} width={55} height={55} loading="lazy" />}
    </div>
);

// eslint-disable-next-line react/prop-types
const WinningScreen = ({ playerScore  }) => (
    <div className={styles.winbg}>
        {playerScore === 3 ? <div>
                {playerScore === 3
                    &&
                    <Image width={204} height={151} className={styles.winsImage} src={youWin} alt={'wins'} priority />
                }
                {playerScore === 3 ? <p className={styles.winnerName}>+5% loot</p> : <p></p>}
        </div> : <Image width={204} height={204} className={styles.loseImage} src={youLose} alt={'you lose'} priority />}
    </div>
);

const RoundAnimation = ({ round }) => {
    const { t } = useTranslation();
    const defaultOptions = {
        loop: false,
        autoplay: true,
        animationData: roundAnimationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div className={styles.changerRoot}>
            <Lottie style={{ pointerEvents: "none" }} options={defaultOptions} height="100%" width="100%" />
            <div className={styles.changerText}>
                {typeof round === "string" ? round : `${t("PVP.rounds")} ${round}`}
            </div>
        </div>
    );
}

const StartAnimation = () => {
    const defaultOptions = {
        loop: false,
        autoplay: true,
        animationData: startAnimationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <div className={styles.changerRoot}>
            <Lottie options={defaultOptions} style={{ pointerEvents: "none" }} height="100%" width="100%" className={styles.lottie} />
        </div>
    );
}
