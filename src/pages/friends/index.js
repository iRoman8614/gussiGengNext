import React, {useEffect} from 'react';
import Image from "next/image";

import styles from '@/styles/Friends.module.scss'
import {ListItem} from "@/components/ListItem/ListItem";
import {useRouter} from "next/router";

const bg = '/backgrounds/friendsBG.png'
const copy = '/copy.png'
export default function Page() {
    const friends = [
        {
            avatar: '/listItemsBG/avaG.png',
            nickname: 'Tupacshakur',
            sum: '15M',
            image: '/listItemsBG/1grbg.png'
        },
        {
            avatar: '/listItemsBG/avaY.png',
            nickname: 'Jhonnycash',
            sum: '14.1M',
            image: '/listItemsBG/3yfbg.png'
        },
        {
            avatar: '/listItemsBG/avaR.png',
            nickname: 'missyelliot',
            sum: '70K',
            image: '/listItemsBG/4rrbg.png'
        }
    ]

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

    const handleClick = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }
    }

    return(
        <div className={styles.root}>
            <Image className={styles.bg} src={bg} alt={'bg'} width={450} height={1000} />
            <div className={styles.container}>
                <div className={styles.title}>friends</div>
                <div className={styles.block}>
                    <>
                        <div className={styles.bar}>
                            <div className={styles.barItem}></div>
                            <div className={styles.barItem}></div>
                        </div>
                        <div className={styles.sign}>2/3</div>
                    </>
                    <div>{friends.map((item, index) => <ListItem key={index} item={item} />)}</div>
                    <div className={styles.buttonset}>
                        <button className={styles.btnInvite} onClick={handleClick}>INVITE</button>
                        <button className={styles.btnCopy} onClick={handleClick}>
                            <Image src={copy} alt={'copy'} height={50} width={50} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}