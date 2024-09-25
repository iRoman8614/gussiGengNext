import Image from "next/image";
import React, {useEffect, useState} from "react";

import styles from '@/styles/Random.module.scss'

const bg = '/backgrounds/randomBG.png'
const person = '/random/person.png'
const hand = '/random/hand.png'
const card = '/random/card.png'
const dialog = '/random/dialog.png'
const greenCard = '/random/greenCard.png'
const blueCard = '/random/blueCard.png'
const yellowCard = '/random/yellowCard.png'
const redCard = '/random/redCard.png'

export default function Page() {
    const [showCard, setShowCard] = useState(false)
    const [teamId, setTeamId] = useState(1)

    useEffect(() => {
        if (typeof window !== "undefined") {
            // Получаем init из localStorage
            const init = JSON.parse(localStorage.getItem("init"));
            if (init && init.group) {
                setTeamId(init.group.id); // Устанавливаем команду
            }
        }
        }, [])

    const ShownCard = ({state, teamId}) => {
        return(
            <div className={state ? styles.shown : styles.hidden}>
                {teamId === 1 && <Image className={styles.cardImage1} src={greenCard} alt={''} width={200} height={340} />}
                {teamId === 2 && <Image className={styles.cardImage2} src={blueCard} alt={''} width={200} height={340} />}
                {teamId === 3 && <Image className={styles.cardImage3} src={yellowCard} alt={''} width={200} height={340} />}
                {teamId === 4 && <Image className={styles.cardImage4} src={redCard} alt={''} width={200} height={340} />}
            </div>
        )
    }

    return(
        <div className={styles.root}>
            <Image className={styles.bg} src={bg} alt={'bg'} width={450} height={1000} />
            <div className={styles.dialog}>
                <Image src={dialog} className={styles.dialogImage} width={200} height={100} alt={''} />
                <div className={styles.text}>pick a card</div>
            </div>
            <Image src={person} className={styles.person} width={450} height={1000} alt={''} />
            <Image src={card} className={styles.card} width={450} height={1000} alt={''} onClick={() => {setShowCard(true)}} />
            <Image src={hand} className={styles.hand} width={450} height={1000} alt={''} />
            <ShownCard state={showCard} teamId={teamId} />
        </div>
    )
}