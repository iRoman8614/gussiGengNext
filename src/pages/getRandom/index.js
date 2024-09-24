import Image from "next/image";
import React from "react";

import styles from '@/styles/Random.module.scss'

const bg = '/backgrounds/randomBG.png'
const person = '/random/person.png'
const dialog = '/random/dialog.png'
export default function Page() {
    return(
        <div className={styles.root}>
            <Image className={styles.bg} src={bg} alt={'bg'} width={450} height={1000} />
            <div className={styles.container}>
                <div className={styles.dialog}>
                    pick a card
                </div>
                {/*<Image src={dialog} className={styles.dialog} width={200} height={100} alt={''} />*/}
                <Image src={person} className={styles.person} width={450} height={800} alt={''} />
            </div>
        </div>
    )
}