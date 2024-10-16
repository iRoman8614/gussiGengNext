import React from 'react';
import Image from "next/image";

import styles from './ItemPlaceholder.module.scss';

const money = '/money.png'
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
                <div className={styles.imageContainer}>
                    <Image className={styles.image} width={230} height={150} alt={''} src={img} />
                </div>
                <div className={styles.title}>{item.Cost}<Image src={money} alt={''} width={21} height={21} /></div>
            </div>
        </>
    );
};
