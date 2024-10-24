import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import { useRouter } from 'next/router';
import Head from 'next/head';

import { IconButton } from "@/components/buttons/icon-btn/IconButton.jsx";
import {PvpBtn} from "@/components/buttons/PvpBtn/PvpBtn";

import teamData from '@/mock/teamsData.js';
import gangsterNames from '@/mock/gangstersNames.js'
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

export default function PvpBotPage() {
    const router = useRouter();
    const [userId, setUserId] = useState(null);
    const [visibleImage, setVisibleImage] = useState(0);
    const [playerScore, setPlayerScore] = useState(0);
    const [opponentScore, setOpponentScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [round, setRound] = useState(1);
    const [timer, setTimer] = useState(5);
    const [playerChoice, setPlayerChoice] = useState(null);
    const [opponentChoice, setOpponentChoice] = useState(3);
    const [gameEnded, setGameEnded] = useState(false);
    const [userName, setUserName] = useState('you');
    const [userClan, setUserClan] = useState(1);
    const [oppClan, setOppClan] = useState(4);
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
            const randomName = gangsterNames[Math.floor(Math.random() * gangsterNames.length)];
            setOpponentName(randomName)
        }
    }, []);

    useEffect(() => {
        if (userClan !== null) {
            const randomOpponentTeamId = getRandomTeamIdExceptCurrent(userClan, Object.keys(teamData).length);
            setOppClan(randomOpponentTeamId);
        }
    }, [userClan]);

    useEffect(() => {
        let timerId;
        if (timer > 0 && !gameOver) {
            timerId = setTimeout(() => {
                setTimer(timer - 1);
            }, 1000);
        } else if (timer === 0 && playerChoice !== null) {
            const randomOpponentChoice = getRandomOption();
            console.log('randomOpponentChoice', randomOpponentChoice)
            setOpponentChoice(randomOpponentChoice);
            showGifSequence();
            setTimeout(() => {
                updateScores(playerChoice, randomOpponentChoice);
            }, 1000);
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
        } else if (
            (playerMove === 'paper' && opponentMove === 'rock') ||
            (playerMove === 'rock' && opponentMove === 'scis') ||
            (playerMove === 'scis' && opponentMove === 'paper')
        ) {
            setPlayerScore(prev => {
                const newScore = prev + 1;
                if (newScore === 3) {
                    setTimeout(() => handleGameEnd(), 3000);
                }
                return newScore;
            });
        } else {
            setOpponentScore(prev => {
                const newScore = prev + 1;
                if (newScore === 3) {
                    setTimeout(() => handleGameEnd(), 3000);
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

    const handleGameEnd = () => {
        setGameEnded(true);
        setTimeout(() => {
            setGameOver(true);
        }, 3000);
        setTimeout(() => {
            router.push('/main');
        }, 2000);
    };

    const [resetSequence, setResetSequence] = useState(false);

    const resetRoundAfterDelay = () => {
        if(playerChoice !== opponentChoice) {
            setRound(prev => prev + 1);
        }
        setPlayerChoice(null);
        setOpponentChoice(null);
        setTimer(5);
        setVisibleImage(0);
        setResetSequence(!resetSequence);
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
                                <PvpBtn title={'rock'} img={rock} value={1} onClick={() => setPlayerChoice(1)} choose={playerChoice} />
                                <PvpBtn title={'paper'} img={paper} value={2} onClick={() => setPlayerChoice(2)} choose={playerChoice} />
                                <PvpBtn title={'scissons'} img={scis} value={3} onClick={() => setPlayerChoice(3)} choose={playerChoice} />
                            </div>
                        </div>
                    </div>
            </>
        </>
    )
}

function getRandomOption() {
    const result = Math.floor(Math.random() * 3) + 1
    return(result);
}
function getRandomTeamIdExceptCurrent(currentTeamId, totalTeams = 3) {
    const teamIds = Array.from({ length: totalTeams }, (_, i) => i + 1);
    const filteredTeamIds = teamIds.filter(id => id !== currentTeamId);
    const randomIndex = Math.floor(Math.random() * filteredTeamIds.length);
    return filteredTeamIds[randomIndex];
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

