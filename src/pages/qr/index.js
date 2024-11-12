import Image from 'next/image';
import {useTranslation} from "react-i18next";

import styles from '@/styles/QrPage.module.scss';

const bg = '/backgrounds/randomBG.png'
const qr = '/qr.png'

export default function QrPage() {
    const { t } = useTranslation();

    return (
        <div className={styles.placeholder}>
            <h2>{t('qr')}</h2>
            <Image className={styles.qr} src={qr} alt="QR Code" width={200} height={200} priority />
            <h2>@gwtestbot_bot</h2>
        </div>
    );
}