import React from 'react';
import styles from './ItemPlaceholder.module.scss';

export const ItemPlaceholder = ({ item, img, onClick }) => {
    const handleClick = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }
        onClick();
    };

    return (
        <>
            <div className={styles.root} onClick={handleClick}>
                <div>
                    <Image className={styles.image} width={230} height={150} alt={''} src={img} />
                </div>
                <div className={styles.title}>Cost: {item.Cost}</div>
            </div>
        </>
    );
};
