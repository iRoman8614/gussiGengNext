import {useEffect, useState} from "react";
import Image from "next/image";

import styles from './RockPvpBtn.module.scss'

const rock01 = '/buttonRock/rock01.png'
const rock09 = '/buttonRock/rock09.png'
// eslint-disable-next-line react/prop-types
export const RockPvpBtn = ({onClick, choose}) => {
    const images = [
        rock01,
        rock09,
    ];

    const [currentImage, setCurrentImage] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        let interval;
        if (choose === 1) {
            setIsAnimating(true);
            interval = setInterval(() => {
                setCurrentImage((prevImage) => {
                    if (prevImage >= images.length - 1) {
                        setIsAnimating(false);
                        return prevImage;
                    }
                    return prevImage + 1;
                });
            }, 200);
        } else {
            setCurrentImage(0);
            setIsAnimating(false);
        }
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
                    width={90}
                    height={90}
                    className={styles.rocSecBtn}
                    onClick={handleClick}
                    src={images[currentImage]}
                    alt=""
            />}
            {currentImage === 1 &&
                <Image
                    width={90}
                    height={90}
                    className={styles.rocSecBtnActive}
                    onClick={handleClick}
                    src={images[currentImage]}
                    alt=""
            />}
        </>
    );
};