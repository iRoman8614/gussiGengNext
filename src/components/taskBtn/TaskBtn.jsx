import React, {useState} from "react";
import Image from "next/image";

import styles from './TaskBtn.module.scss'

const Arrow = '/Tasks/TaskArrow.png'
const Complite = '/Tasks/TaskComplited.png'
const money = '/Tasks/money2.png'
const Icon1 = '/Tasks/referal.png'
const Icon5 = '/Tasks/pvp.png'
const IconTG = '/Tasks/telegram.png'
const IconX = '/Tasks/twitter.png'


export const TaskBtn = ({title, subtitle, desc, completed, onClick, readyToComplete, reward, icon, type}) => {
    const getIconSrc = () => {
        switch(icon) {
            case 'ref': return Icon1;
            case 'pvp': return Icon5;
            case 'tg': return IconTG;
            case 'x': return IconX;
            default:
                if (type === 1) return Icon1;
                if (type === 5) return Icon5;
                return '';
        }
    }

    const handleClick = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }
        onClick();
    };

    return(
        <div className={readyToComplete ? styles.rootReady : styles.root} onClick={handleClick}>
            <Image className={styles.icon} src={getIconSrc()} alt={''} width={60} height={60} />
            <div className={styles.container}>
                <div>
                    {title && <div className={styles.title}>{title}</div>}
                    {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
                </div>
                <div className={styles.reward}><Image className={styles.money} src={money} width={20} height={16} alt={''} />+{reward}</div>
            </div>
            <div className={styles.desc}>{desc}</div>
            <div>
                {completed === false ? <Image src={Arrow} width={20} height={20} alt={''} /> : <Image src={Complite} width={20} height={20} alt={''} />}
            </div>
        </div>
    )
}