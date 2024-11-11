import { useRouter } from 'next/router';
import { IconButton } from "../buttons/icon-btn/IconButton.jsx";
import { BigButton } from "../buttons/big-btn/BigButton.jsx";
import {useTranslation} from "react-i18next";
import {useCachedAssets} from '@/utils/cache'

const assetPaths = {
    upgrades: '/main-buttons/upgrades.png',
    hands: '/main-buttons/hands.png',
    friends: '/main-buttons/friends.png',
    bag: '/main-buttons/bag.png',
    FAQ: '/main-buttons/FAQ.png'
};
import styles from './NavBar.module.scss';

export const NavBar = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const cachedAssets = useCachedAssets(assetPaths, 'assets-cache-icons');

    return (
        <div className={styles.root}>
            <IconButton image={cachedAssets.bag} alt={'items'} title={t('main.items')} hidden={true} onClick={() => {router.push('/main')}} />
            <IconButton image={cachedAssets.upgrades} alt={'upgrades'} title={t('main.exp')} onClick={() => {router.push('/upgrades')}} />
            <BigButton image={cachedAssets.hands} alt={'pvp'} title={t('main.pvp')} onClick={() => {router.push('/lobby')}} />
            <IconButton image={cachedAssets.friends} alt={'friends'} title={t('main.friends')} onClick={() => {router.push('/friends')}} />
            <IconButton image={cachedAssets.FAQ} alt={'home'} title={t('main.faq')} onClick={() => {router.push('/faq/home')}} />
        </div>
    );
};