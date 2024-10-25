import styles from '@/styles/Change.module.scss'
import Image from "next/image";
import React, {useEffect, useState} from "react";
import { toast } from 'react-toastify';

import teamData from '@/mock/teamsData'
import axiosInstance from "@/utils/axios";
import {useRouter} from "next/router";

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
    const [userId, setUserId] = useState(null);

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

    useEffect(() => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const search = window.Telegram.WebApp.initData;
            const urlParams = new URLSearchParams(search);
            const userParam = urlParams.get('user');
            if (userParam) {
                const decodedUserParam = decodeURIComponent(userParam);
                const userObject = JSON.parse(decodedUserParam);
                setUserId(userObject.id);
            } else {
                setUserId(111);
            }
        }
    }, []);

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

    const changeClan = async () => {
        if(balance < 1000000) {
            toast.error("you do not have enough money");
        } else {
            try {
                const response = await axiosInstance.get(`/profile/update_group?groupId=${choose}`)
                    .then(
                        await axiosInstance.get(`/profile/init?profileId=${userId}`)
                            .then(initResponse => {
                                const data = initResponse.data;
                                const initData = {
                                    group: data.group,
                                    farm: data.farm,
                                    balance: data.balance,
                                };
                                localStorage.setItem('init', JSON.stringify(initData));
                            }).then(router.push('/main'))
                    )
                console.log('response', response)
            } catch (e) {
                toast.error(e)
            }
        }
    }

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
                <button className={styles.popUpConfirm} onClick={changeClan}>cofirm</button>
            </div>}
        </div>
    )
}