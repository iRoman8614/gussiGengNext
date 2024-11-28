import Image from "next/image";

import styles from './CollectBar.module.scss';
import {formatNumber} from "@/utils/formatNumber";

const border =  '/farm_border.png'

// eslint-disable-next-line react/prop-types
export const CollectBar = ({ currentCoins, maxCoins, width }) => {
    const formattedCurrentCoins = formatNumber(currentCoins < 0 ? 0 : currentCoins, 6);
    const formattedMaxCoins = formatNumber(Number(maxCoins), 6);

    return (
        <div className={styles.root}>
            <div className={styles.progressBar} style={{ 'width': `${width}px` }}></div>
            <div className={styles.title}>
                {formattedCurrentCoins} / {formattedMaxCoins}
            </div>
            <div className={styles.border}>
                <Image width={1000} height={1000} className={styles.image} src={border} alt="" loading="lazy" />
            </div>
        </div>
    );
};