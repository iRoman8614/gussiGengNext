const scis01 = '/buttonScissors/scis01.png'
const scis09 = '/buttonScissors/scis09.png'
import {useEffect, useState} from "react";
import Image from "next/image";

import styles from './ScicPVPbtn.module.scss'

// eslint-disable-next-line react/prop-types
export const ScicPvpBtn = ({onClick, choose}) => {
    const images = [
        scis01,
        scis09,
    ];

    const [currentImage, setCurrentImage] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        let interval;
        if (choose === 3) {
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
    );
};
