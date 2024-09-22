import React from 'react';
import Image from "next/image";
import {CustomSelect} from '@/components/selector/Select';
import {ToggleSwitch} from "@/components/toggleswitch/ToggleSwitch";

import styles from '@/styles/Settings.module.scss'

const bg = '/backgrounds/settingsBG.png'

export default function Page() {
    const languageOptions = [
        { value: 'english', label: 'English' },
        { value: 'spanish', label: 'Spanish' },
        { value: 'french', label: 'French' },
    ];

    return (
        <div className={styles.root}>
            <Image src={bg} alt={'bg'} width={450} height={1000} className={styles.bg} />
            <div className={styles.container}>
                <h1 className={styles.title}>SETTINGS </h1>
                <CustomSelect title={'select LANGUAGE'} optionsArray={languageOptions} />
                <CustomSelect title={'select LANGUAGE'} optionsArray={languageOptions} />
                <ToggleSwitch />
            </div>
        </div>
    );
};
