import {IconButton} from "../buttons/icon-btn/IconButton.jsx";
import {BigButton} from "../buttons/big-btn/BigButton.jsx";

import home from '../../../public/main-buttons/home.png'
import upgrades from '../../../public/main-buttons/upgrades.png'
import hands from '../../../public/main-buttons/hands.png'
import friends from '../../../public/main-buttons/friends.png'
import bag from '../../../public/main-buttons/bag.png'

import styles from './NavBar.module.scss'

export const NavBar = () => {
    const handleClick = () => {
        console.log('Navigating to /pvp');
    };

    return(
        <div className={styles.root}>
            <IconButton image={home} alt={'home'} title={'home'} />
            <IconButton image={upgrades} alt={'upgrades'} title={'exp'} />
            <BigButton image={hands} alt={'pvp'} title={'pvp'} onClick={handleClick} />
            <IconButton image={friends} alt={'friends'} title={'friends'} />
            <IconButton image={bag} alt={'items'} title={'items'} />
        </div>
    )
}