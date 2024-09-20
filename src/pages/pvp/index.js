import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from 'next/router';

import { IconButton } from "../../components/buttons/icon-btn/IconButton.jsx";
import {LoaderGif} from "../../components/loader/LoaderGif.jsx";
import {PaperPVPbtn} from "../../components/buttons/paperPVPbtn/PaperPVPbtn.jsx";
import {RockPvpBtn} from "../../components/buttons/rockPvpBtn/RockPvpBtn.jsx";
import {ScicPvpBtn} from "../../components/buttons/scicPVPbtn/ScicPVPbtn.jsx";
import teamData from '../../mock/teamsData.js';
import { gameOptions } from '../../mock/optionData';

import styles from '../../styles/Pvp.module.scss';

const wins = '/wins.png';
const start = '/game-icons/animation_hand_start.gif';
const rockAnim = '/game-icons/animation_hand_rock.gif';
const scisAnim = '/game-icons/animation_hand_sci.gif';
const papAnim = '/game-icons/animation_hand_pap.gif';
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

    const [isLoadingPvp, setIsLoadingPvp] = useState(true);

    // useEffect(() => {
    //     if (typeof window !== 'undefined') {
    //         const search = window.Telegram.WebApp.initData;
    //         const urlParams = new URLSearchParams(search);
    //         const userParam = urlParams.get('user');
    //         const decodedUserParam = decodeURIComponent(userParam);
    //         const userObject = JSON.parse(decodedUserParam);
    //         const userTG = userObject.username;
    //         setUserName(userTG);
    //     }
    // }, []);

    // useEffect(() => {
    //     if (teamId !== null) {
    //         const randomOpponentTeamId = getRandomTeamIdExceptCurrent(teamId, Object.keys(teamData).length);
    //         setOpponentTeamId(randomOpponentTeamId);
    //     }
    // }, [teamId]);

    useEffect(() => {
        let timerId;
        if (timer > 0 && !gameOver) {
            timerId = setTimeout(() => {
                setTimer(timer - 1);
            }, 1000);
        } else if (timer === 0 && playerChoice !== null) {
            const randomOpponentChoice = getRandomOption();
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
        const durations = [0, 1000, 1000];
        durations.forEach((duration, index) => {
            timeouts.push(
                setTimeout(() => {
                    setVisibleImage(index + 1);
                }, duration)
            );
        });
        return () => timeouts.forEach(timeout => clearTimeout(timeout));
    };

    // const handlePlayerChoice = (choice) => {
    //     if (window.Telegram?.WebApp?.HapticFeedback) {
    //         window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
    //     }
    //     if (gameOver || playerChoice !== null) return;
    //     setPlayerChoice(choice);
    // };

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
            router.push('/');
        }, 2000);
    };

    const resetRoundAfterDelay = () => {
        setPlayerChoice(null);
        setOpponentChoice(null);
        setTimer(5);
        setVisibleImage(0);
        setRound(prev => prev + 1);
    };

    return (
        <>
            {!isLoadingPvp ? (
                <LoaderGif />
            ) : (
                <>
                    {gameEnded && <WinningScreen userName={userName} playerScore={playerScore} />}
                    <div className={styles.root}>
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
                                {visibleImage === 3 && (
                                    <>
                                        {opponentChoice === 0 && (
                                            <Image
                                                width={90}
                                                height={190}
                                                className={styles.choose}
                                                src={gameOptions[0].logo}
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
                            <VictoryCounter score={opponentScore} />
                            <IconButton image={teamData[1].logo} alt={'gang'} />
                            <div className={styles.roundTimer}>
                                <div className={styles.time}>{timer}</div>
                            </div>
                            <IconButton image={teamData[opponentTeamId].logo} alt={'gang'} />
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
                                {visibleImage === 3 && (
                                    <>
                                        {playerChoice === 0 && (
                                            <Image
                                                width={90}
                                                height={190}
                                                className={styles.mychoose}
                                                src={gameOptions[0].logo}
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
                                <PaperPVPbtn onClick={() => setPlayerChoice(1)} choose={playerChoice} />
                                <RockPvpBtn onClick={() => setPlayerChoice(0)} choose={playerChoice} />
                                <ScicPvpBtn onClick={() => setPlayerChoice(2)} choose={playerChoice} />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
function getRandomOption() {
    return Math.floor(Math.random() * 3);
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
            <Image width={42} height={53}
                className={styles.lampOn}
                src={initialImages[currentImage]}
                alt="on"
            />
        </div>
    );
};
