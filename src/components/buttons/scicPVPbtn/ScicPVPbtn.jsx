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
        if (choose !== 2) {
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
        <button disabled={choose !== 3 && choose !== 2} className={styles.root}>
            <Image
                width={90} height={90}
                className={currentImage < 3
                    ? styles.sciSecBtn
                    : currentImage < 6
                        ? styles.sciSecBtnHalfActive
                        : styles.sciSecBtnActive}
                onClick={handleClick}
                src={images[currentImage]}
                alt=""
            />
        </button>

    );
};
