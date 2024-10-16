import Image from "next/image";
import styles from './PvpBtn.module.scss';

// eslint-disable-next-line react/prop-types
export const PvpBtn = ({ onClick, choose, img, title, value }) => {
    const handleClick = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }
        onClick();
    };

    return (
        <div className={value === choose ? styles.rootChosen : styles.root} onClick={handleClick}>
            <div className={value === choose ? styles.containerChosen : styles.container}>
                <Image src={img} alt={'rock'} width={47} height={39} />
                <div className={value === choose ? styles.titleChosen : styles.title}>{title}</div>
            </div>
        </div>
    );
};
