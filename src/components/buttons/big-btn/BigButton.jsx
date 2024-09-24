import styles from './BigButton.module.scss';
import Image from "next/image";

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
                <Image className={styles.image} src={image} alt={alt} />
            </div>
            <div className={styles.title}>
                {title}
            </div>
        </div>
    );
};
