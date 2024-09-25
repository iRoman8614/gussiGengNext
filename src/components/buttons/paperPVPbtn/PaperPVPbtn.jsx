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

    // Сброс анимации при изменении выбора
    useEffect(() => {
        if (choose !== 1) {
            setCurrentImage(0);
            setIsAnimating(false);
        }
    }, [choose]);

    // Запуск анимации при выборе "бумаги" и срабатывании клика
    useEffect(() => {
        let interval;
        if (isAnimating) {
            interval = setInterval(() => {
                setCurrentImage((prevImage) => {
                    if (prevImage >= paperImages.length - 1) {
                        clearInterval(interval); // Останавливаем анимацию на последнем кадре
                        setIsAnimating(false);   // Анимация завершена
                        return prevImage;
                    }
                    return prevImage + 1;
                });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isAnimating]);

    const handleClick = () => {
        if (choose === 1) { // Проверяем, что выбрана бумага
            console.log('clicked');
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
            }
            if (!isAnimating && currentImage === 0) { // Запускаем анимацию только при первом кадре
                setIsAnimating(true);
                onClick();
            }
        }
    };

    return (
        <>
            {currentImage < 3 && <Image width={90} height={90}
                                        className={styles.papSecBtn}
                                        onClick={handleClick}
                                        src={paperImages[currentImage]}
                                        alt=""
            />}
            {currentImage >= 3 && currentImage < 6 && <Image width={90} height={90}
                                                             className={styles.papSecBtnHalfActive}
                                                             onClick={handleClick}
                                                             src={paperImages[currentImage]}
                                                             alt=""
            />}
            {currentImage >= 6 && <Image width={90} height={90}
                                         className={styles.papSecBtnActive}
                                         onClick={handleClick}
                                         src={paperImages[currentImage]}
                                         alt=""
            />}
        </>
        // <Image
        //     width={90}
        //     height={90}
        //     className={currentImage < 3
        //         ? styles.papSecBtn
        //         : currentImage < 6
        //             ? styles.papSecBtnHalfActive
        //             : styles.papSecBtnActive}
        //     src={paperImages[currentImage]}
        //     alt=""
        //     onClick={handleClick}
        // />
    );
};
