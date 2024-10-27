import Image from "next/image";
import styles from './Listitem.module.scss'
import {useEffect, useState} from "react";

export const ListItem = ({item, index, teamId}) => {
    const[userId, setUserId] = useState(null)

    const teamData = {
        1: { avatar: '/listItemsBG/avaG.png', image: '/listItemsBG/1grbg.png' },
        2: { avatar: '/listItemsBG/avaB.png', image: '/listItemsBG/2bvbg.png' },
        3: { avatar: '/listItemsBG/avaY.png', image: '/listItemsBG/3yfbg.png' },
        4: { avatar: '/listItemsBG/avaR.png', image: '/listItemsBG/4rrbg.png' }
    };

    const { avatar, image } = teamData[teamId] || {};

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (window.Telegram?.WebApp) {
                const search = window.Telegram.WebApp.initData;
                const urlParams = new URLSearchParams(search);
                const userParam = urlParams.get("user");
                if (userParam) {
                    const decodedUserParam = decodeURIComponent(userParam);
                    const userObject = JSON.parse(decodedUserParam);
                    console.log("User ID from Telegram:", userObject.id);
                    setUserId(userObject.id);
                }
            }
        }
    }, []);

    const formatBalance = (balance) => {
        if (balance >= 1e12) {
            return (balance / 1e12).toFixed(1) + 't';
        } else if (balance >= 1e9) {
            return (balance / 1e9).toFixed(1) + 'b';
        } else if (balance >= 1e6) {
            return (balance / 1e6).toFixed(1) + 'm';
        } else if (balance >= 1e3) {
            return (balance / 1e3).toFixed(1) + 'k';
        }
        return balance;
    };

    return (
        <>
            <div className={item.profileId === userId ? styles.rootMe : styles.root}>
                <div className={styles.avatar}>
                    <Image className={styles.avatar} src={avatar} alt={'avatar'} width={40} height={44} />
                </div>
                <div className={styles.container}>
                    <Image className={styles.bg} src={image} alt={''} width={450} height={65} />
                    <div className={styles.content}>
                        <div className={styles.nickname}>{item.userName || 'Anonymous'}</div>
                        <div className={styles.sum}>{formatBalance(item.balance)}</div>
                        {index && <div className={styles.index}>{index}</div>}
                    </div>
                </div>
            </div>
        </>
    );
};
