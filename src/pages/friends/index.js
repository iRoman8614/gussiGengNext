import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import Image from "next/image";
import axiosInstance from '@/utils/axios';
import { toast } from 'react-toastify';
import {ListItem} from "@/components/ListItem/ListItem";

import styles from '@/styles/Friends.module.scss'

const bg = '/backgrounds/friendsBG.png'
const copy = '/copy.png'
const star = '/Star.png'
const money = '/money.png'

export default function Page() {
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState('');
    const [activeTab, setActiveTab] = useState(1);
    const [friends, setFriends] = useState([]);

    // const friends = [
    //     {
    //         teamId: 1,
    //         nickname: 'Tupacshakur',
    //         balance: '15M',
    //     },
    //     {
    //         teamId: 3,
    //         nickname: 'Jhonnycash',
    //         balance: '14.1M',
    //     },
    //     {
    //         teamId: 2,
    //         nickname: 'missyelliot',
    //         balance: '70K',
    //     },
    //     {
    //         teamId: 3,
    //         nickname: 'missyelliot',
    //         balance: '70K',
    //     },
    // ]

    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const search = window.Telegram.WebApp.initData;
            const urlParams = new URLSearchParams(search);
            const userParam = urlParams.get('user');

            if (userParam) {
                const decodedUserParam = decodeURIComponent(userParam);
                const userObject = JSON.parse(decodedUserParam);
                setUserId(userObject.id);
                setUserName(userObject.username);
            } else {
                setUserId(111);
                setUserName('you');
            }
            const platform = window.Telegram.WebApp.platform;
        }
    }, []);

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

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await axiosInstance.get('/profile/my-invitees');
                setFriends(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке списка друзей:', error);
            }
        };
        fetchFriends();
    }, []);

    const handleClick = () => {
        const referralLink = `https://t.me/vodoleyservicebot?referal=${userId}`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(referralLink)
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
        const tg = window.Telegram.WebApp;
        const referralLink = `https://t.me/vodoleyservicebot?referal=${userId}`;
        const inviteMessage = `Join me in this awesome game! Here's your referral link: ${referralLink}`;
        if (tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('heavy');
        }
        const shareLink = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(inviteMessage)}`;
        window.open(shareLink, '_blank');
    };

    return(
        <div className={styles.root}>
            <Image className={styles.bg} src={bg} alt={'bg'} width={450} height={1000} />
            <div className={styles.container}>
                <div className={styles.hintBlock}>
                    <div className={styles.bannerSet}>
                        <div className={styles.banner}>
                            <div className={styles.bannerMid}>
                                invite a friend
                                <p>+1 PVP pass</p>
                            </div>
                            <div className={styles.hintLabel}><a>+5 extra games</a></div>
                        </div>
                        <div className={styles.banner}>
                            <div className={styles.bannerMid}>
                                invite a
                                tg <Image src={star} alt={''} width={15} height={15} /> friend
                                <p>+2 PVP pass</p>
                            </div>
                            <div className={styles.hintLabel}><a>+10 extra games</a></div>
                        </div>
                    </div>
                    <div className={styles.hintLabel}>earn <a>10%</a> of your friends <a>tasks</a> completion!</div>
                </div>
                <div className={styles.block}>
                    <div className={styles.buttonSet}>
                        <div className={styles.folderBtnStats}
                             style={{
                                 zIndex: activeTab === 1 ? 112 : 110,
                                 marginBottom:  activeTab === 1 ? '0px' : '-12px',
                                 borderRight:  activeTab === 1 ? '2px solid #3842a4' : 'none',
                             }}
                             onClick={() => setActiveTab(1)}>friends</div>
                        <div
                            className={styles.folderBtnSkins}
                            style={{
                                zIndex: activeTab === 2 ? 113 : 110,
                                marginBottom:  activeTab === 2 ? '-0px' : '2px',
                            }}
                            onClick={() => setActiveTab(2)}
                        >info
                        </div>
                    </div>
                    {activeTab === 1 &&<div className={styles.friendsContainer}>
                        <div className={styles.bar}>
                            <div className={styles.progress} />
                        </div>
                        <p className={styles.sign}>{friends.length}/3</p>
                        <div className={styles.list}>
                            <div className={styles.list}>
                                {friends.length === 0 ? (
                                    <p className={styles.hintLabel}>Invite your friends</p>
                                ) : (
                                    friends.map((item, index) => <ListItem key={index} item={item} />)
                                )}
                            </div>
                        </div>
                        <div className={styles.buttonset}>
                            <button className={styles.btnInvite} onClick={inviteClick}>INVITE</button>
                            <button className={styles.btnCopy} onClick={handleClick}>
                                <Image src={copy} alt={'copy'} height={50} width={50} />
                            </button>
                        </div>
                    </div>}
                    {activeTab === 2 && <div className={styles.infoContainer}>
                        <div className={styles.listInfo}>
                            <div className={styles.hintLabel}>- Each <a>referral</a> gives you <a>+1 PvP pass.</a></div>
                            <div className={styles.hintLabel}>- <a>PvP Pass</a> – allows <a>5 extra PvP games</a>, bypassing the 6-hour cooldown.</div>
                            <div className={styles.hintLabel}>- If the referral has <a>Telegram Premium</a>, you get <a>+2 PvP passes</a>.</div>
                            <div className={styles.hintLabel}>Referrals <a>score 10,000 </a> <Image src={money} alt={''} width={15} height={15} />    just for <a>signing up</a> (joining the bot) through your referral link!</div>
                            <div className={styles.title}>rewards</div>
                            <div className={styles.rewards}>
                                <div className={styles.row}>
                                    <div className={styles.hintLabel}><a>1</a> referral</div>
                                    <div className={styles.hintLabel}><a>10000 </a><Image src={money} alt={''} width={15} height={15} /></div>
                                </div>
                                <div className={styles.row}>
                                    <div className={styles.hintLabel}><a>3</a> referrals</div>
                                    <div className={styles.hintLabel}><a>50000 </a><Image src={money} alt={''} width={15} height={15} /></div>
                                </div>
                                <div className={styles.row}>
                                    <div className={styles.hintLabel}><a>5</a> referrals</div>
                                    <div className={styles.hintLabel}><a>100000 </a><Image src={money} alt={''} width={15} height={15} /></div>
                                </div>
                                <div className={styles.row}>
                                    <div className={styles.hintLabel}><a>10</a> referrals</div>
                                    <div className={styles.hintLabel}><a>250000 </a><Image src={money} alt={''} width={15} height={15} /></div>
                                </div>
                                <div className={styles.row}>
                                    <div className={styles.hintLabel}><a>25</a> referrals</div>
                                    <div className={styles.hintLabel}><a>750000 </a><Image src={money} alt={''} width={15} height={15} /></div>
                                </div>
                                <div className={styles.row}>
                                    <div className={styles.hintLabel}><a>50</a> referrals</div>
                                    <div className={styles.hintLabel}><a>1500000 </a><Image src={money} alt={''} width={15} height={15} /></div>
                                </div>
                                <div className={styles.row}>
                                    <div className={styles.hintLabel}><a>100</a> referrals</div>
                                    <div className={styles.hintLabel}><a>5000000 </a><Image src={money} alt={''} width={15} height={15} /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    }
                </div>
            </div>
        </div>
    )
}