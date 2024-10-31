import {useCallback, useEffect, useState} from "react";
import Image from "next/image";
import {useRouter} from "next/router";
import { toast } from 'react-toastify';

import teamData from '@/mock/teamsData'
import axiosInstance from "@/utils/axios";

import styles from '@/styles/Change.module.scss'

const bg = '/backgrounds/randomBG.png'
const dialog = '/random/dialog.png'
const person = '/random/person.png'
const hand = '/random/hand.png'
const money = '/money.png'

export default function Page() {
    const router = useRouter();
    const[showPopUp, setShowPopUp] = useState(false)
    const[choose, setChoose] = useState(null)
    const[balance, setBalance] = useState(0)
    const[teamId, setTeamId] = useState(3)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const init = JSON.parse(localStorage.getItem('init'));
            if (init && init.group) {
                setTeamId(init.group.id);
            }
            const start = JSON.parse(localStorage.getItem('start'));
            if (start) {
                setBalance(start.balance)
            }
        }
    }, []);

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

    const userTeam = teamId
    const cards = [
        {
            id: 1,
            logo: '/random/greenCard.png'
        },
        {
            id: 2,
            logo: '/random/blueCard.png'
        },
        {
            id: 3,
            logo: '/random/yellowCard.png'
        },
        {
            id: 4,
            logo: '/random/redCard.png'
        }
    ]

    const availableTeams = cards.filter(card => card.id !== userTeam);
    const handleClick = (num) => {
        setChoose(num)
        setShowPopUp(true)
    }

    const closePopUp = () => {
        setShowPopUp(false)
    }

    const checkStartData = useCallback(async () => {
        try {
            const response = await axiosInstance.get(`/farm/start`);
            localStorage.setItem('start', JSON.stringify(response.data));
        } catch (error) {
            console.log(error)
        }
    }, [router]);

    const changeClan = async () => {
        if (balance < 1000000) {
            toast.error("You do not have enough money");
            return;
        }
        try {
            const response = await axiosInstance.get(`/profile/update-group?groupId=${choose}`);
            const data = response.data;
            if(response.status === 400) {
                const errorMessage = "You can change your clan only once every 5 days";
                toast.error(errorMessage);
                return;
            }
            if (data) {
                localStorage.setItem('init', JSON.stringify(data));
                checkStartData()

                router.push('/main');
            } else {
                throw new Error('Invalid data received from the server');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errorMessage = error.response.data.message || "Error during clan change";
                toast.error(errorMessage);
                return;
            }
            toast.error(`You can change your clan only once every 5 days`);
        }
    };

    return(
        <div className={styles.root}>
            <Image className={styles.bg} src={bg} alt={''} width={450} height={968} />
            <div className={styles.container}>
                <div className={styles.dialog}>
                    <Image className={styles.dialogImage} src={dialog} alt={''} width={240} height={120} />
                    <div className={styles.dialogText}>You wanna change your destiny?</div>
                </div>
                <Image className={styles.person} src={person} alt={''} width={450} height={968} />
                <div className={styles.cardSet}>
                    {availableTeams.map((team, index) => {
                        const cardClass = styles[`oneCard${index + 1}`];
                        return(
                            <Image
                                key={index}
                                src={team.logo}
                                alt={''}
                                width={100}
                                height={155}
                                className={
                                    cardClass
                                }
                                priority
                                onClick={() => handleClick(team.id)}
                            />
                        )
                    })}
                    </div>
                <Image className={styles.hand} src={hand} alt={''} width={450} height={404} />
                <Image className={styles.myClan} src={cards[userTeam-1].logo} alt={''} width={200} height={340} />
            </div>
            {showPopUp && <div className={styles.popUp}>
                <div className={styles.popUpTitle}>are you sure?</div>
                <div className={styles.popUpClose} onClick={closePopUp}>x</div>
                <div className={styles.popUpContainer}>
                    <div className={styles.popUpLabel}>wanna join the <p>&quot;{teamData[choose].Name}&quot;?</p></div>
                    <Image className={styles.popUpIcon} src={teamData[choose].logo} alt={''} width={100} height={100}/>
                    <div className={styles.popUpSum}>
                        - 1 000 000
                        {' '}<Image src={money} alt={''} width={21} height={21}/>
                    </div>
                </div>
                <button className={styles.popUpConfirm} onClick={changeClan}>confirm</button>
            </div>}
        </div>
    )
}