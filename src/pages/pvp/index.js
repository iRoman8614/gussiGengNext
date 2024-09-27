import {useEffect, useRef, useState} from "react";
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


    // Реф для хранения предзагруженных GIF-файлов
    const gifCache = useRef({});

    // Предзагрузка GIF-файлов
    const preloadGifs = () => {
        const cache = {};
        if (typeof window !== 'undefined') {
            Object.keys(gifPaths).forEach(key => {
                const img = new window.Image();
                img.src = gifPaths[key];
                cache[key] = img;
                console.log(`Загружен ${key}: ${img.src}`);
            });
        }
        return cache;
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            gifCache.current = preloadGifs();
        }
    }, []);

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
                setUserName(userObject.username);
            } else {
                setUserId(111);  // Если userId не найден, используем 111 по умолчанию
                setUserName('you');
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
                const isPlayer1 = data.player1.id === userId;
                const userClan = isPlayer1 ? data.player1.group : data.player2.group
                const opponentClan = isPlayer1 ? data.player2.group : data.player1.group;
                setOppClan(opponentClan);
                setUserClan(userClan)
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
            // Если время вышло и игрок не сделал выбор, отправляем answer: 10
            if (playerChoice === 10) {
                handlePlayerChoiceTimeout();
            }
        }
        return () => clearTimeout(timerId);
    }, [timer, round, isLoadingPvp]);

    // Обработка выбора игрока (если игрок не сделал выбор)
    const handlePlayerChoiceTimeout = () => {
        console.log('Тайм-аут: Отправляем ответ 10 на сервер');
        console.log('Отправляем выбор:', choice);
        sendAnswerToServer(10);
    };

    // Функция для отправки ответа игрока на сервер
    const sendAnswerToServer = async (choice) => {
        if (!sessionId) {
            return;
        }
        try {
            console.log('Отправляем выбор:', choice);
            const response = await fetch(`https://supavpn.lol/game/answer?profileId=${userId || 111}&sessionId=${sessionId}&answer=${choice}`);
            const data = await response.json();
            handleRoundResult(data); // Обрабатываем результат раунда на основе ответа от сервера
        } catch (error) {
            console.error('Ошибка при запросе /game/answer:', error);
        }
    };

    // Функция для отправки ответа и ожидания результата
    const handlePlayerChoice = (choice) => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }
        if (gameOver || playerChoice !== 10) return;
        setPlayerChoice(choice);
        console.log('clicked playerChoice', playerChoice)
        const sendAnswer = async () => {
            if (!sessionId) {
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


    // Обработка результата раунда (здесь мы просто сохраняем данные, но не обновляем счёт)
    const handleRoundResult = (data) => {
        const { player1, player2, finished } = data;
        const isPlayer1 = player1.id === userId;

        const userAnswer = isPlayer1 ? player1.answer : player2.answer;
        const opponentAnswer = isPlayer1 ? player2.answer : player1.answer;
        const userVictory = isPlayer1 ? player1.victory : player2.victory;
        const opponentVictory = isPlayer1 ? player2.victory : player1.victory;

        setPlayerChoice(userAnswer);
        setOpponentChoice(opponentAnswer);

        // Сохраняем результаты раунда, но не обновляем счёт
        setRoundResult({ userVictory, opponentVictory });

        // Запуск анимации, если оба игрока сделали выбор
        if (player1.answer !== null && player2.answer !== null) {
            showGifSequence();
        }

        // Если пришел флаг finished: true, завершить игру
        if (finished) {
            handleGameEnd(); // Завершаем игру, если она закончена
        } else {
            // Иначе продолжаем игру, сбрасывая раунд
            setTimeout(() => {
                resetRoundAfterDelay();
            }, 5000);
        }
    };

    // Запуск анимации и обновление счёта после её завершения
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
                setPlayerScore(roundResult.userVictory);
                setOpponentScore(roundResult.opponentVictory);
            }
        }, 2000);

        return () => timeouts.forEach(timeout => clearTimeout(timeout));
    };

    const resetRoundAfterDelay = () => {
        setPlayerChoice(10);
        setOpponentChoice(10);
        setTimer(5);
        setVisibleImage(0);
        setRound(prev => prev + 1);
        setRoundResult(null)
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
                                                src={gifCache.current.rockAnim ? gifCache.current.rockAnim.src : gifPaths.rockAnim}
                                                alt="Third"
                                            />
                                        )}
                                        {opponentChoice === 2 && (
                                            <img
                                                className={styles.choose}
                                                src={gifCache.current.papAnim ? gifCache.current.papAnim.src : gifPaths.papAnim}
                                                alt="Third"
                                            />
                                        )}
                                        {opponentChoice === 3 && (
                                            <img
                                                className={styles.choose}
                                                src={gifCache.current.scisAnim ? gifCache.current.scisAnim.src : gifPaths.scisAnim}
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
                                        {opponentChoice === 1 && (
                                            <img
                                                className={styles.mychoose}
                                                src={gifCache.current.rockAnim ? gifCache.current.rockAnim.src : gifPaths.rockAnim}
                                                alt="Third"
                                            />
                                        )}
                                        {opponentChoice === 2 && (
                                            <img
                                                className={styles.mychoose}
                                                src={gifCache.current.papAnim ? gifCache.current.papAnim.src : gifPaths.papAnim}
                                                alt="Third"
                                            />
                                        )}
                                        {opponentChoice === 3 && (
                                            <img
                                                className={styles.mychoose}
                                                src={gifCache.current.scisAnim ? gifCache.current.scisAnim.src : gifPaths.scisAnim}
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

