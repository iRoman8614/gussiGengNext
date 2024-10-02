import Image from "next/image";
import {useEffect, useState} from "react";

import styles from './Listitem.module.scss'

export const ListItem = ({item, index, me}) => {
    const [avatarUrl, setAvatarUrl] = useState(item.avatar);
    const [nickname, setNickname] = useState(item.nickname);

    useEffect(() => {
        const fetchUserInfo = async (userId) => {
            try {
                const response = await fetch(`/api/getAvatar?userId=${userId}`);
                const data = await response.json();

                if (data.avatar) {
                    setAvatarUrl(data.avatar);
                }
                if (data.nickname) {
                    setNickname(data.nickname);
                }
            } catch (error) {
                console.error('Error fetching avatar or nickname:', error);
            }
        };

        if (item.id) {
            fetchUserInfo(item.id);
        }
    }, [item.id]);

    return(
        <>
            <div className={me ? styles.rootMe : styles.root}>
                <div className={styles.avatar}>
                    {avatarUrl && <Image className={styles.avatar} src={avatarUrl} alt={'avatar'} width={40} height={44} />}
                </div>
                <div className={styles.container}>
                    <Image className={styles.bg} src={item.image} alt={''} width={450} height={65} />
                    <div className={styles.content}>
                        <div className={styles.nickname}>{nickname}</div>
                        <div className={styles.sum}>{item.sum}</div>
                        {index && <div className={styles.index}>{index}</div>}
                    </div>
                </div>
            </div>
        </>
    )
}