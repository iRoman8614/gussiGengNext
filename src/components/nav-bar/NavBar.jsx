import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { IconButton } from "../buttons/icon-btn/IconButton.jsx";
import { BigButton } from "../buttons/big-btn/BigButton.jsx";
import { toast } from "react-toastify";
import axiosInstance from '@/utils/axios';

const home = '/main-buttons/home.png';
const upgrades = '/main-buttons/upgrades.png';
const hands = '/main-buttons/hands.png';
const friends = '/main-buttons/friends.png';
const bag = '/main-buttons/bag.png';

import styles from './NavBar.module.scss';
import 'react-toastify/dist/ReactToastify.css';

export const NavBar = () => {
    const router = useRouter();

    return (
        <div className={styles.root}>
            <IconButton image={home} alt={'home'} title={'home'} onClick={() => {router.push('/main')}} />
            <IconButton image={upgrades} alt={'upgrades'} title={'exp'} onClick={() => {router.push('/upgrades')}} />
            <BigButton image={hands} alt={'pvp'} title={'pvp'} onClick={() => {router.push('/lobby')}} />
            <IconButton image={friends} alt={'friends'} title={'friends'} onClick={() => {router.push('/friends')}} />
            <IconButton image={bag} alt={'items'} title={'items'} hidden={true} onClick={() => {router.push('/main')}} />
        </div>
    );
};
