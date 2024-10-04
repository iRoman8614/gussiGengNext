import Image from "next/image";
import { useState } from "react";

import styles from './PaperPVPbtn.module.scss';

const paper1 = '/buttonPaper/paper01.png';
const paper2 = '/buttonPaper/paper09.png';
// eslint-disable-next-line react/prop-types
export const PaperPVPbtn = ({ onClick, choose }) => {
    const [isActive, setIsActive] = useState(false);

    const paperImage = isActive ? paper2 : paper1;

    const handleClick = () => {
        console.log('clicked');
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }
        // Меняем состояние при клике
        setIsActive(!isActive);
        onClick();
    };

    return (
        <Image
            width={90}
            height={90}
            className={isActive ? styles.papSecBtnHalfActive : styles.papSecBtn}
            onClick={handleClick}
            src={paperImage}
            alt=""
        />
    );
};



// import Image from "next/image";
// import { useEffect, useState } from "react";
// import styles from './PaperPVPbtn.module.scss';
//
// // eslint-disable-next-line react/prop-types
// export const PaperPVPbtn = ({ onClick, choose }) => {
//     const [currentImage, setCurrentImage] = useState(0);
//     const [isAnimating, setIsAnimating] = useState(false);
//
//     const paper1 = '/buttonPaper/paper01.png'
//     const paper2 = '/buttonPaper/paper09.png'
//
//     const paperImages = [
//         paper1,
//         paper2
//     ];
//
//     useEffect(() => {
//         let interval;
//         if (choose === 2) {
//             setIsAnimating(true);
//             interval = setInterval(() => {
//                 setCurrentImage((prevImage) => {
//                     if (prevImage >= paperImages.length - 1) {
//                         setIsAnimating(false);
//                         return prevImage;
//                     }
//                     return prevImage + 1;
//                 });
//             }, 200);
//         } else {
//             setCurrentImage(0);
//             setIsAnimating(false);
//         }
//         return () => clearInterval(interval);
//     }, [choose, currentImage, paperImages.length]);
//
//     useEffect(() => {
//         let interval;
//         if (isAnimating) {
//             interval = setInterval(() => {
//                 setCurrentImage((prevImage) => {
//                     if (prevImage >= paperImages.length - 1) {
//                         clearInterval(interval);
//                         setIsAnimating(false);   // Анимация завершена
//                         return prevImage;
//                     }
//                     return prevImage + 1;
//                 });
//             }, 200);
//         }
//         return () => clearInterval(interval);
//     }, [isAnimating]);
//
//     const handleClick = () => {
//         console.log('clicked');
//         if (window.Telegram?.WebApp?.HapticFeedback) {
//             window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
//         }
//         if (!isAnimating && currentImage === 0) { // Запускаем анимацию только при первом кадре
//             setIsAnimating(true);
//             onClick();
//         }
//     };
//
//     return (
//         <>
//             {currentImage === 0 &&
//                 <Image
//                     width={90}
//                     height={90}
//                     className={styles.papSecBtn}
//                     onClick={handleClick}
//                     src={paperImages[currentImage]}
//                     alt=""
//             />}
//             {currentImage === 1 &&
//                 <Image
//                     width={90}
//                     height={90}
//                     className={styles.papSecBtnHalfActive}
//                     onClick={handleClick}
//                     src={paperImages[currentImage]}
//                     alt=""
//             />}
//         </>
//         // <>
//         //     {currentImage < 3 && <Image width={90} height={90}
//         //                                 className={styles.papSecBtn}
//         //                                 onClick={handleClick}
//         //                                 src={paperImages[currentImage]}
//         //                                 alt=""
//         //     />}
//         //     {currentImage >= 3 && currentImage < 6 && <Image width={90} height={90}
//         //                                                      className={styles.papSecBtnHalfActive}
//         //                                                      onClick={handleClick}
//         //                                                      src={paperImages[currentImage]}
//         //                                                      alt=""
//         //     />}
//         //     {currentImage >= 6 && <Image width={90} height={90}
//         //                                  className={styles.papSecBtnActive}
//         //                                  onClick={handleClick}
//         //                                  src={paperImages[currentImage]}
//         //                                  alt=""
//         //     />}
//         // </>
//         // <Image
//         //     width={90}
//         //     height={90}
//         //     className={currentImage < 3
//         //         ? styles.papSecBtn
//         //         : currentImage < 6
//         //             ? styles.papSecBtnHalfActive
//         //             : styles.papSecBtnActive}
//         //     src={paperImages[currentImage]}
//         //     alt=""
//         //     onClick={handleClick}
//         // />
//     );
// };
