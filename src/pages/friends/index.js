import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import Image from "next/image";
import { toast } from 'react-toastify';
import {ListItem} from "@/components/ListItem/ListItem";

import styles from '@/styles/Friends.module.scss'

const bg = '/backgrounds/friendsBG.png'
const copy = '/copy.png'

export default function Page() {
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState('');

    const friends = [
        {
            id: 370439760,
            avatar: '/listItemsBG/avaR.png',
            nickname: 'Tupacshakur',
            sum: '15M',
            image: '/listItemsBG/4rrbg.png'
        },
        {
            id: 68288082,
            avatar: '/listItemsBG/avaB.png',
            nickname: 'Jhonnycash',
            sum: '14.1M',
            image: '/listItemsBG/2bvbg.png'
        },
        {
            id: 6171070524,
            avatar: '/listItemsBG/avaG.png',
            nickname: 'missyelliot',
            sum: '70K',
            image: '/listItemsBG/1grbg.png'
        },
        {
            id: 557540399,
            avatar: '/listItemsBG/avaR.png',
            nickname: 'Tupacshakur',
            sum: '15K',
            image: '/listItemsBG/4rrbg.png'
        },
    ]

    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const search = window.Telegram.WebApp.initData;
            const urlParams = new URLSearchParams(search);
            const userParam = urlParams.get('user');

            if (userParam) {
                const decodedUserParam = decodeURIComponent(userParam);
                const userObject = JSON.parse(decodedUserParam);
                setUserId(userObject.id);  // Сохраняем userId
                setUserName(userObject.username);
            } else {
                setUserId(111);
                setUserName('you');
            }

            // Получаем платформу
            const platform = window.Telegram.WebApp.platform;
            console.log("Telegram WebApp Platform: ", platform);
        }
    }, []);
    const filteredFriends = friends.filter(friend => friend.id !== userId);

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
        const linkToCopy = "https://t.me/vodoleyservicebot";

        if (navigator.clipboard) {
            navigator.clipboard.writeText(linkToCopy)
                .then(() => {
                    toast.success('Copied!', {
                        position: "bottom-center",
                        autoClose: 1000, // 1 секунда
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: false,
                    });

                    if (window.Telegram?.WebApp?.HapticFeedback) {
                        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
                    }
                })
                .catch((error) => {
                    console.error('Failed to copy the link:', error);
                });
        } else {
            console.error('Clipboard API is not available');
        }
    };

    const inviteClick = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
        }

        if (window.Telegram?.WebApp?.switchInlineQuery) {
            window.Telegram.WebApp.switchInlineQuery("Join me in this awesome game!", {
                allow_user_chats: true,
                allow_group_chats: true
            });
        } else {
            console.error("switchInlineQuery is not available in Telegram Web App");
        }
    };

    return(
        <div className={styles.root}>
            <Image className={styles.bg} src={bg} alt={'bg'} width={450} height={1000} />
            <div className={styles.container}>
                <div className={styles.hintBlock}>
                    <div>- Each referral gives you +1 PvP pass.</div>
                    <div>- PvP Pass – allows 5 extra PvP games, bypassing the 6-hour cooldown.</div>
                    <div>- If the referral has Telegram Premium, you get +2 PvP passes.</div>
                    <div className={styles.important}>- you’ll earn 10% of the rewards your referrals rack up for completing in-game <a className={styles.point}>tasks</a>!</div>
                </div>
                <div className={styles.title}>friends</div>
                <div className={styles.block}>
                    <>
                        {filteredFriends.length >= 3
                            ?
                            <div className={styles.barComplited} onClick={() => {router.push('/upgrades')}}><a>Claim</a></div>
                            :
                            <div className={styles.bar}>
                                {filteredFriends.map((index) => <div key={index} className={styles.barItem}></div>)}
                            </div>
                        }
                        <div className={styles.sign}>{filteredFriends.length}/3</div>
                    </>
                    <div className={styles.list}>{filteredFriends.map((item, index) => <ListItem key={index} item={item} />)}</div>
                    <div className={styles.buttonset}>
                        <button className={styles.btnInvite} onClick={inviteClick}>INVITE</button>
                        <button className={styles.btnCopy} onClick={handleClick}>
                            <Image src={copy} alt={'copy'} height={50} width={50} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}