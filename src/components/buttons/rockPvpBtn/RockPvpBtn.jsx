import Image from "next/image";
import styles from './RockPvpBtn.module.scss';

const rock01 = '/buttonRock/rock01.png';
const rock09 = '/buttonRock/rock09.png';

// eslint-disable-next-line react/prop-types
export const RockPvpBtn = ({ onClick, choose }) => {
    const images = [rock01, rock09];
    const currentImage = choose === 1 ? 1 : 0;

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
            className={currentImage === 0 ? styles.rocSecBtn : styles.rocSecBtnActive}
            onClick={handleClick}
            src={images[currentImage]}
            alt=""
        />
    );
};
