import Image from "next/image";
import styles from './ScicPVPbtn.module.scss';

const scis01 = '/buttonScissors/scis01.png';
const scis09 = '/buttonScissors/scis09.png';

// eslint-disable-next-line react/prop-types
export const ScicPvpBtn = ({ onClick, choose }) => {
    const images = [scis01, scis09];
    const currentImage = choose === 3 ? 1 : 0;

    const handleClick = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }
        onClick();
    };

    return (
        <Image
            width={90}
            height={90}
            className={currentImage === 0 ? styles.sciSecBtn : styles.sciSecBtnActive}
            onClick={handleClick}
            src={images[currentImage]}
            alt=""
        />
    );
};
