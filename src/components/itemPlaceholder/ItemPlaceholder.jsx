import Image from "next/image";

import styles from './ItemPlaceholder.module.scss';
import {formatNumber} from "@/utils/formatNumber";

const money = '/money.png'
const Lock = '/Lock.png'

// eslint-disable-next-line react/prop-types
export const ItemPlaceholder = ({ item, img, onClick, available }) => {
    const handleClick = () => {
        if (available) {
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
            }
            onClick();
        }
    };

    return (
        <div className={available ? styles.root: styles.hidden} onClick={handleClick}>
            <div className={styles.imageContainer}>
                <Image className={styles.image} width={260} height={170} alt="" src={img} priority />
                <div className={styles.level}>lvl {item.level}</div>
                <div className={styles.per}>+{item.increasePer}%</div>
                {!available && <Image className={styles.lock} width={70} height={70} alt="" src={Lock} priority/>}
                {!available && <div className={styles.lock}>
                    <Image width={70} height={70} alt="" src={Lock} priority/>
                    <div className={styles.lockDesk}>Requires lvl 10 of the prev card</div>
                </div>}
            </div>
            <div className={styles.title}>
                {formatNumber(Number(item.cost))}{' '}
                <Image src={money} alt="" width={15} height={15} />
            </div>
        </div>
    );
};