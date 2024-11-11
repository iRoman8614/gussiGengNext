import Image from "next/image";
import { useCachedAssets } from '@/utils/cache';

import styles from './CollectBar.module.scss';

const assetPaths = { border: '/farm_border.png' };

// eslint-disable-next-line react/prop-types
export const CollectBar = ({ currentCoins, maxCoins, width }) => {
    const cachedAssets = useCachedAssets(assetPaths, 'assets-cache-icons');

    return (
        <div className={styles.root}>
            <div className={styles.progressBar} style={{ 'width': `${width}px` }}></div>
            <div className={styles.title}>
                {currentCoins} / {maxCoins}
            </div>
            <div className={styles.border}>
                <Image width={1000} height={1000} className={styles.image} src={cachedAssets.border} alt="" loading="lazy" />
            </div>
        </div>
    );
};