import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import { useRouter } from 'next/router';
import { IconButton } from "@/components/buttons/icon-btn/IconButton.jsx";
import {PvpBtn} from "@/components/buttons/PvpBtn/PvpBtn";
import {useTriggerBotGame} from "@/utils/api";
import {useInit} from "@/context/InitContext";
import teamData from '@/mock/teamsData.js';
import gangsterNames from '@/mock/gangstersNames.js'
import { gameOptions } from '@/mock/optionData';

import styles from '@/styles/Pvp.module.scss';
import "react-toastify/dist/ReactToastify.css";

const wins = '/wins.png';
const lose = '/lose.png'
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
const changerF = '/game-icons/roundAnimFront.png'
const changerB = '/game-icons/roundAnimBack.png'

export default function PvpBotPage() {
    const router = useRouter();
    const { groupId, updateContext } = useInit();
    const { triggerBotGame } = useTriggerBotGame();
    const [visibleImage, setVisibleImage] = useState(0);
    const [playerScore, setPlayerScore] = useState(0);
    const [opponentScore, setOpponentScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [timer, setTimer] = useState(3);
    const [playerChoice, setPlayerChoice] = useState(null);
    const [opponentChoice, setOpponentChoice] = useState(3);
    const [gameEnded, setGameEnded] = useState(false);
    const [userName, setUserName] = useState('you');
    const [oppClan, setOppClan] = useState(null);
    const [opponentName, setOpponentName] = useState("biggie smalls")
    const [resetSequence, setResetSequence] = useState(false);
    const [showChanger, setShowChanger] = useState(false)

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
        updateContext()
    }, []);

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
        if (timer > 0 && !gameOver) {
            timerId = setTimeout(() => {
                if (window.Telegram?.WebApp?.HapticFeedback) {
                    window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
                }
                setTimer(timer - 1);
            }, 1000);
        } else if (timer === 0 && playerChoice !== null) {
            const randomOpponentChoice = getRandomOption();
            setOpponentChoice(randomOpponentChoice);
            showGifSequence();
            setTimeout(() => {
                updateScores(playerChoice, randomOpponentChoice)
            }, 2000);
        }
        return () => clearTimeout(timerId);
    }, [timer, gameOver, playerChoice]);

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
        return () => timeouts.forEach(timeout => clearTimeout(timeout));
    };

    const updateScores = (playerMoveIndex, opponentMoveIndex) => {
        const playerMove = gameOptions[playerMoveIndex].name;
        const opponentMove = gameOptions[opponentMoveIndex].name;

        if (playerMove === opponentMove) {
            // Ничья — обновляем раунд сразу после анимации
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
            router.push('/main');
        }, 2000);
    };
    const endBotGame = async (vin) => {
        try {
            await triggerBotGame(vin);
        } catch (e) {
            console.log(e)
        }
    }

    const resetRoundAfterDelay = () => {
        setPlayerChoice(null);
        setOpponentChoice(null);
        setTimer(3);
        setVisibleImage(0);
        setResetSequence(!resetSequence);
        setShowChanger(false)
    };

    return (
        <>
            {gameEnded && <WinningScreen userName={userName} playerScore={playerScore} />}
            <div className={styles.root}>
                <Image className={styles.background} src={background} width={300} height={1000} alt={'bg'} priority />
                <div className={styles.container}>
                    <div className={styles.oppNickname}>
                        {opponentName}
                    </div>
                    <div className={styles.optionBg}>
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
                                ? gameOptions[4]?.logo
                                : opponentChoice === 0 || opponentChoice === 10
                                    ? gameOptions[4]?.logo
                                    : opponentChoice === 1
                                        ? gameOptions[1]?.logo
                                        : opponentChoice === 2
                                            ? gameOptions[2]?.logo
                                            : gameOptions[3]?.logo
                        }
                            alt="game choice"
                        />
                    </div>
                    <VictoryCounter score={playerScore} />
                    <IconButton image={teamData[groupId]?.logo} alt={'gang'} />
                    <div className={styles.roundTimer}>
                        <Image src={timerBG} alt={'timer'} height={144} width={144} className={styles.roundTimerBG} />
                        <div className={styles.time}>{timer}</div>
                    </div>
                    <IconButton image={teamData[oppClan]?.logo} alt={'gang'} />
                    <VictoryCounter score={opponentScore} />
                    <div className={styles.optionBg}>
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
                        />
                    </div>
                    <div className={styles.round}>
                        round {playerScore+opponentScore+1}
                    </div>
                    <div className={styles.buttonSet}>
                        <PvpBtn title={'rock'} img={rock} value={1} onClick={() => setPlayerChoice(1)} choose={playerChoice} />
                        <PvpBtn title={'paper'} img={paper} value={2} onClick={() => setPlayerChoice(2)} choose={playerChoice} />
                        <PvpBtn title={'scissons'} img={scis} value={3} onClick={() => setPlayerChoice(3)} choose={playerChoice} />
                    </div>
                </div>
            </div>
            {showChanger && <RoundChanger round={playerScore + opponentScore + 1}/>}
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
        {(score >= 1) ? <Image className={styles.heart} src={cross} alt={''} width={55} height={55}  /> : <Image className={styles.heart} src={heart} alt={''} width={55} height={55}  />}
        {(score >= 2) ? <Image className={styles.heart} src={cross} alt={''} width={55} height={55}  /> : <Image className={styles.heart} src={heart} alt={''} width={55} height={55}  />}
        {(score >= 3) ? <Image className={styles.heart} src={cross} alt={''} width={55} height={55}  /> : <Image className={styles.heart} src={heart} alt={''} width={55} height={55}  />}
    </div>
);

// eslint-disable-next-line react/prop-types
const WinningScreen = ({ userName, playerScore  }) => (
    <div className={styles.winbg}>
        <div className={styles.winBorder}>
            <div className={styles.winContainer}>
                <div className={styles.winnerName}>
                    {playerScore === 3 && userName}
                </div>
                {playerScore === 3
                    ?
                    <Image width={204} height={151} className={styles.winsImage} src={wins} alt={'wins'}  />
                    :
                    <Image width={204} height={204} className={styles.winsImage} src={lose} alt={'you lose'} />
                }
                {playerScore === 3 ? <p className={styles.winnerName}>+5% farm </p> : <p></p>}
            </div>
        </div>
    </div>
);


const RoundChanger = ({round}) => (
    <div className={styles.changerRoot}>
        <div className={styles.changerContainer}>
            <Image className={styles.animF} src={changerF} alt={''} width={700} height={150} />
            <Image className={styles.animB} src={changerB} alt={''} width={700} height={150} />
            <div className={styles.changerText}>round {round}</div>
        </div>
    </div>
)
