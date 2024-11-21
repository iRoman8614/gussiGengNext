import {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import Image from "next/image";
import Link from "next/link";
import { toast } from 'react-toastify';
import {useTranslation} from "react-i18next";
import {ListItem} from "@/components/ListItem/ListItem";
import {useMyInvitees} from "@/utils/api";

import styles from '@/styles/Friends.module.scss'

const copy = '/copy.png'
const star = '/Star.png'
const money = '/money.png'

const link = process.env.NEXT_PUBLIC_BOT_LINK
// const link = 'https://t.me/Gang_wars_bot'

export default function Page() {
    const { t } = useTranslation();
    const [userId, setUserId] = useState(null);
    const [activeTab, setActiveTab] = useState(1);
    const { data: friends } = useMyInvitees();
    const [message, setMessage] = useState('Join Gang Wars and Start Earning Big!\n' +
        '💰 Get 10,000 Coins as a welcome gift!\n' +
        '🚀 Exclusive Future Airdrop Alert! The coins you earn now lead to exciting token airdrops when we launch — don’t miss your chance to stack up early and be part of the action.\n' +
        '💥 Invite your friends, compete in PvP battles, and rise to the top of the leaderboard!')

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
            }
        }
        if (typeof window !== 'undefined') {
            const lang = localStorage.getItem('appLanguage')
            if (lang === 'ru') {
                setMessage('Присоединяйся к Gang Wars и начни зарабатывать по-крупному!\n' +
                    '💰 Получи 10 000 монет в подарок!\n' +
                    '🚀 Стань участником будущего Airdrop! Монеты, заработанные сейчас, приведут к раздаче токенов при запуске — не упусти свой шанс накопить раньше и больше! \n' +
                    '💥 Приглашай друзей, соревнуйтесь в PvP-сражениях и начни свой путь на вершину рейтинга!')
            } else {
                setMessage('Join Gang Wars and Start Earning Big!\n' +
                    '💰 Get 10,000 Coins as a welcome gift!\n' +
                    '🚀 Exclusive Future Airdrop Alert! The coins you earn now lead to exciting token airdrops when we launch — don’t miss your chance to stack up early and be part of the action.\n' +
                    '💥 Invite your friends, compete in PvP battles, and rise to the top of the leaderboard!')
            }
        }
    }, []);

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

    const handleClick = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        }
        const referralLink = `${link}?start=kid${userId}`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(referralLink)
                .then(() => {
                    toast.success('Copied!', {
                        position: "bottom-center",
                        autoClose: 1000,
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
        const referralLink = `${link}?start=kid${userId}`;
        const inviteMessage = message;
        if (tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('medium');
        }
        const shareLink = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(`${inviteMessage}`)}`;
        window.open(shareLink, '_blank');
    };

    const handleTab = (tab) => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
        setActiveTab(tab)
    }

    const thresholds = [1, 3, 5, 10, 25, 50, 100];

    const getCurrentThreshold = (friendsCount) => {
        for (let i = 0; i < thresholds.length; i++) {
            if (friendsCount <= thresholds[i]) {
                return thresholds[i];
            }
        }
        return thresholds[thresholds.length - 1];
    };

    const currentThreshold = getCurrentThreshold(friends.length);
    const progressPercent = Math.min((friends.length / currentThreshold) * 100, 100);

    return(
        <div className={styles.root}>
            <div className={styles.container}>
                {activeTab === 1 && <div className={styles.bannerSet}>
                    <div className={styles.banner}>
                        <div className={styles.bannerMid}>
                            {t('friends.inviteFriends')} {t('friends.aFriend')}
                            <p>+1 {t('friends.pass')}</p>
                        </div>
                        <div className={styles.hintLabel}><a>+5 {t('friends.extra')}</a></div>
                    </div>
                    <div className={styles.banner}>
                        <div className={styles.bannerMid}>
                            {t('friends.inviteFriends')} tg
                            <Image src={star} alt={''} width={15} height={15} loading="lazy"/> friend
                            <p>+2 PVP pass</p>
                        </div>
                        <div className={styles.hintLabel}><a>+10 {t('friends.extra')}</a></div>
                    </div>
                </div>}
                {activeTab === 1 && <div className={styles.hintBg}>
                    <div className={styles.hintLabel2}>{t('friends.earn.earn')} <a>{t('friends.earn.10%')}</a> {t('friends.earn.completed')} <a>{t('friends.earn.tasks')}</a> {t('friends.earn.friends')}</div>
                </div>}
                <div className={activeTab === 1 ? styles.block : styles.block2}>
                    <div className={styles.buttonSet}>
                        <div className={styles.folderBtnStats}
                             style={{
                                 zIndex: activeTab === 1 ? 112 : 110,
                                 marginBottom:  activeTab === 1 ? '0px' : '-12px',
                                 borderRight:  activeTab === 1 ? '2px solid #3842a4' : 'none',
                             }}
                             onClick={() => handleTab(1)}>{t('friends.friends')}</div>
                        <div
                            className={styles.folderBtnSkins}
                            style={{
                                zIndex: activeTab === 2 ? 113 : 110,
                                marginBottom:  activeTab === 2 ? '-0px' : '2px',
                            }}
                            onClick={() => handleTab(2)}
                        >{t('friends.info')}</div>
                    </div>
                    {activeTab === 1 && <div className={styles.friendsContainer}>
                        <div>
                            {progressPercent < 100 ? (
                                <div className={styles.bar}>
                                    <div
                                        className={styles.progress}
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            ) : (
                                <Link href="/tasks" className={styles.barFull}>
                                    <div className={styles.progressFull} style={{ width: `${progressPercent}%` }}>
                                    </div>
                                </Link>
                            )}
                            <p className={styles.sign}>{friends.length}/{currentThreshold}</p>
                        </div>
                        <div className={styles.list}>
                            {friends.length === 0 ? (
                                <p className={styles.hintLabel}>{t('friends.noone')}</p>
                            ) : (
                                friends.map((item, index) => <ListItem teamId={item.group} key={index} item={item} />)
                            )}
                        </div>
                        <div className={styles.buttonset}>
                            <button className={styles.btnInvite} id={'invite'} onClick={inviteClick}>{t('friends.invite')}</button>
                            <button className={styles.btnCopy} id={'copy'} onClick={handleClick}>
                                <Image src={copy} alt={'copy'} height={50} width={50} loading="lazy"/>
                            </button>
                        </div>
                    </div>}
                    {activeTab === 2 && <div className={styles.infoContainer}>
                        <div className={styles.listInfo}>
                            <div className={styles.hintLabel}>-{t('friends.referral.each')} <a>{t('friends.referral.referral')}</a> {t('friends.referral.gives')} <a>+1 PvP pass.</a></div>
                            <div className={styles.hintLabel}>-<a>{t('friends.passes.passes')}</a> – {t('friends.passes.allows')} <a>{t('friends.passes.extra')}</a>{t('friends.passes.cooldown')}</div>
                            <div className={styles.hintLabel}>-{t('friends.premium.if')} <a>{t('friends.premium.tgp')}</a> {t('friends.premium.you')} <a>{t('friends.premium.passes')}</a>.</div>
                            <div className={styles.hintLabel}>{t('friends.score.referrals')} <a>{t('friends.score.score')} </a> <img src={money} alt={''} width={15} height={15} /> {t('friends.score.for')} <a>{t('friends.score.signing')}</a> {t('friends.score.link')}</div>
                            <div className={styles.rewards}>
                                <div className={styles.title}>{t('friends.rewards')}</div>
                                <div className={styles.row}>
                                    <div className={styles.hintLabel}><a>1</a> {t('friends.ref.1')}</div>
                                    <div className={styles.hintLabel}><a>10000 </a><Image src={money} alt={''} width={15} height={15} /></div>
                                </div>
                                <div className={styles.row}>
                                    <div className={styles.hintLabel}><a>3</a> {t('friends.ref.3')}</div>
                                    <div className={styles.hintLabel}><a>50000 </a><Image src={money} alt={''} width={15} height={15} /></div>
                                </div>
                                <div className={styles.row}>
                                    <div className={styles.hintLabel}><a>5</a> {t('friends.ref.5')}</div>
                                    <div className={styles.hintLabel}><a>100000 </a><Image src={money} alt={''} width={15} height={15} /></div>
                                </div>
                                <div className={styles.row}>
                                    <div className={styles.hintLabel}><a>10</a> {t('friends.ref.5')}</div>
                                    <div className={styles.hintLabel}><a>250000 </a><Image src={money} alt={''} width={15} height={15} /></div>
                                </div>
                                <div className={styles.row}>
                                    <div className={styles.hintLabel}><a>25</a> {t('friends.ref.5')}</div>
                                    <div className={styles.hintLabel}><a>750000 </a><Image src={money} alt={''} width={15} height={15} /></div>
                                </div>
                                <div className={styles.row}>
                                    <div className={styles.hintLabel}><a>50</a> {t('friends.ref.5')}</div>
                                    <div className={styles.hintLabel}><a>1500000 </a><Image src={money} alt={''} width={15} height={15} /></div>
                                </div>
                                <div className={styles.row}>
                                    <div className={styles.hintLabel}><a>100</a> {t('friends.ref.5')}</div>
                                    <div className={styles.hintLabel}><a>5000000 </a><Image src={money} alt={''} width={15} height={15} /></div>
                                </div>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    )
}
