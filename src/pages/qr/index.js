import Image from 'next/image';
import {useTranslation} from "react-i18next";
import {useCachedAssets} from "@/utils/cache";

import styles from '@/styles/QrPage.module.scss';

export default function QrPage() {
    const { t } = useTranslation();
    const cachedBackground = useCachedAssets({ bg: '/backgrounds/randomBG.png' }, 'assets-cache-backgrounds');
    const cachedOthers = useCachedAssets({ qr: '/qr.png' }, 'assets-cache-others');

    return (
        <div className={styles.placeholder}>
            <h2>{t('qr')}</h2>
            <Image className={styles.qr} src={cachedOthers.qr} alt="QR Code" width={200} height={200} priority />
            <h2>@gwtestbot_bot</h2>
        </div>
    );
}