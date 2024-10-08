import React, { useState } from 'react';
import styles from './ItemPlaceholder.module.scss';

export const ItemPlaceholder = ({ item, onUpgrade }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className={styles.root} onClick={openModal}>
                {item ? (
                    <>
                        <div className={styles.title}>{item.Name}</div>
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

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>{item.Name}</h2>
                        <p>Cost: {item.Cost}</p>
                        <p>Increase per: {item.IncreasePer}</p>
                        <p>Card level: {item.Level}</p>
                        <div className={styles.modalButtons}>
                            <button className={styles.btnUpgrade} onClick={() => { onUpgrade(); closeModal(); }}>Upgrade</button>
                            <button className={styles.btnClose} onClick={closeModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
