import Image from "next/image";

import styles from './ItemPlaceholder.module.scss';

const money = '/money.png'

// eslint-disable-next-line react/prop-types
export const ItemPlaceholder = ({ item, img, onClick }) => {
    const handleClick = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
        onClick();
    };

    return (
        <div className={styles.root} onClick={handleClick}>
            <div className={styles.imageContainer}>
                <Image className={styles.image} width={260} height={170} alt="" src={img} priority />
                <div className={styles.level}>lvl {item.level}</div>
                <div className={styles.per}>+{item.increasePer}%</div>
            </div>
            <div className={styles.title}>
                {item.cost}{' '}
                <Image src={money} alt="" width={15} height={15} />
            </div>
        </div>
    );
};