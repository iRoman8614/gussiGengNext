import {useEffect, useState} from "react";
import { useRouter } from 'next/router';
import { IconButton } from "../buttons/icon-btn/IconButton.jsx";
import { BigButton } from "../buttons/big-btn/BigButton.jsx";
import {useTranslation} from "react-i18next";

import styles from './NavBar.module.scss';
import Image from "next/image";

const upgrades = '/main-buttons/upgrades.png'
const hands = '/main-buttons/hands.png'
const friends = '/main-buttons/friends.png'
const bag = '/main-buttons/bag.png'
const FAQ = '/main-buttons/FAQ.png'

export const NavBar = () => {
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
        // <div className={styles.root}>
        //     <IconButton image={bag} alt={'items'} title={t('main.items')} hidden={true} onClick={() => {router.push('/main')}} />
        //     <IconButton image={upgrades} alt={'upgrades'} title={t('main.exp')} onClick={() => {router.push('/upgrades')}} />
        //     <BigButton image={hands} alt={'pvp'} title={t('main.pvp')} onClick={() => {router.push(move)}} />
        //     <IconButton image={friends} alt={'friends'} title={t('main.friends')} onClick={() => {router.push('/friends')}} />
        //     <IconButton image={FAQ} alt={'home'} title={t('main.tasks')} onClick={() => {router.push('/tasks')}} />
        // </div>
        <div className={styles.root}>
            <div className={styles.smallElem1}>
                <Image width={60} height={40} className={styles.image} src={bag} alt={''} />
                <div className={styles.title}>
                    {t('main.items')}
                </div>
            </div>
            <div className={styles.smallElem2}>
                <Image width={60} height={40} className={styles.image} src={upgrades} alt={''} />
                <div className={styles.title}>
                    {t('main.exp')}
                </div>
            </div>
            <div className={styles.bigElem}>
                <Image width={60} height={40} className={styles.imageBig} src={hands} alt={''} />
                <div className={styles.title}>
                    {t('main.pvp')}
                </div>
            </div>
            <div className={styles.smallElem3}>
                <Image width={60} height={40} className={styles.image} src={friends} alt={''} />
                <div className={styles.title}>
                    {t('main.friends')}
                </div>
            </div>
            <div className={styles.smallElem4}>
                <Image width={60} height={40} className={styles.image} src={FAQ} alt={''} />
                <div className={styles.title}>
                    {t('main.tasks')}
                </div>
            </div>
        </div>
    );
};