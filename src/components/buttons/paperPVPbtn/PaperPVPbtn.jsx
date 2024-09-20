import Image from "next/image";
import { useEffect, useState } from "react";
import styles from './PaperPVPbtn.module.scss';

const paperImages = [
    '/buttonPaper/paper00.png',
    '/buttonPaper/paper01.png',
    '/buttonPaper/paper02.png',
    '/buttonPaper/paper03.png',
    '/buttonPaper/paper04.png',
    '/buttonPaper/paper05.png',
    '/buttonPaper/paper06.png',
    '/buttonPaper/paper07.png',
    '/buttonPaper/paper08.png',
    '/buttonPaper/paper09.png'
];

// eslint-disable-next-line react/prop-types
export const PaperPVPbtn = ({ onClick, choose }) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        let interval;
        // Если выбрана "бумага", запускаем анимацию
        if (choose === 1) {
            setIsAnimating(true);
            interval = setInterval(() => {
                setCurrentImage((prevImage) => {
                    // Когда достигли конца анимации, останавливаем анимацию
                    if (prevImage >= paperImages.length - 1) {
                        setIsAnimating(false);
                        return prevImage; // Останавливаемся на последнем кадре
                    }
                    return prevImage + 1; // Иначе продолжаем анимацию
                });
            }, 100);
        } else {
            // Если выбрано что-то другое (или анимация сброшена), сбрасываем кадр
            setCurrentImage(0);
            setIsAnimating(false);
        }
        // Очищаем интервал при размонтировании или изменении условий
        return () => clearInterval(interval);
    }, [choose, currentImage]);

    const handleClick = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }
        if (!isAnimating && currentImage === 0) {
            setIsAnimating(true);
            onClick();
        }
    };

    return (
        <Image
            width={90}
            height={90}
            className={currentImage < 3
                ? styles.papSecBtn
                : currentImage < 6
                    ? styles.papSecBtnHalfActive
                    : styles.papSecBtnActive}
            src={paperImages[currentImage]}
            alt=""
            onClick={handleClick}
        />
    );
};
