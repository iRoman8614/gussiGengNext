import Image from "next/image";
import { useEffect, useState } from "react";
import styles from './PaperPVPbtn.module.scss';

// const paperImages = [
//     '/buttonPaper/paper00.png',
//     '/buttonPaper/paper01.png',
//     '/buttonPaper/paper02.png',
//     '/buttonPaper/paper03.png',
//     '/buttonPaper/paper04.png',
//     '/buttonPaper/paper05.png',
//     '/buttonPaper/paper06.png',
//     '/buttonPaper/paper07.png',
//     '/buttonPaper/paper08.png',
//     '/buttonPaper/paper09.png'
// ];



// eslint-disable-next-line react/prop-types
export const PaperPVPbtn = ({ onClick, choose }) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const papet1 = '/buttonPaper/paper01.png'
    const paper2 = '/buttonPaper/paper09.png'

    const paperImages = [
        papet1,
        paper2
    ];

    // Сброс анимации при изменении выбора
    useEffect(() => {
        let interval;
        if (choose === 2) {
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
            }, 200);
        } else {
            // Если выбрано что-то другое (или анимация сброшена), сбрасываем кадр
            setCurrentImage(0);
            setIsAnimating(false);
        }
        // Очищаем интервал при размонтировании или изменении условий
        return () => clearInterval(interval);
    }, [choose, currentImage, paperImages.length]);

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
            }, 200);
        }
        return () => clearInterval(interval);
    }, [isAnimating]);

    const handleClick = () => {
        console.log('clicked');
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }
        if (!isAnimating && currentImage === 0) { // Запускаем анимацию только при первом кадре
            setIsAnimating(true);
            onClick();
        }
    };

    return (
        <>
            {currentImage === 0 &&
                <Image
                    width={90}
                    height={90}
                    className={styles.papSecBtn}
                    onClick={handleClick}
                    src={paperImages[currentImage]}
                    alt=""
            />}
            {currentImage === 1 &&
                <Image
                    width={90}
                    height={90}
                    className={styles.papSecBtnHalfActive}
                    onClick={handleClick}
                    src={paperImages[currentImage]}
                    alt=""
            />}
        </>
        // <>
        //     {currentImage < 3 && <Image width={90} height={90}
        //                                 className={styles.papSecBtn}
        //                                 onClick={handleClick}
        //                                 src={paperImages[currentImage]}
        //                                 alt=""
        //     />}
        //     {currentImage >= 3 && currentImage < 6 && <Image width={90} height={90}
        //                                                      className={styles.papSecBtnHalfActive}
        //                                                      onClick={handleClick}
        //                                                      src={paperImages[currentImage]}
        //                                                      alt=""
        //     />}
        //     {currentImage >= 6 && <Image width={90} height={90}
        //                                  className={styles.papSecBtnActive}
        //                                  onClick={handleClick}
        //                                  src={paperImages[currentImage]}
        //                                  alt=""
        //     />}
        // </>
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
