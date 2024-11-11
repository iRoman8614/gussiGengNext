import Image from "next/image";
import { useCachedAssets } from '@/utils/cache';

import styles from './TaskBtn.module.scss'

const assetPaths = {
    Arrow: '/Tasks/TaskArrow.png',
    Complite: '/Tasks/TaskComplited.png',
    money: '/Tasks/money2.png',
    Icon1: '/Tasks/referal.png',
    Icon3: '/Tasks/pvp.png',
    IconTG: '/Tasks/telegram.png',
    IconX: '/Tasks/twitter.png'
};

// eslint-disable-next-line react/prop-types
export const TaskBtn = ({title, subtitle, desc, completed, onClick, readyToComplete, reward, icon, type}) => {
    const cachedAssets = useCachedAssets(assetPaths, 'assets-cache-others');

    const getIconSrc = () => {
        switch(icon) {
            case 'ref': return cachedAssets.Icon1;
            case 'pvp': return cachedAssets.Icon3;
            case 'tg': return cachedAssets.IconTG;
            case 'x': return cachedAssets.IconX;
            default:
                if (type === 1) return cachedAssets.Icon1;
                if (type === 3) return cachedAssets.Icon3;
                return '';
        }
    }

    const handleClick = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        }
        onClick();
    };

    return (
        <div className={readyToComplete ? styles.rootReady : styles.root} onClick={handleClick}>
            <Image className={styles.icon} src={getIconSrc()} alt={''} width={60} height={60} />
            <div className={styles.container}>
                <div>
                    {title && <div className={styles.title}>{title}</div>}
                    {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
                </div>
                <div className={styles.reward}>
                    <Image className={styles.money} src={cachedAssets.money} width={20} height={16} alt={''} />+{reward}
                </div>
            </div>
            <div className={styles.desc}>{desc}</div>
            <div>
                {completed === false
                    ? <Image src={cachedAssets.Arrow} width={20} height={20} alt={''} />
                    : <Image src={cachedAssets.Complite} width={30} height={30} alt={''} />}
            </div>
        </div>
    );
}