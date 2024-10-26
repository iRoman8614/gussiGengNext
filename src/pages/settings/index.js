import React, {useEffect} from 'react';
import Head from "next/head";
import Image from "next/image";
import {useRouter} from "next/router";
import {CustomSelect} from '@/components/selector/Select';

import styles from '@/styles/Settings.module.scss'

const bg = '/backgrounds/settingsBG.png'

export default function Page() {
    const languageOptions = [
        { value: 'english', label: 'english' },
    ];

    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp?.BackButton) {
            window.Telegram.WebApp.BackButton.show();
            window.Telegram.WebApp.BackButton.onClick(() => {
                router.push('/main');
            });
            return () => {
                window.Telegram.WebApp.BackButton.hide();
            };
        }
    }, [router]);

    return (
        <>
            <Head>
                <link rel="preload" href="/backgrounds/settingsBG.png" as="image" />
            </Head>
            <div className={styles.root}>
                <Image src={bg} alt={'bg'} width={450} height={1000} className={styles.bg} />
                <div className={styles.container}>
                    <h1 className={styles.title}>SETTINGS </h1>
                    <CustomSelect title={'select language'} optionsArray={languageOptions} />
                </div>
            </div>
        </>
    );
};
