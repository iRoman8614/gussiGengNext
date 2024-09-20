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
        if (choose === 1 && isAnimating) {
            interval = setInterval(() => {
                setCurrentImage((prevImage) => {
                    if (prevImage >= paperImages.length - 1) {
                        clearInterval(interval);  // Останавливаем анимацию на последнем кадре
                        setIsAnimating(false);  // Анимация закончена
                        return prevImage;
                    }
                    return prevImage + 1;
                });
            }, 100);
        } else {
            // Если выбрано что-то другое, сбрасываем кадр
            setCurrentImage(0);
            setIsAnimating(false);
        }

        // Очищаем интервал при изменении условий или размонтировании
        return () => clearInterval(interval);
    }, [choose, isAnimating]);

    const handleClick = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }
        if (!isAnimating) {
            setIsAnimating(true);
            onClick();  // Запускаем анимацию только при клике
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
