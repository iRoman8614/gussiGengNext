import {useEffect, useState} from "react";
import { useRouter } from 'next/router';
import Image from "next/image";
import {useTranslation} from "react-i18next";

import styles from './NavBar.module.scss';

const upgrades = '/main-buttons/upgrades.png'
const hands = '/main-buttons/hands.png'
const friends = '/main-buttons/friends.png'
const bag = '/main-buttons/bag.png'
const FAQ = '/main-buttons/FAQ.png'

export const NavBar = ({clickItem}) => {
    const router = useRouter();
    const { t } = useTranslation();
    const [move, setMove] = useState('/lobby')

    useEffect(() => {
        if(typeof window !== "undefined") {
            const faq = localStorage.getItem('pvpfaq')
            if(faq !== 'true') {
                setMove('/faq/pvp')
            }
        } else {
            return 0
        }
    })

    return (
        <div className={styles.root}>
            <div className={styles.smallElem1} onClick={clickItem}>
                <Image width={60} height={40} className={styles.image} src={bag} alt={''} />
                <div className={styles.title}>
                    {t('main.items')}
                </div>
            </div>
            <div className={styles.smallElem2} onClick={() => {router.push('/upgrades')}}>
                <Image width={60} height={40} className={styles.image} src={upgrades} alt={''} />
                <div className={styles.title}>
                    {t('main.exp')}
                </div>
            </div>
            <div className={styles.bigElem} onClick={() => {router.push('/lobby')}}>
                <Image width={60} height={40} className={styles.imageBig} src={hands} alt={''} />
                <div className={styles.title}>
                    {t('main.pvp')}
                </div>
            </div>
            <div className={styles.smallElem3} onClick={() => {router.push('/friends')}}>
                <Image width={60} height={40} className={styles.image} src={friends} alt={''} />
                <div className={styles.title}>
                    {t('main.friends')}
                </div>
            </div>
            <div className={styles.smallElem4} onClick={() => {router.push('/tasks')}}>
                <Image width={60} height={40} className={styles.image} src={FAQ} alt={''} />
                <div className={styles.title}>
                    {t('main.tasks')}
                </div>
            </div>
        </div>
    );
};