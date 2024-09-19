import border from '../../../public/farm_border.png';
import styles from './CollectBar.module.scss';
import Image from "next/image";

// eslint-disable-next-line react/prop-types
export const CollectBar = ({ currentCoins, maxCoins, width }) => {
    return (
        <div className={styles.root}>
            <div className={styles.progressBar} style={{ 'width': `${width}px` }}></div>
            <div className={styles.title}>
                {currentCoins} / {maxCoins}
            </div>
            <div className={styles.border}>
                <Image width={1000} height={1000} className={styles.image} src={border} alt="Progress Border"/>
            </div>
        </div>
    );
}
