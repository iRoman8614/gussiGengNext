import {useEffect, useState} from "react";
import Image from "next/image";
import {useRouter} from "next/router";
import { toast } from 'react-toastify';
import {useTranslation} from "react-i18next";
import {useInit} from "@/context/InitContext";
import {useFarmCollect, useProfileInit, useUpdateGroup} from "@/utils/api";

import teamData from '@/mock/teamsData'

import styles from '@/styles/Change.module.scss'
import instance from "@/utils/axios";

const bg = "/backgrounds/randomBG.png"
const dialog = "/random/dialog.png"
const person = "/random/person.png"
const hand = "/random/hand.png"
const greenCard = "/random/greenCard.png"
const blueCard = "/random/blueCard.png"
const yellowCard = "/random/yellowCard.png"
const redCard = "/random/redCard.png"
const money = "/money.png"

export default function Page() {
    const router = useRouter();
    const { t } = useTranslation();
    const { collectAndStart } = useFarmCollect();
    const { groupId, coins, updateContext } = useInit();
    const[showPopUp, setShowPopUp] = useState(false)
    const[choose, setChoose] = useState(null)
    const[data, setData] = useState(null)

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

    const { updateGroupData, data: updatedGroup, loading, error } = useUpdateGroup();

    const userTeam = groupId
    const cards = [
        { id: 1, logo: greenCard },
        { id: 2, logo: blueCard },
        { id: 3, logo: yellowCard },
        { id: 4, logo: redCard }
    ];

    const availableTeams = cards.filter(card => card.id !== userTeam);
    const handleClick = (num) => {
        setChoose(num)
        setShowPopUp(true)
    }

    const closePopUp = () => {
        setShowPopUp(false)
    }

    const { fetchProfileInit } = useProfileInit(token);

    const changeClan = async () => {
        if (coins < 1000000) {
            toast.error(t('change.noMoney'));
            return;
        }
        if (typeof window !== "undefined") {
            const authToken = localStorage.getItem('authToken');
        }

        try {
            const response = await instance.get(`/profile/update-group?groupId=${choose}`);
            const { group } = response.data;
            const initData = JSON.parse(localStorage.getItem('init')) || {};
            const updatedInitData = {
                ...initData,
                groupId: group.id
            };
            localStorage.setItem('init', JSON.stringify(updatedInitData));
            setData(response.data);
            try {
                await fetchProfileInit()
                await collectAndStart();
            } catch (collectErr) {
                console.error('Error during collect and start:', collectErr);
            }
            toast.success("Clan changed successfully");
            updateContext();
            router.push('/main');
        } catch (err) {
            console.log(err);
            toast.error("You can change your clan only once every 5 days");
        }
    };



    return(
        <div className={styles.root}>
            <Image className={styles.bg} src={bg} alt={''} width={450} height={968} loading="lazy" />
            <div className={styles.container}>
                <div className={styles.dialog}>
                    <Image className={styles.dialogImage} src={dialog} alt={''} width={240} height={120} loading="lazy" />
                    <div className={styles.dialogText}>{t('change.destiny')}</div>
                </div>
                <Image className={styles.person} src={person} alt={''} width={450} height={968} loading="lazy" />
                <div className={styles.cardSet}>
                    {availableTeams.map((team, index) => {
                        const cardClass = styles[`oneCard${index + 1}`];
                        return(
                            <Image
                                key={index}
                                src={team?.logo}
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
                <Image className={styles.hand} src={hand} alt={''} width={450} height={404} loading="lazy" />
                <Image className={styles.myClan} src={cards[userTeam-1]?.logo} alt={''} width={200} height={340} loading="lazy" />
            </div>
            {showPopUp && <div className={styles.popUp}>
                <div className={styles.popUpTitle}>{t('change.sure')}</div>
                <div className={styles.popUpClose} onClick={closePopUp}>x</div>
                <div className={styles.popUpContainer}>
                    <div className={styles.popUpLabel}>{t('change.join')} <p>&quot;{teamData[choose].Name}&quot;?</p></div>
                    <Image className={styles.popUpIcon} src={teamData[choose]?.logo} alt={''} width={100} height={100} loading="lazy"/>
                    <div className={styles.popUpSum}>
                        - 1 000 000
                        {' '}<Image src={money} alt={''} width={21} height={21} loading="lazy"/>
                    </div>
                </div>
                <button className={styles.popUpConfirm} onClick={changeClan}><Timer /></button>
            </div>}
        </div>
    )
}

const Timer = () => {
    const { t } = useTranslation();
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
    useEffect(() => {
        const init = JSON.parse(localStorage.getItem('init'));
        if (!init) return;
        const calculateTimeLeft = () => {
            const lastUpdateDate = new Date(init.lastUpdate);
            const now = new Date();
            const fiveDaysLater = new Date(lastUpdateDate.getTime() + 5 * 24 * 60 * 60 * 1000);

            const timeDifference = fiveDaysLater - now;

            if (timeDifference > 0) {
                const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                setTimeLeft({ days, hours, minutes });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0 });
            }
        };
        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 60000);
        return () => clearInterval(timer);
    }, []);
    return (
        <div>
            {timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0 ? (
                <>
                    {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m
                </>
            ) : (
                <>{t('change.confirm')}</>
            )}
        </div>
    );
};