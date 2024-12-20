import Image from "next/image";

import styles from './IconButton.module.scss'

// eslint-disable-next-line react/prop-types
export const IconButton = ({image, title, alt, onClick, direction}) => {
    const handleClick = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
        if(onClick) {onClick()}
    };
    return(
        <div
            className={direction ? styles['root' + direction.charAt(0).toUpperCase() + direction.slice(1)] : styles.root}
            onClick={handleClick}
        >
            <Image width={60} height={40} className={styles.image} src={image} alt={alt} />
            {title && <div className={styles.title}>
                {title}
            </div>}
        </div>

    )
}