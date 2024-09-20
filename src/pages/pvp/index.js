import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from 'next/router';

import { IconButton } from "@/components/buttons/icon-btn/IconButton.jsx";
import {LoaderGif} from "@/components/loader/LoaderGif.jsx";
import {PaperPVPbtn} from "@/components/buttons/paperPVPbtn/PaperPVPbtn.jsx";
import {RockPvpBtn} from "@/components/buttons/rockPvpBtn/RockPvpBtn";
import {ScicPvpBtn} from "@/components/buttons/scicPVPbtn/ScicPVPbtn.jsx";
import { toast } from "react-toastify";

import teamData from '@/mock/teamsData.js';
import { gameOptions } from '@/mock/optionData';

import styles from '@/styles/Pvp.module.scss';
import "react-toastify/dist/ReactToastify.css";

const wins = '/wins.png';
const start = '/game-icons/animation_hand_start.gif';
const rockAnim = '/game-icons/animation_hand_rock.gif';
const scisAnim = '/game-icons/animation_hand_sci.gif';
const papAnim = '/game-icons/animation_hand_pap.gif';
const background = '/backgrounds/backalley.png'
const timerBG = '/timer.png'
//кадры лампочки
const scale000 = '/roundLightUp/scale00.png'
const scale001 = '/roundLightUp/scale01.png'
const scale002 = '/roundLightUp/scale02.png'
const scale003 = '/roundLightUp/scale03.png'
const scale004 = '/roundLightUp/scale04.png'
const scale005 = '/roundLightUp/scale05.png'
const scale006 = '/roundLightUp/scale06.png'
const scale007 = '/roundLightUp/scale07.png'
const scale008 = '/roundLightUp/scale08.png'
const scale009 = '/roundLightUp/scale09.png'
const scale010 = '/roundLightUp/scale10.png'
const scale011 = '/roundLightUp/scale11.png'
const scale012 = '/roundLightUp/scale12.png'
const scale013 = '/roundLightUp/scale13.png'
const scale014 = '/roundLightUp/scale14.png'
const scale015 = '/roundLightUp/scale15.png'

export default function PvpPage() {
    const router = useRouter();
    const [visibleImage, setVisibleImage] = useState(0);
    const [playerScore, setPlayerScore] = useState(0);
    const [opponentScore, setOpponentScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [round, setRound] = useState(1);
    const [timer, setTimer] = useState(5);
    const [playerChoice, setPlayerChoice] = useState(null);
    const [opponentChoice, setOpponentChoice] = useState(3);
    const [gameEnded, setGameEnded] = useState(false);
    const [opponentTeamId, setOpponentTeamId] = useState(() => Math.floor(Math.random() * 3) + 1);
    const [userName, setUserName] = useState('you');
    const [sessionId, setSessionId] = useState(null);  // Сохраняем sessionId
    const [isLoadingPvp, setIsLoadingPvp] = useState(true); // Управляет отображением лоадера
    const [userId, setUserId] = useState(null); // Для хранения userId

// Получаем userId из Telegram
    useEffect(() => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const search = window.Telegram.WebApp.initData;
            const urlParams = new URLSearchParams(search);
            const userParam = urlParams.get('user');

            if (userParam) {
                const decodedUserParam = decodeURIComponent(userParam);
                const userObject = JSON.parse(decodedUserParam);
                setUserId(userObject.id);  // Сохраняем userId
            } else {
                setUserId(111);  // Если userId не найден, используем 111 по умолчанию
            }
        }
    }, []);

// Делаем запрос на /game/start и сохраняем sessionId
    useEffect(() => {
        const startGame = async () => {
            try {
                const response = await fetch(`https://supavpn.lol/game/start?profileId=${userId || 111}`);
                if (response.status === 400 || response.status === 504) {
                    toast.error("Pair not found");
                    setTimeout(() => {
                        router.push('/');
                    }, 5000);
                    return;
                }
                const data = await response.json();
                setSessionId(data.sessionId);
                setIsLoadingPvp(false);
            } catch (error) {
                console.error('Ошибка при запросе /game/start:', error);
            }
        };
        if (typeof window !== 'undefined' && userId !== null) {
            startGame();
        }
    }, [userId]);


// Таймер отсчитывает время после скрытия лоадера и начала игры
    useEffect(() => {
        let timerId;
        if (!isLoadingPvp && timer > 0 && !gameOver) {
            timerId = setTimeout(() => {
                setTimer(timer - 1);
            }, 1000);
        } else if (timer === 0 && playerChoice !== null && opponentChoice !== null) {
            showGifSequence();
        }
        return () => clearTimeout(timerId);
    }, [timer, gameOver, playerChoice, opponentChoice, isLoadingPvp]);

// Функция для отправки ответа и ожидания результата
    const handlePlayerChoice = (choice) => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }
        if (gameOver || playerChoice !== null) return;
        setPlayerChoice(choice);

        const sendAnswer = async () => {
            if (!sessionId) {
                console.error("Session ID is missing, cannot send answer");
                return;
            }
            try {
                const response = await fetch(`https://supavpn.lol/game/answer?profileId=${userId || 111}&sessionId=${sessionId}&answer=${choice}`);
                const data = await response.json();
                handleRoundResult(data);
            } catch (error) {
                console.error('Ошибка при запросе /game/answer:', error);
            }
        };
        sendAnswer();
    };

