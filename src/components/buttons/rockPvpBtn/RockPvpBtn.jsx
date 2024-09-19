import rock00 from '/buttonRock/rock00.png'
import rock01 from '/buttonRock/rock01.png'
import rock02 from '/buttonRock/rock02.png'
import rock03 from '/buttonRock/rock03.png'
import rock04 from '/buttonRock/rock04.png'
import rock05 from '/buttonRock/rock05.png'
import rock06 from '/buttonRock/rock06.png'
import rock07 from '/buttonRock/rock07.png'
import rock08 from '/buttonRock/rock08.png'
import rock09 from '/buttonRock/rock09.png'
import {useEffect, useState} from "react";

import styles from './RockPvpBtn.module.scss'


// eslint-disable-next-line react/prop-types
export const RockPvpBtn = ({onClick, reset}) => {
    const images = [
        rock01,
        rock00,
        rock01,
        rock02,
        rock03,
        rock04,
        rock05,
        rock06,
        rock07,
        rock08,
        rock09,
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
                className={styles.rocSecBtn}
                onClick={handleClick}
                src={images[currentImage]}
                alt=""
            />}
            {currentImage >= 3 && currentImage < 6 && <img
                className={styles.rocSecBtnHalfActive}
                onClick={handleClick}
                src={images[currentImage]}
                alt=""
            />}
            {currentImage >= 6 && <img
                className={styles.rocSecBtnActive}
                onClick={handleClick}
                src={images[currentImage]}
                alt=""
            />}
        </>
    );
};
