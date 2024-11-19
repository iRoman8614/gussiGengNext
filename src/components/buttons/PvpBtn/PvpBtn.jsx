import Image from "next/image";

import styles from './PvpBtn.module.scss';

// eslint-disable-next-line react/prop-types
export const PvpBtn = ({ onClick, choose, img, title, value }) => {
    const handleClick = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        }
        onClick();
    };

    return (
        <div className={value === choose ? styles.rootChosen : styles.root} onClick={handleClick}>
            <div className={value === choose ? styles.containerChosen : styles.container}>
                <Image className={styles.icon} src={img} alt={'rock'} width={42} height={33} />
                <div className={value === choose ? styles.titleChosen : styles.title}>{title}</div>
            </div>
        </div>
    );
};

const Arrow = "/faq/longArrow.png"
const roundArrow = "/faq/longRoundArrow.png"

export const PvpBtnOld = ({ choose, img, title, value, arrow }) => {
    return (
        <div className={styles.oldContainer}>
            {arrow === "left" && <Image src={roundArrow} alt={""} width={70} height={95}/>}
            {arrow === "mid" && <Image src={Arrow} className={styles.midArrow} alt={""} width={30} height={85}/>}
            {arrow === "right" && <Image src={roundArrow} className={styles.rightArrow} alt={""} width={70} height={95}/>}
            <div className={styles.border}>
                <div className={styles.root}>
                    <div className={styles.container}>
                        <Image className={styles.icon} src={img} alt={'rock'} width={42} height={33} />
                        <div className={value === choose ? styles.titleChosen : styles.title}>{title}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};