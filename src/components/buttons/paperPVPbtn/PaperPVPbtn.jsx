import Image from "next/image";
import styles from './PaperPVPbtn.module.scss';

// eslint-disable-next-line react/prop-types
export const PaperPVPbtn = ({ onClick, choose }) => {
    const paper1 = '/buttonPaper/paper01.png';
    const paper2 = '/buttonPaper/paper09.png';

    const paperImages = [paper1, paper2];
    const currentImage = choose === 2 ? 1 : 0;

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
            className={currentImage === 0 ? styles.papSecBtn : styles.papSecBtnActive}
            onClick={handleClick}
            src={paperImages[currentImage]}
            alt=""
        />
    );
};
