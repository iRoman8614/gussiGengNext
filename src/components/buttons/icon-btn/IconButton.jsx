import styles from './IconButton.module.scss'
import Image from "next/image";

// eslint-disable-next-line react/prop-types
export const IconButton = ({image, title, alt, onClick}) => {
    const handleClick = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }
        onClick();
    };
    return(
        <div className={styles.root} onClick={handleClick}>
            <div >
                <Image width={60} height={40} className={styles.image} src={image} alt={alt} />
            </div>
            {title && <div className={styles.title}>
                {title}
            </div>}
        </div>
    )
}