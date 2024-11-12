import { useRouter } from 'next/router';
import { IconButton } from "../buttons/icon-btn/IconButton.jsx";
import { BigButton } from "../buttons/big-btn/BigButton.jsx";
import {useTranslation} from "react-i18next";

import styles from './NavBar.module.scss';

const upgrades = '/main-buttons/upgrades.png'
const hands = '/main-buttons/hands.png'
const friends = '/main-buttons/friends.png'
const bag = '/main-buttons/bag.png'
const FAQ = '/main-buttons/FAQ.png '

export const NavBar = () => {
    const router = useRouter();
    const { t } = useTranslation();

    return (
        <div className={styles.root}>
            <IconButton image={bag} alt={'items'} title={t('main.items')} hidden={true} onClick={() => {router.push('/main')}} />
            <IconButton image={upgrades} alt={'upgrades'} title={t('main.exp')} onClick={() => {router.push('/upgrades')}} />
            <BigButton image={hands} alt={'pvp'} title={t('main.pvp')} onClick={() => {router.push('/lobby')}} />
            <IconButton image={friends} alt={'friends'} title={t('main.friends')} onClick={() => {router.push('/friends')}} />
            <IconButton image={FAQ} alt={'home'} title={t('main.faq')} onClick={() => {router.push('/faq/home')}} />
        </div>
    );
};