import Image from "next/image";

import styles from './IconButton.module.scss'

// eslint-disable-next-line react/prop-types
export const IconButton = ({image, title, alt, onClick, hidden}) => {
    const handleClick = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }
        onClick();
    };
    return(
        <div className={hidden ? styles.hidderRoot : styles.root} onClick={handleClick}>
            <div >
                <Image width={60} height={40} className={styles.image} src={image} alt={alt} />
            </div>
            {title && <div className={styles.title}>
                {title}
            </div>}
        </div>
    )
}