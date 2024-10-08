import React from 'react';
import styles from './ItemPlaceholder.module.scss';

export const ItemPlaceholder = ({ item, onClick }) => {
    return (
        <>
            <div className={styles.root} onClick={onClick}>
                {item ? (
                    <>
                        <div className={styles.title}>
                            {item.type === 'limit' ? `limit +${item.Name}` : `rate +${item.Name}`}
                        </div>
                        <div className={styles.details}>Cost: {item.Cost}</div>
                        <div className={styles.details}>Card level: {item.Level}</div>
                    </>
                ) : (
                    <>
                        <div className={styles.icon}></div>
                        <div className={styles.title}>Item name</div>
                    </>
                )}
            </div>
        </>
    );
};
