import React, {useState} from "react";
import Image from "next/image";

import styles from './TaskBtn.module.scss'

const Arrow = '/Tasks/TaskArrow.png'
const Complite = '/Tasks/TaskComplited.png'
const money = '/Task/money2.png'

export const TaskBtn = ({title, subtitle, desc, completed, onClick, readyToComplete, reward}) => {
    const [complited, setComplited] = useState(completed)

    const handleClick = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }
        onClick();
    };

    return(
        <div className={readyToComplete ? styles.rootReady : styles.root} onClick={handleClick}>
            <div className={styles.container}>
                <div>
                    {title && <div className={styles.title}>{title}</div>}
                    {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
                </div>
                <div className={styles.reward}><Image src={money} width={30} height={25} alt={''} />+{reward}</div>
            </div>
            <div className={styles.desc}>{desc}</div>
            <div>
                {complited === false ? <Image src={Arrow} width={20} height={20} alt={''} /> : <Image src={Complite} width={20} height={20} alt={''} />}
            </div>
        </div>
    )
}