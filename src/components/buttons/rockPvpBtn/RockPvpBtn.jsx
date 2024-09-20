const rock00 = '/buttonRock/rock00.png'
const rock01 = '/buttonRock/rock01.png'
const rock02 = '/buttonRock/rock02.png'
const rock03 = '/buttonRock/rock03.png'
const rock04 = '/buttonRock/rock04.png'
const rock05 = '/buttonRock/rock05.png'
const rock06 = '/buttonRock/rock06.png'
const rock07 = '/buttonRock/rock07.png'
const rock08 = '/buttonRock/rock08.png'
const rock09 = '/buttonRock/rock09.png'
import {useEffect, useState} from "react";
import Image from "next/image";

import styles from './RockPvpBtn.module.scss'


// eslint-disable-next-line react/prop-types
export const RockPvpBtn = ({onClick, choose}) => {
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
        if (choose !== 0) {
            setCurrentImage(0);
            setIsAnimating(false);
        }
    }, [choose]);

    useEffect(() => {
        let interval;
        if (isAnimating && currentImage < images.length - 1) {
            interval = setInterval(() => {
                setCurrentImage((prevImage) => prevImage + 1);
            }, 100);
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
        <button disabled={choose !== 0} className={styles.root}>
            <Image
                width={90}
                height={90}
                className={currentImage < 3
                    ? styles.rocSecBtn
                    : currentImage < 6
                        ? styles.rocSecBtnHalfActive
                        : styles.rocSecBtnActive}
                onClick={handleClick}
                src={images[currentImage]}
                alt=""
            />
        </button>
    );
};
