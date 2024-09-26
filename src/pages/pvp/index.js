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
const rockAnim = '/game-icons/animation_hand_rock.gif';
const scisAnim = '/game-icons/animation_hand_sci.gif';
const papAnim = '/game-icons/animation_hand_pap.gif';
const background = '/backgrounds/backalley.png'
const timerBG = '/timer.png'
const heart = '/game-icons/heart.png'
const cross = '/game-icons/lose.png'

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

    useEffect(() => {
        if (typeof window !== "undefined") {
            const init = JSON.parse(localStorage.getItem("init"));
            if (init && init.group) {
                setUserClan(init.group.id);
            }
        }
    },[])

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
                setUserName(userObject.username)
            } else {
                setUserId(111);  // Если userId не найден, используем 111 по умолчанию
                setUserName('you')
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
                const isPlayer1 = player1.id === userId;
                const opponentClan = isPlayer1 ? data.player1.Group : data.player2.Group;
                setOppClan(opponentClan);
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
        } else if (timer === 0 && playerChoice !== 0 && opponentChoice !== 0) {
            showGifSequence();
        } else if (timer === 0) {
            // Если время вышло и игрок не сделал выбор, отправляем answer: 0
            if (playerChoice === 10) {
                handlePlayerChoiceTimeout();  // Отправляем 0 как ответ
            }
        }
        return () => clearTimeout(timerId);
    }, [timer, round, isLoadingPvp]);

    // Обработка выбора игрока (если игрок не сделал выбор)
    const handlePlayerChoiceTimeout = () => {
        console.log('Тайм-аут: Отправляем ответ 0 на сервер');
        sendAnswerToServer(10); // Отправляем ответ 0 как выбор игрока
    };

    // Функция для отправки ответа игрока на сервер
    const sendAnswerToServer = async (choice) => {
        if (!sessionId) {
            return;
        }
        try {
            const response = await fetch(`https://supavpn.lol/game/answer?profileId=${userId || 111}&sessionId=${sessionId}&answer=${choice}`);
            const data = await response.json();
            handleRoundResult(data); // Обрабатываем результат раунда на основе ответа от сервера
        } catch (error) {
            console.error('Ошибка при запросе /game/answer:', error);
        }
    };

    // Функция для отправки ответа и ожидания результата
    const handlePlayerChoice = (choice) => {
        console.log('clicked playerChoice', playerChoice)
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }
        if (gameOver || playerChoice !== 0) return;
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

        if (timer === 0 && userAnswer !== null && opponentAnswer !== null) {
            showGifSequence(); // Показываем анимацию
        }

        if (result === 0) {
            console.log('Ничья!');
        } else if (result === 1 && victory === userId) {
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
        const durations = [0, 1000];
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
        setPlayerChoice(10);
        setOpponentChoice(10);
        setTimer(5);
        setVisibleImage(0);
        setRound(prev => prev + 1);
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
                                        {opponentChoice === 3 && (
                                            <img
                                                className={styles.choose}
                                                src={rockAnim}
                                                alt="Third"
                                            />
                                        )}
                                        {opponentChoice === 1 && (
                                            <img
                                                className={styles.choose}
                                                src={papAnim}
                                                alt="Third"
                                            />
                                        )}
                                        {opponentChoice === 2 && (
                                            <img
                                                className={styles.choose}
                                                src={scisAnim}
                                                alt="Third"
                                            />
                                        )}
                                    </>
                                )}
                                {visibleImage === 2 && (
                                    <>
                                        {opponentChoice === 3 && (
                                            <Image
                                                width={90}
                                                height={190}
                                                className={styles.choose}
                                                src={gameOptions[3].logo}
                                                alt="Third"
                                            />
                                        )}
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
                                        {playerChoice === 3 && (
                                            <img
                                                className={styles.mychoose}
                                                src={rockAnim}
                                                alt="Third"
                                            />
                                        )}
                                        {playerChoice === 1 && (
                                            <img
                                                className={styles.mychoose}
                                                src={papAnim}
                                                alt="Third"
                                            />
                                        )}
                                        {playerChoice === 2 && (
                                            <img
                                                className={styles.mychoose}
                                                src={scisAnim}
                                                alt="Third"
                                            />
                                        )}
                                    </>
                                )}
                                {visibleImage === 2 && (
                                    <>
                                        {playerChoice === 3 && (
                                            <Image
                                                width={90}
                                                height={190}
                                                className={styles.mychoose}
                                                src={gameOptions[3].logo}
                                                alt="Third"
                                            />
                                        )}
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
                                    </>
                                )}
                            </div>
                            <div className={styles.round}>
                                round {round}
                            </div>
                            <div className={styles.buttonSet}>
                                <PaperPVPbtn onClick={() => handlePlayerChoice(1)} choose={playerChoice} />
                                <RockPvpBtn onClick={() => handlePlayerChoice(3)} choose={playerChoice} />
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
        {(score >= 1) ? <Image src={cross} alt={''} width={55} height={55}  /> : <Image src={heart} alt={''} width={55} height={55}  />}
        {(score >= 2) ? <Image src={cross} alt={''} width={55} height={55}  /> : <Image src={heart} alt={''} width={55} height={55}  />}
        {(score >= 3) ? <Image src={cross} alt={''} width={55} height={55}  /> : <Image src={heart} alt={''} width={55} height={55}  />}
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

