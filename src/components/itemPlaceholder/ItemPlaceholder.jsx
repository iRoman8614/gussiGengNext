import Image from "next/image";
import { useCachedAssets } from '@/utils/cache';

import styles from './ItemPlaceholder.module.scss';

const assetPaths = {
    money: '/money.png'
};

// eslint-disable-next-line react/prop-types
export const ItemPlaceholder = ({ item, img, onClick }) => {
    const cachedAssets = useCachedAssets({ ...assetPaths, itemImage: img }, 'assets-cache-others');

    const handleClick = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
        onClick();
    };

    return (
        <div className={styles.root} onClick={handleClick}>
            <div className={styles.imageContainer}>
                <Image className={styles.image} width={260} height={170} alt="" src={cachedAssets.itemImage} />
                <div className={styles.level}>lvl {item.Level}</div>
            </div>
            <div className={styles.title}>
                {item.Cost}{' '}
                <Image src={cachedAssets.money} alt="" width={15} height={15} />
            </div>
        </div>
    );
};