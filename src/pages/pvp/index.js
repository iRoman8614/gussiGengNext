import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import { useRouter } from 'next/router';
import Head from 'next/head';

import { IconButton } from "@/components/buttons/icon-btn/IconButton.jsx";
import {LoaderGif} from "@/components/loader/LoaderGif.jsx";
import {PvpBtn} from "@/components/buttons/PvpBtn/PvpBtn";
import { toast } from "react-toastify";
import axiosInstance from '@/utils/axios';

import teamData from '@/mock/teamsData.js';
import { gameOptions } from '@/mock/optionData';

import styles from '@/styles/Pvp.module.scss';
import "react-toastify/dist/ReactToastify.css";

const wins = '/wins.png';
const background = '/backgrounds/backalley.png'
const timerBG = '/timer.png'
const heart = '/game-icons/heart.png'
const cross = '/game-icons/lose.png'
const gifPaths = {
    rockAnim: '/game-icons/animation_hand_rock.gif',
    scisAnim: '/game-icons/animation_hand_sci.gif',
    papAnim: '/game-icons/animation_hand_pap.gif',
};
const rock = '/game-icons/rock.png'
const paper = '/game-icons/paper.png'
const scis = '/game-icons/scissors.png'

export default function PvpPage() {
    const router = useRouter();
    const [visibleImage, setVisibleImage] = useState(0);
    const [playerScore, setPlayerScore] = useState(0);
    const [opponentScore, setOpponentScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [round, setRound] = useState(1);
    const [timer, setTimer] = useState(5);
    const [playerChoice, setPlayerChoice] = useState(4);
    const [opponentChoice, setOpponentChoice] = useState(4);
    const [gameEnded, setGameEnded] = useState(false);
    const [userName, setUserName] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [isLoadingPvp, setIsLoadingPvp] = useState(true);
    const [userId, setUserId] = useState(null);
    const [userClan, setUserClan] = useState(1);
    const [oppClan, setOppClan] = useState(4);
    const [roundResult, setRoundResult] = useState(null);
    const [opponentName, setOpponentName] = useState("biggie smalls")

    const playerGifCache = useRef({});
    const opponentGifCache = useRef({});

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

    useEffect(() => {
        const startGame = async () => {
            try {
                const response = await axiosInstance.get(`/game/start?profileId=${userId || 111}`);
                if (response.status === 400 || response.status === 504) {
                    toast.error("Pair not found");
                    setTimeout(() => {
                        router.push('/');
                    }, 5000);
                    return;
                }
                const data = response.data;
                const isPlayer1 = data.player1.id === userId;
                const userClan = isPlayer1 ? data.player1.group : data.player2.group;
                const opponentClan = isPlayer1 ? data.player2.group : data.player1.group;
                const opponentName = isPlayer1 ? (data.player2.name === "" ? "biggie smalls" : data.player2.name)
                    : (data.player1.name === "" ? "biggie smalls" : data.player1.name);

                setOppClan(opponentClan);
                setUserClan(userClan);
                setOpponentName(opponentName);
                setSessionId(data.sessionId);
                setIsLoadingPvp(false);
                if (data.currentRound > 1) {
                    const lastAnswerResponse = await axiosInstance.get(`/game/last-answer?sessionId=${data.sessionId}`);
                    const lastAnswerData = lastAnswerResponse.data;
                    const playerVictory = isPlayer1 ? lastAnswerData.player1.victory : lastAnswerData.player2.victory;
                    const opponentVictory = isPlayer1 ? lastAnswerData.player2.victory : lastAnswerData.player1.victory;
                    setPlayerScore(playerVictory);
                    setOpponentScore(opponentVictory);
                    const totalVictory = playerVictory + opponentVictory;
                    setRound(totalVictory + 1);
                }
            } catch (error) {
                console.error('Ошибка при запросе /game/start:', error);
                if (error.response) {
                    const { status } = error.response;
                    if (status === 400 || status === 504) {
                        toast.error("Pair not found");
                        setTimeout(() => {
                            router.push('/');
                        }, 5000);
                    }
                }
            }
        };
        if (typeof window !== 'undefined' && userId !== null) {
            startGame();
        }
    }, [userId]);


    useEffect(() => {
        let timerId;
        if (!isLoadingPvp && timer > 0 && !gameOver) {
            timerId = setTimeout(() => {
                setTimer(timer - 1);
            }, 1000);
        } else if (timer === 0) {
            if (playerChoice === 4) {
                handlePlayerChoiceTimeout();
            } else if (playerChoice !== 4 && opponentChoice !== 4) {
                showGifSequence();
            }
        }
        return () => clearTimeout(timerId);
    }, [timer, round, isLoadingPvp, playerChoice, opponentChoice]);

    const handlePlayerChoiceTimeout = () => {
        sendAnswerToServer(10);
    };

    const sendAnswerToServer = async (choice) => {
        if (!sessionId) {
            return;
        }
        try {
            const response = await axiosInstance.get(`/game/answer?profileId=${userId || 111}&sessionId=${sessionId}&answer=${choice}`);
            const data = response.data;
            handleRoundResult(data);
        } catch (error) {
            console.error('Ошибка при запросе /game/answer:', error);
        }
    };

    const handlePlayerChoice = (choice) => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }
        if (gameOver || playerChoice !== 4) return;
        setPlayerChoice(choice);
        const sendAnswer = async () => {
            if (!sessionId) {
                return;
            }
            try {
                const response = await axiosInstance.get(`/game/answer?profileId=${userId || 111}&sessionId=${sessionId}&answer=${choice}`);
                const data = response.data;
                handleRoundResult(data);
            } catch (error) {
                console.error('Ошибка при запросе /game/answer:', error);
            }
        };
        sendAnswer();
    };


    const handleRoundResult = (data) => {
        const { player1, player2, finished } = data;
        const isPlayer1 = player1.id === userId;
        const userAnswer = isPlayer1 ? (player1.answer) : (player2.answer);
        const opponentAnswer = isPlayer1 ? (player2.answer) : (player1.answer);
        const userVictory = isPlayer1 ? player1.victory : player2.victory;
        const opponentVictory = isPlayer1 ? player2.victory : player1.victory;
        setPlayerChoice(userAnswer);
        setOpponentChoice(opponentAnswer);
        setRoundResult({ userVictory, opponentVictory, finished })
        if (player1.answer !== 4 && player2.answer !== 4 && timer === 0) {
            showGifSequence();
        }
    };

    // const showGifSequence = () => {
    //     const timeouts = [];
    //     const durations = [0, 2000];
    //     durations.forEach((duration, index) => {
    //         timeouts.push(
    //             setTimeout(() => {
    //                 setVisibleImage(index + 1);
    //             }, duration)
    //         );
    //     });
    //     setTimeout(() => {
    //         if (roundResult) {
    //             const newPlayerScore = roundResult.userVictory;
    //             const newOpponentScore = roundResult.opponentVictory;
    //             setPlayerScore(newPlayerScore);
    //             setOpponentScore(newOpponentScore);
    //             if (roundResult.finished === true) {
    //                 handleGameEnd();
    //             } else {
    //                 resetRoundAfterDelay();
    //             }
    //         }
    //     }, 7000); // ожидание второго ответа сервером + 2 секунды на гифку
    //     return () => timeouts.forEach(timeout => clearTimeout(timeout));
    // };

    const showGifSequence = () => {
        const timeouts = [];
        const durations = [0, 2000]; // Длительности каждого GIF
        const totalGifDuration = 2000 + 1000; // Добавляем секунду после завершения анимации GIF
        durations.forEach((duration, index) => {
            timeouts.push(
                setTimeout(() => {
                    setVisibleImage(index + 1);
                }, duration)
            );
        });
        // Таймаут для завершения GIF-анимации и перехода к следующему раунду или завершению игры
        setTimeout(() => {
            if (roundResult) {
                const newPlayerScore = roundResult.userVictory;
                const newOpponentScore = roundResult.opponentVictory;
                setPlayerScore(newPlayerScore);
                setOpponentScore(newOpponentScore);

                if (roundResult.finished === true) {
                    handleGameEnd(); // Завершение игры
                } else {
                    setTimeout(() => {
                        resetRoundAfterDelay(); // Переход к следующему раунду через 1 секунду после GIF
                    }, 1000); // Задержка после окончания проигрывания GIF
                }
            }
        }, totalGifDuration); // Ожидание общего времени проигрывания GIF + 1 секунда

        return () => timeouts.forEach(timeout => clearTimeout(timeout));
    };


    const resetRoundAfterDelay = () => {
        if (playerChoice !== opponentChoice) {
            setRound(prev => prev + 1);
            console.log("Обновляем раунд");
        }
        setRoundResult(null);
        setPlayerChoice(4);
        setOpponentChoice(4);
        setTimer(5);
        setVisibleImage(0);
    };

    const handleGameEnd = () => {
        setGameEnded(true);
        setTimeout(() => {
            setGameOver(true);
        }, 3000);
        setTimeout(() => {
            router.push('/main');
        }, 2000);
    };

    return (
        <>
            <Head>
                <link rel="preload" href="/wins.png" as="image" />
                <link rel="preload" href="/backgrounds/backalley.png" as="image" />
                <link rel="preload" href="/timer.png" as="image" />
                <link rel="preload" href="/game-icons/heart.png" as="image" />
                <link rel="preload" href="/game-icons/lose.png" as="image" />
                <link rel="preload" href="/game-icons/animation_hand_rock.gif" as="image" />
                <link rel="preload" href="/game-icons/animation_hand_sci.gif" as="image" />
                <link rel="preload" href="/game-icons/animation_hand_pap.gif" as="image" />
                <link rel="preload" href="/oppNickNameContainer.png" as="image" />
                <link rel="preload" href="/roundContainer.png" as="image" />
                <link rel="preload" href="/winsBG.png" as="image" />
            </Head>
            {isLoadingPvp ? (
                <LoaderGif />
            ) : (
                <>
                    {gameEnded && <WinningScreen userName={userName} playerScore={playerScore} opponentName={opponentName} />}
                    <div className={styles.root}>
                        <Image className={styles.background} src={background} width={300} height={1000} alt={'bg'} priority />
                        <div className={styles.container}>
                            <div className={styles.oppNickname}>
                                {opponentName}
                            </div>
                            <div className={styles.optionBg}>
                                {visibleImage === 0 && (
                                    <Image
                                        width={90}
                                        height={190}
                                        className={styles.choose}
                                        src={gameOptions[4].logo}
                                        alt="1"
                                    />
                                )}
                                {visibleImage === 1 && (
                                    <>
                                        {(opponentChoice === 0 || opponentChoice === 10) && (
                                            <Image
                                                width={90}
                                                height={190}
                                                className={styles.choose}
                                                src={gameOptions[4].logo}
                                                alt="2"
                                            />
                                        )}
                                        {opponentChoice === 1 && (
                                            <img
                                                className={styles.choose}
                                                src={opponentGifCache.current.rockAnim ? opponentGifCache.current.rockAnim.src : gifPaths.rockAnim}
                                                alt="2"
                                            />
                                        )}
                                        {opponentChoice === 2 && (
                                            <img
                                                className={styles.choose}
                                                src={opponentGifCache.current.papAnim ? opponentGifCache.current.papAnim.src : gifPaths.papAnim}
                                                alt="2"
                                            />
                                        )}
                                        {opponentChoice === 3 && (
                                            <img
                                                className={styles.choose}
                                                src={opponentGifCache.current.scisAnim ? opponentGifCache.current.scisAnim.src : gifPaths.scisAnim}
                                                alt="2"
                                            />
                                        )}
                                    </>

                                )}
                                {visibleImage === 2 && (
                                    <>
                                        {(opponentChoice === 0 || opponentChoice === 10) && (
                                            <Image
                                                width={90}
                                                height={190}
                                                className={styles.choose}
                                                src={gameOptions[4].logo}
                                                alt="3"
                                            />
                                        )}
                                        {opponentChoice === 1 && (
                                            <Image
                                                width={90}
                                                height={190}
                                                className={styles.choose}
                                                src={gameOptions[1].logo}
                                                alt="3"
                                            />
                                        )}
                                        {opponentChoice === 2 && (
                                            <Image
                                                width={90}
                                                height={190}
                                                className={styles.choose}
                                                src={gameOptions[2].logo}
                                                alt="3"
                                            />
                                        )}
                                        {opponentChoice === 3 && (
                                            <Image
                                                width={90}
                                                height={190}
                                                className={styles.choose}
                                                src={gameOptions[3].logo}
                                                alt="3"
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                            <VictoryCounter score={playerScore} />
                            <IconButton image={teamData[userClan].logo} alt={'gang'} />
                            <div className={styles.roundTimer}>
                                <Image src={timerBG} alt={'timer'} height={144} width={144} className={styles.roundTimerBG} />
                                <div className={styles.time}>{timer}</div>
                            </div>
                            <IconButton image={teamData[oppClan].logo} alt={'gang'} />
                            <VictoryCounter score={opponentScore} />
                            <div className={styles.optionBg}>
                                {visibleImage === 0 && (
                                    <Image
                                        width={90}
                                        height={190}
                                        className={styles.mychoose}
                                        src={gameOptions[4].logo}
                                        alt="1"
                                    />
                                )}
                                {visibleImage === 1 && (
                                    <>
                                        {(playerChoice === 0 || playerChoice === 10) && (
                                            <Image
                                                width={90}
                                                height={190}
                                                className={styles.mychoose}
                                                src={gameOptions[4].logo}
                                                alt="2"
                                            />
                                        )}
                                        {playerChoice === 1 && (
                                            <img
                                                className={styles.mychoose}
                                                src={playerGifCache.current.rockAnim ? playerGifCache.current.rockAnim.src : gifPaths.rockAnim}
                                                alt="2"
                                            />
                                        )}
                                        {playerChoice === 2 && (
                                            <img
                                                className={styles.mychoose}
                                                src={playerGifCache.current.papAnim ? playerGifCache.current.papAnim.src : gifPaths.papAnim}
                                                alt="2"
                                            />
                                        )}
                                        {playerChoice === 3 && (
                                            <img
                                                className={styles.mychoose}
                                                src={playerGifCache.current.scisAnim ? playerGifCache.current.scisAnim.src : gifPaths.scisAnim}
                                                alt="2"
                                            />
                                        )}
                                    </>
                                )}
                                {visibleImage === 2 && (
                                    <>
                                        {(playerChoice === 0 || playerChoice === 10) && (
                                            <Image
                                                width={90}
                                                height={190}
                                                className={styles.mychoose}
                                                src={gameOptions[4].logo}
                                                alt="3"
                                            />
                                        )}
                                        {playerChoice === 1 && (
                                            <Image
                                                width={90}
                                                height={190}
                                                className={styles.mychoose}
                                                src={gameOptions[1].logo}
                                                alt="3"
                                            />
                                        )}
                                        {playerChoice === 2 && (
                                            <Image
                                                width={90}
                                                height={190}
                                                className={styles.mychoose}
                                                src={gameOptions[2].logo}
                                                alt="3"
                                            />
                                        )}
                                        {playerChoice === 3 && (
                                            <Image
                                                width={90}
                                                height={190}
                                                className={styles.mychoose}
                                                src={gameOptions[3].logo}
                                                alt="3"
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                            <div className={styles.round}>
                                round {round}
                            </div>
                            <div className={styles.buttonSet}>
                                <PvpBtn title={'rock'} img={rock} value={1} onClick={() => handlePlayerChoice(1)} choose={playerChoice} />
                                <PvpBtn title={'paper'} img={paper} value={2} onClick={() => handlePlayerChoice(2)} choose={playerChoice} />
                                <PvpBtn title={'scissons'} img={scis} value={3} onClick={() => handlePlayerChoice(3)} choose={playerChoice} />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

// eslint-disable-next-line react/prop-types
const VictoryCounter = ({ score }) => (
    <div className={styles.counter}>
        {(score >= 1) ? <Image className={styles.heart} src={cross} alt={''} width={55} height={55}  /> : <Image className={styles.heart} src={heart} alt={''} width={55} height={55}  />}
        {(score >= 2) ? <Image className={styles.heart} src={cross} alt={''} width={55} height={55}  /> : <Image className={styles.heart} src={heart} alt={''} width={55} height={55}  />}
        {(score >= 3) ? <Image className={styles.heart} src={cross} alt={''} width={55} height={55}  /> : <Image className={styles.heart} src={heart} alt={''} width={55} height={55}  />}
    </div>
);

// eslint-disable-next-line react/prop-types
const WinningScreen = ({ userName, playerScore, opponentName  }) => (
    <div className={styles.winbg}>
        <div className={styles.winBorder}>
            <div className={styles.winContainer}>
                <div className={styles.winnerName}>
                    {playerScore === 3 ? userName : opponentName}
                </div>
                <Image width={204} height={151} className={styles.winsImage} src={wins} alt={'wins'}  />
                <p className={styles.winnerName}>+5% FaRM RaTE </p>
            </div>
        </div>
    </div>
);

