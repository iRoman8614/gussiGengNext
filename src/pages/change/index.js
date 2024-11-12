import {useEffect, useState} from "react";
import Image from "next/image";
import {useRouter} from "next/router";
import { toast } from 'react-toastify';
import {useTranslation} from "react-i18next";
import {useInit} from "@/context/InitContext";
import {useUpdateGroup} from "@/utils/api";

import teamData from '@/mock/teamsData'

import styles from '@/styles/Change.module.scss'

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
    const { groupId, coins, updateContext } = useInit();
    const[showPopUp, setShowPopUp] = useState(false)
    const[choose, setChoose] = useState(null)

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
    const changeClan = async () => {
        if (coins < 1000000) {
            toast.error(t('change.noMoney'));
            return;
        }
        try {
            await updateGroupData(choose);
            if (loading) return;
            if (error) {
                if (error.response && error.response.status === 400) {
                    toast.error("You can change your clan only once every 5 days");
                    return;
                }
                toast.error("Error during clan change");
                return;
            }
            if (updatedGroup) {
                toast.success("Clan changed successfully");
                updateContext();
                router.push('/main');
            }
        } catch (error) {
            toast.error("Error while changing clan");
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
                <button className={styles.popUpConfirm} onClick={changeClan}>{t('change.confirm')}</button>
            </div>}
        </div>
    )
}