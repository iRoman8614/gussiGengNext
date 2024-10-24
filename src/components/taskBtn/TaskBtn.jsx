import React, {useState} from "react";
import Image from "next/image";

import styles from './TaskBtn.module.scss'

const Arrow = '/Tasks/TaskArrow.png'
const Complite = '/Tasks/TaskComplited.png'

export const TaskBtn = ({title, subtitle, desc, completed, onClick}) => {
    const [complited, setComplited] = useState(complite)

    const handleClick = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }
        onClick();
    };

    return(
        <div className={styles.root} onClick={handleClick}>
            {title && <div className={styles.title}>{title}</div>}
            {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
            <div className={styles.desc}>{desc}</div>
            <div>
                {completed === false ? <Image src={Arrow} width={20} height={20} alt={''} /> : <Image src={Complite} width={20} height={20} alt={''} />}
            </div>
        </div>
    )
}