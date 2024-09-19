import paper00 from '/buttonPaper/paper00.png'
import paper01 from '/buttonPaper/paper01.png'
import paper02 from '/buttonPaper/paper02.png'
import paper03 from '/buttonPaper/paper03.png'
import paper04 from '/buttonPaper/paper04.png'
import paper05 from '/buttonPaper/paper05.png'
import paper06 from '/buttonPaper/paper06.png'
import paper07 from '/buttonPaper/paper07.png'
import paper08 from '/buttonPaper/paper08.png'
import paper09 from '/buttonPaper/paper09.png'
import {useEffect, useState} from "react";

import styles from './PaperPVPbtn.module.scss'


// eslint-disable-next-line react/prop-types
export const PaperPVPbtn = ({onClick, reset}) => {
    const images = [
        paper01,
        paper00,
        paper01,
        paper02,
        paper03,
        paper04,
        paper05,
        paper06,
        paper07,
        paper08,
        paper09,
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
                className={styles.papSecBtn}
                onClick={handleClick}
                src={images[currentImage]}
                alt=""
            />}
            {currentImage >= 3 && currentImage < 6 && <img
                className={styles.papSecBtnHalfActive}
                onClick={handleClick}
                src={images[currentImage]}
                alt=""
            />}
            {currentImage >= 6 && <img
                className={styles.papSecBtnActive}
                onClick={handleClick}
                src={images[currentImage]}
                alt=""
            />}
        </>
    );
};
