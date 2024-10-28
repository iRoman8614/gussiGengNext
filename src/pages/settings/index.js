import {useEffect} from 'react';
import {useRouter} from "next/router";
import {CustomSelect} from '@/components/selector/Select';

import styles from '@/styles/Settings.module.scss'

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
        <div className={styles.root}>
            <div className={styles.container}>
                <h1 className={styles.title}>SETTINGS </h1>
                <CustomSelect title={'select language'} optionsArray={languageOptions} />
            </div>
        </div>
    );
};
