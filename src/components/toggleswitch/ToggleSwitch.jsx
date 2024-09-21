import React, { useState } from 'react';
import styles from './ToggleSwitch.module.scss'; // Подключение стилей

const ToggleSwitch = () => {
    const [isChecked, setIsChecked] = useState(false);

    const handleToggle = () => {
        setIsChecked(!isChecked);
    };

    return (
        <div className={styles.container}>
            <span className={styles.title}>ANIMATION</span>
            <label className={styles.switch}>
                <input type="checkbox" checked={isChecked} onChange={handleToggle} />
                <span className={styles.slider}></span>
            </label>
        </div>
    );
};

export default ToggleSwitch;
