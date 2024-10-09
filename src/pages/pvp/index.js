import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import { useRouter } from 'next/router';

import { IconButton } from "@/components/buttons/icon-btn/IconButton.jsx";
import {LoaderGif} from "@/components/loader/LoaderGif.jsx";
import {PaperPVPbtn} from "@/components/buttons/paperPVPbtn/PaperPVPbtn.jsx";
import {RockPvpBtn} from "@/components/buttons/rockPvpBtn/RockPvpBtn";
import {ScicPvpBtn} from "@/components/buttons/scicPVPbtn/ScicPVPbtn.jsx";
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

export default function PvpPage() {
    const router = useRouter();
    const [visibleImage, setVisibleImage] = useState(0);
    const [playerScore, setPlayerScore] = useState(0);
    const [opponentScore, setOpponentScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [round, setRound] = useState(1);
    const [timer, setTimer] = useState(5);
    const [playerChoice, setPlayerChoice] = useState(10);
    const [opponentChoice, setOpponentChoice] = useState(10);
    const [gameEnded, setGameEnded] = useState(false);
    const [userName, setUserName] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [isLoadingPvp, setIsLoadingPvp] = useState(true);
    const [userId, setUserId] = useState(null);
    const [userClan, setUserClan] = useState(1);
    const [oppClan, setOppClan] = useState(4);
    const [roundResult, setRoundResult] = useState(null);

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
                setOppClan(opponentClan);
                setUserClan(userClan);
                setSessionId(data.sessionId);
                setIsLoadingPvp(false);
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
        } else if (timer === 0 && playerChoice !== 0 && opponentChoice !== 0) {
            showGifSequence();
        } else if (timer === 0) {
            if (playerChoice === 10) {
                handlePlayerChoiceTimeout();
            }
        }
        return () => clearTimeout(timerId);
    }, [timer, round, isLoadingPvp]);

    const handlePlayerChoiceTimeout = () => {
        console.log('Тайм-аут: Отправляем ответ 10 на сервер');
        console.log('Отправляем выбор:', choice);
        sendAnswerToServer(10);
    };

    const sendAnswerToServer = async (choice) => {
        if (!sessionId) {
            return;
        }
        try {
            console.log('Отправляем выбор:', choice);
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
        if (gameOver || playerChoice !== 10) return;
        setPlayerChoice(choice);
        console.log('clicked playerChoice', playerChoice);
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
        const userAnswer = isPlayer1 ? player1.answer : player2.answer;
        const opponentAnswer = isPlayer1 ? player2.answer : player1.answer;
        const userVictory = isPlayer1 ? player1.victory : player2.victory;
        const opponentVictory = isPlayer1 ? player2.victory : player1.victory;
        setPlayerChoice(userAnswer);
        setOpponentChoice(opponentAnswer);
        setRoundResult({ userVictory, opponentVictory, finished });
        if (player1.answer !== null && player2.answer !== null && timer === 0) {
            showGifSequence();
        }
    };

    const showGifSequence = () => {
        const timeouts = [];
        const durations = [0, 2000];
        durations.forEach((duration, index) => {
            timeouts.push(
                setTimeout(() => {
                    setVisibleImage(index + 1);
                }, duration)
            );
        });
        setTimeout(() => {
            if (roundResult) {
                const newPlayerScore = roundResult.userVictory;
                const newOpponentScore = roundResult.opponentVictory;

                setPlayerScore(newPlayerScore);
                setOpponentScore(newOpponentScore);

                if (roundResult.finished) {
                    handleGameEnd();
                } else {
                    resetRoundAfterDelay();
                }
            }
        }, 2000);
        return () => timeouts.forEach(timeout => clearTimeout(timeout));
    };

    const resetRoundAfterDelay = () => {
        if (playerChoice === opponentChoice) {
            console.log("Ничья: раунд не обновляется");
            setRoundResult(null);
            setPlayerChoice(10);
            setOpponentChoice(10);
            setTimer(5);
            setVisibleImage(0);
        } else {
            console.log("Обновляем раунд");
            setRound(prev => prev + 1);
            setRoundResult(null);
            setPlayerChoice(10);
            setOpponentChoice(10);
            setTimer(5);
            setVisibleImage(0);
        }
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
            {isLoadingPvp ? (
                <LoaderGif />
            ) : (
                <>
                    {gameEnded && <WinningScreen userName={userName} playerScore={playerScore} />}
                    <div className={styles.root}>
                        <Image className={styles.background} src={background} width={300} height={1000}  alt={'bg'}/>
                        <div className={styles.container}>
                            <div className={styles.oppNickname}>
                                biggie smalls
                            </div>
                            <div className={styles.optionBg}>
                                {visibleImage === 0 && (
                                    <Image
                                        width={90}
                                        height={190}
                                        className={styles.choose}
                                        src={gameOptions[10].logo}
                                        alt="First"
                                    />
                                )}
                                {visibleImage === 1 && (
                                    <>
                                        {opponentChoice === 1 && (
                                            <img
                                                className={styles.choose}
                                                src={opponentGifCache.current.rockAnim ? opponentGifCache.current.rockAnim.src : gifPaths.rockAnim}
                                                alt="Third"
                                            />
                                        )}
                                        {opponentChoice === 2 && (
                                            <img
                                                className={styles.choose}
                                                src={opponentGifCache.current.papAnim ? opponentGifCache.current.papAnim.src : gifPaths.papAnim}
                                                alt="Third"
                                            />
                                        )}
                                        {opponentChoice === 3 && (
                                            <img
                                                className={styles.choose}
                                                src={opponentGifCache.current.scisAnim ? opponentGifCache.current.scisAnim.src : gifPaths.scisAnim}
                                                alt="Third"
                                            />
                                        )}
                                    </>

                                )}
                                {visibleImage === 2 && (
                                    <>
                                        {opponentChoice === 1 && (
                                            <Image
                                                width={90}
                                                height={190}
                                                className={styles.choose}
                                                src={gameOptions[1].logo}
                                                alt="Third"
                                            />
                                        )}
                                        {opponentChoice === 2 && (
                                            <Image
                                                width={90}
                                                height={190}
                                                className={styles.choose}
                                                src={gameOptions[2].logo}
                                                alt="Third"
                                            />
                                        )}
                                        {opponentChoice === 3 && (
                                            <Image
                                                width={90}
                                                height={190}
                                                className={styles.choose}
                                                src={gameOptions[3].logo}
                                                alt="Third"
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
                                        src={gameOptions[10].logo}
                                        alt="First"
                                    />
                                )}
                                {visibleImage === 1 && (
                                    <>
                                        {playerChoice === 1 && (
                                            <img
                                                className={styles.mychoose}
                                                src={playerGifCache.current.rockAnim ? playerGifCache.current.rockAnim.src : gifPaths.rockAnim}
                                                alt="Third"
                                            />
                                        )}
                                        {playerChoice === 2 && (
                                            <img
                                                className={styles.mychoose}
                                                src={playerGifCache.current.papAnim ? playerGifCache.current.papAnim.src : gifPaths.papAnim}
                                                alt="Third"
                                            />
                                        )}
                                        {playerChoice === 3 && (
                                            <img
                                                className={styles.mychoose}
                                                src={playerGifCache.current.scisAnim ? playerGifCache.current.scisAnim.src : gifPaths.scisAnim}
                                                alt="Third"
                                            />
                                        )}
                                    </>
                                )}
                                {visibleImage === 2 && (
                                    <>
                                        {playerChoice === 1 && (
                                            <Image
                                                width={90}
                                                height={190}
                                                className={styles.mychoose}
                                                src={gameOptions[1].logo}
                                                alt="Third"
                                            />
                                        )}
                                        {playerChoice === 2 && (
                                            <Image
                                                width={90}
                                                height={190}
                                                className={styles.mychoose}
                                                src={gameOptions[2].logo}
                                                alt="Third"
                                            />
                                        )}
                                        {playerChoice === 3 && (
                                            <Image
                                                width={90}
                                                height={190}
                                                className={styles.mychoose}
                                                src={gameOptions[3].logo}
                                                alt="Third"
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                            <div className={styles.round}>
                                round {round}
                            </div>
                            <div className={styles.buttonSet}>
                                <PaperPVPbtn onClick={() => handlePlayerChoice(2)} choose={playerChoice} />
                                <RockPvpBtn onClick={() => handlePlayerChoice(1)} choose={playerChoice} />
                                <ScicPvpBtn onClick={() => handlePlayerChoice(3)} choose={playerChoice} />
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
const WinningScreen = ({ userName, playerScore }) => (
    <div className={styles.winbg}>
        <div className={styles.winContainer}>
            <div className={styles.winnerName}>{playerScore === 3 ? userName : 'Opponent'}</div>
            <Image width={204} height={151} className={styles.winsImage} src={wins} alt={'wins'} />
            <p className={styles.winnerName}>+5% FaRM RaTE </p>
        </div>
    </div>
);

