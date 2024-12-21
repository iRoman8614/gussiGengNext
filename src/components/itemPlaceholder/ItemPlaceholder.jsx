import Image from "next/image";

import styles from './ItemPlaceholder.module.scss';
import {formatNumber} from "@/utils/formatNumber";
import {useTranslation} from "react-i18next";

const money = '/money.png'
const Lock = '/Lock.png'
const frame = '/upgradesCards/upgradeFrame.png'

// eslint-disable-next-line react/prop-types
export const ItemPlaceholder = ({ item, img, onClick, available, name, need }) => {
    const { t } = useTranslation();
    const handleClick = () => {
        if (available) {
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
            }
            onClick();
        }
    };

    return (
        <div className={styles.root} onClick={handleClick}>
            <div className={styles.imageContainer}>
                <Image className={styles.imageFrame} width={260} height={170} alt="" src={frame} priority />
                <Image className={styles.image} width={260} height={170} alt="" src={img} priority />
                <div className={styles.name}>{name}</div>
                <div className={styles.level}>lvl {item.level}</div>
                <div className={styles.per}>+{item.increasePer}%</div>
                {!available && <div className={styles.lock}>
                    <Image width={70} height={70} alt="" src={Lock} priority/>
                    <div className={styles.lockDesk}>{`${need} lvl 10`} {t('EXP.requires')}</div>
                </div>}
            </div>
            <div className={styles.title}>
                {formatNumber(Number(item.cost))}{' '}
                <Image src={money} alt="" width={15} height={15} />
            </div>
        </div>
    );
};