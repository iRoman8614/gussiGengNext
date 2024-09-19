import scis00 from '/buttonScissors/scis00.png'
import scis01 from '/buttonScissors/scis01.png'
import scis02 from '/buttonScissors/scis02.png'
import scis03 from '/buttonScissors/scis03.png'
import scis04 from '/buttonScissors/scis04.png'
import scis05 from '/buttonScissors/scis05.png'
import scis06 from '/buttonScissors/scis06.png'
import scis07 from '/buttonScissors/scis07.png'
import scis08 from '/buttonScissors/scis08.png'
import scis09 from '/buttonScissors/scis09.png'
import {useEffect, useState} from "react";

import styles from './ScicPVPbtn.module.scss'


// eslint-disable-next-line react/prop-types
export const ScicPvpBtn = ({onClick, reset}) => {
    const images = [
        scis01,
        scis00,
        scis01,
        scis02,
        scis03,
        scis04,
        scis05,
        scis06,
        scis07,
        scis08,
        scis09,
    ];

    const [currentImage, setCurrentImage] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (reset || !reset) {
            setCurrentImage(0);
            setIsAnimating(false);
        }
    }, [reset]);

    useEffect(() => {
        let interval;
        if (isAnimating && currentImage < images.length - 1) {
            interval = setInterval(() => {
                setCurrentImage((prevImage) => prevImage + 1);
            }, 90);
        } else if (currentImage === images.length - 1) {
            setIsAnimating(false);
        }
        return () => clearInterval(interval);
    }, [isAnimating, currentImage, images.length]);

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
            {currentImage < 3 && <img
                className={styles.sciSecBtn}
                onClick={handleClick}
                src={images[currentImage]}
                alt=""
            />}
            {currentImage >= 3 && currentImage < 6 && <img
                className={styles.sciSecBtnHalfActive}
                onClick={handleClick}
                src={images[currentImage]}
                alt=""
            />}
            {currentImage >= 6 && <img
                className={styles.sciSecBtnActive}
                onClick={handleClick}
                src={images[currentImage]}
                alt=""
            />}
        </>
    );
};
