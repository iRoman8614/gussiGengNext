import Image from 'next/image';
import Head from "next/head";

import styles from '@/styles/QrPage.module.scss';

const qr = '/qr.png'
const bg = '/backgrounds/randomBG.png'

export default function QrPage() {
    return (
        <div className={styles.placeholder}>
            <h2>Play on your mobile</h2>
            <Image className={styles.qr} src={qr} alt="QR Code" width={200} height={200} />
            <h2>@gwprod_bot</h2>
        </div>
    );
}
