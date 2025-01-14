import Image from 'next/image';
import {useTranslation} from "react-i18next";

import styles from '@/styles/QrPage.module.scss';

const bg = '/backgrounds/randomBG.png'
const qr = '/qr.png'

export default function QrPage() {
    const { t } = useTranslation();

    return (
        <div className={styles.placeholder}>
            <div>{t('qr')}</div>
            <Image className={styles.qr} src={qr} alt="QR Code" width={200} height={200} priority />
            <div>@Gang_wars_bot</div>
        </div>
    );
}