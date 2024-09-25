const scis00 = '/buttonScissors/scis00.png'
const scis01 = '/buttonScissors/scis01.png'
const scis02 = '/buttonScissors/scis02.png'
const scis03 = '/buttonScissors/scis03.png'
const scis04 = '/buttonScissors/scis04.png'
const scis05 = '/buttonScissors/scis05.png'
const scis06 = '/buttonScissors/scis06.png'
const scis07 = '/buttonScissors/scis07.png'
const scis08 = '/buttonScissors/scis08.png'
const scis09 = '/buttonScissors/scis09.png'
import {useEffect, useState} from "react";
import Image from "next/image";

import styles from './ScicPVPbtn.module.scss'


// eslint-disable-next-line react/prop-types
export const ScicPvpBtn = ({onClick, choose}) => {
    // const images = [
    //     scis01,
    //     scis00,
    //     scis01,
    //     scis02,
    //     scis03,
    //     scis04,
    //     scis05,
    //     scis06,
    //     scis07,
    //     scis08,
    //     scis09,
    // ];

    const images = [
        scis01,
        scis09,
    ];

    const [currentImage, setCurrentImage] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        let interval;

        // Если выбрана "бумага", запускаем анимацию
        if (choose === 2) {
            setIsAnimating(true);
            interval = setInterval(() => {
                setCurrentImage((prevImage) => {
                    // Когда достигли конца анимации, останавливаем анимацию
                    if (prevImage >= images.length - 1) {
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
    }, [choose, currentImage, images.length]);

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
        <>
            {currentImage === 0 &&
                <Image
                    width={90} height={90}
                    className={styles.sciSecBtn}
                    onClick={handleClick}
                    src={images[currentImage]}
                    alt=""
                />
            }
            {currentImage === 1 &&
                <Image
                    width={90} height={90}
                    className={styles.sciSecBtnActive}
                    onClick={handleClick}
                    src={images[currentImage]}
                    alt=""
                />
            }
        </>
        // <>
        //     {currentImage < 3 &&
        //         <Image
        //             width={90} height={90}
        //             className={styles.sciSecBtn}
        //             onClick={handleClick}
        //             src={images[currentImage]}
        //             alt=""
        //         />
        //     }
        //     {currentImage >= 3 && currentImage < 6 &&
        //         <Image
        //             width={90} height={90}
        //             className={styles.sciSecBtnHalfActive}
        //             onClick={handleClick}
        //             src={images[currentImage]}
        //             alt=""
        //         />
        //     }
        //     {currentImage >= 6 &&
        //         <Image
        //             width={90} height={90}
        //             className={styles.sciSecBtnActive}
        //             onClick={handleClick}
        //             src={images[currentImage]}
        //             alt=""
        //         />
        //     }
        // </>
        // <Image
        //     width={90} height={90}
        //     className={currentImage < 3
        //         ? styles.sciSecBtn
        //         : currentImage < 6
        //             ? styles.sciSecBtnHalfActive
        //             : styles.sciSecBtnActive}
        //     onClick={handleClick}
        //     src={images[currentImage]}
        //     alt=""
        // />
    );
};
