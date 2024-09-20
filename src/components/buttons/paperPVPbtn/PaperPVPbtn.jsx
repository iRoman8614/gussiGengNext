import Image from "next/image";

const paper00 = '/buttonPaper/paper00.png'
const paper01 = '/buttonPaper/paper01.png'
const paper02 = '/buttonPaper/paper02.png'
const paper03 = '/buttonPaper/paper03.png'
const paper04 = '/buttonPaper/paper04.png'
const paper05 = '/buttonPaper/paper05.png'
const paper06 = '/buttonPaper/paper06.png'
const paper07 = '/buttonPaper/paper07.png'
const paper08 = '/buttonPaper/paper08.png'
const paper09 = '/buttonPaper/paper09.png'
import {useEffect, useState} from "react";

import styles from './PaperPVPbtn.module.scss'


// eslint-disable-next-line react/prop-types
export const PaperPVPbtn = ({onClick, choose}) => {
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
        if (choose !== 1) {
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
        <button disabled={choose !== 3 && choose !== 1} className={styles.root}>
            <Image
                width={90}
                height={90}
                className={currentImage < 3
                    ? styles.papSecBtn
                    : currentImage < 6
                        ? styles.papSecBtnHalfActive
                        : styles.papSecBtnActive}
                onClick={handleClick}
                src={images[currentImage]}
                alt=""
            />
        </button>

    );
};
