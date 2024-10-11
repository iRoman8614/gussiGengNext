import Image from "next/image";

import styles from './BigButton.module.scss';

// eslint-disable-next-line react/prop-types
export const BigButton = ({ image, title, alt, onClick }) => {
    const handleClick = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }
        if (onClick) {
            onClick();
        }
    };

    return (
        <div className={styles.root} onClick={handleClick}>
            <div>
                <Image className={styles.image} src={image} width={150} height={150} alt={alt} />
            </div>
            <div className={styles.title}>
                {title}
            </div>
        </div>
    );
};