// Обработка результата раунда
    const handleRoundResult = (data) => {
        const { player1, player2, result, victory, finished } = data;
        const isPlayer1 = player1.id === userId;
        const userAnswer = isPlayer1 ? player1.answer : player2.answer;
        const opponentAnswer = isPlayer1 ? player2.answer : player1.answer;

        setPlayerChoice(userAnswer);
        setOpponentChoice(opponentAnswer);

        if (timer === 0) {
            showGifSequence(); // Показываем анимацию
        }

        if (result === 1 && victory === userId) {
            setPlayerScore(prev => {
                const newScore = prev + 1;
                if (newScore === 3) {
                    handleGameEnd();
                }
                return newScore;
            });
        } else if (result === 2 || (result === 1 && victory !== userId)) {
            setOpponentScore(prev => {
                const newScore = prev + 1;
                if (newScore === 3) {
                    handleGameEnd();
                }
                return newScore;
            });
        }

        if (!finished) {
            setTimeout(() => {
                resetRoundAfterDelay();
            }, 2000);
        }
    };

// Запуск анимаций
    const showGifSequence = () => {
        const timeouts = [];
        const durations = [0, 1000, 1000];
        durations.forEach((duration, index) => {
            timeouts.push(
                setTimeout(() => {
                    setVisibleImage(index + 1); // Обновляем показ картинки
                }, duration)
            );
        });

        return () => timeouts.forEach(timeout => clearTimeout(timeout));
    };

    const resetRoundAfterDelay = () => {
        setPlayerChoice(null);
        setOpponentChoice(null);
        setTimer(5); // Сбрасываем таймер
        setVisibleImage(0); // Сбрасываем анимацию
        setRound(prev => prev + 1); // Переход к следующему раунду
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
                                        src={gameOptions[3].logo}
                                        alt="First"
                                    />
                                )}
                                {visibleImage === 1 && (
                                    <Image
                                        width={90}
                                        height={190}
                                        className={styles.choose}
                                        src={start}
                                        alt="Second"
                                    />
                                )}
                                {visibleImage === 2 && (
                                    <>
                                        {opponentChoice === 0 && (
                                            <Image
                                                width={90}
                                                height={190}
                                                className={styles.choose}
                                                src={rockAnim}
                                                alt="Third"
                                            />
                                        )}
                                        {opponentChoice === 1 && (
                                            <Image
                                                width={90}
                                                height={190}
                                                className={styles.choose}
                                                src={papAnim}
                                                alt="Third"
                                            />
                                        )}
                                        {opponentChoice === 2 && (
                                            <Image
                                                width={90}
                                                height={190}
                                                className={styles.choose}
                                                src={scisAnim}
                                                alt="Third"
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                            <VictoryCounter score={opponentScore} />
                            <IconButton image={teamData[1].logo} alt={'gang'} />
                            <div className={styles.roundTimer}>
                                <Image src={timerBG} alt={'timer'} height={144} width={144} className={styles.roundTimerBG} />
                                <div className={styles.time}>{timer}</div>
                            </div>
                            <IconButton image={teamData[4].logo} alt={'gang'} />
                            <VictoryCounter score={playerScore} />
                            <div className={styles.optionBg}>
                                {visibleImage === 0 && (
                                    <Image
                                        width={90}
                                        height={190}
                                        className={styles.mychoose}
                                        src={gameOptions[3].logo}
                                        alt="First"
                                    />
                                )}
                                {visibleImage === 1 && (
                                    <Image
                                        width={90}
                                        height={190}
                                        className={styles.mychoose}
                                        src={start}
                                        alt="Second"
                                    />
                                )}
                                {visibleImage === 2 && (
                                    <>
                                        {playerChoice === 0 && (
                                            <Image
                                                width={90}
                                                height={190}
                                                className={styles.mychoose}
                                                src={rockAnim}
                                                alt="Third"
                                            />
                                        )}
                                        {playerChoice === 1 && (
                                            <Image
                                                width={90}
                                                height={190}
                                                className={styles.mychoose}
                                                src={papAnim}
                                                alt="Third"
                                            />
                                        )}
                                        {playerChoice === 2 && (
                                            <Image
                                                width={90}
                                                height={190}
                                                className={styles.mychoose}
                                                src={scisAnim}
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
                                <PaperPVPbtn onClick={() => handlePlayerChoice(1)} choose={playerChoice} />
                                <RockPvpBtn onClick={() => handlePlayerChoice(0)} choose={playerChoice} />
                                <ScicPvpBtn onClick={() => handlePlayerChoice(2)} choose={playerChoice} />
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
        {(score >= 3) ? (<LightOnSequence />) : <div className={styles.lampOff}></div>}
        {(score >= 2) ? (<LightOnSequence />) : <div className={styles.lampOff}></div>}
        {(score >= 1) ? (<LightOnSequence />) : <div className={styles.lampOff}></div>}
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

const LightOnSequence = () => {
    const initialImages = [
        scale000,
        scale001,
        scale002,
        scale003,
        scale004,
        scale005,
        scale006,
        scale007,
        scale008,
        scale009,
        scale010,
        scale011,
        scale012,
        scale013,
        scale014,
        scale015,
    ];
    const [currentImage, setCurrentImage] = useState(0);
    useEffect(() => {
        if (currentImage < (initialImages.length - 1)) {
            const interval = setInterval(() => {
                setCurrentImage((prevImage) => prevImage + 1);
            }, 100);
            return () => clearInterval(interval);
        }
    }, [currentImage, initialImages.length]);
    return (
        <div className={styles.lampOnBg}>
            <Image width={42} height={53} className={styles.lampOn} src={initialImages[currentImage]} alt="on" />
        </div>
    );
};
