import React, {useEffect} from 'react';
import Image from "next/image";
import {useRouter} from "next/router";
import {CustomSelect} from '@/components/selector/Select';
import {ToggleSwitch} from "@/components/toggleswitch/ToggleSwitch";

import styles from '@/styles/Settings.module.scss'
import Head from "next/head";

const bg = '/backgrounds/settingsBG.png'

export default function Page() {
    const languageOptions = [
        { value: 'english', label: 'English' },
    ];

    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp?.BackButton) {
            window.Telegram.WebApp.BackButton.show();
            window.Telegram.WebApp.BackButton.onClick(() => {
                router.push('/');
            });
            return () => {
                window.Telegram.WebApp.BackButton.hide();
            };
        }
    }, [router]);

    const clearLocalStorage = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem("init");
            localStorage.removeItem("start");
            localStorage.removeItem("totalCoins");
            localStorage.removeItem("rate");
            localStorage.removeItem("startFarmTime");
            localStorage.removeItem("teamId");
            localStorage.removeItem("GWToken");
        }
    };

    return (
        <>
            <Head>
                <link rel="preload" href="/backgrounds/settingsBG.png" as="image" />
            </Head>
            <div className={styles.root}>
                <Image src={bg} alt={'bg'} width={450} height={1000} className={styles.bg} />
                <div className={styles.container}>
                    <h1 className={styles.title}>SETTINGS </h1>
                    <CustomSelect title={'select LANGUAGE'} optionsArray={languageOptions} />
                    {/*<ToggleSwitch />*/}
                    {/*<button onClick={clearLocalStorage}>reset LocalStorage</button>*/}
                </div>
            </div>
        </>
    );
};
