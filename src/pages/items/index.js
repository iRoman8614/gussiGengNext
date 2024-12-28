import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import Image from "next/image";
import {useTranslation} from "react-i18next";
import {Swiper, SwiperSlide} from "swiper/react";
import {Controller, Navigation} from "swiper/modules";
import { useInit } from '@/context/InitContext';
import {formatNumber} from "@/utils/formatNumber";
import {useProfileStats, useMyInvitees, useFarmCollect} from '@/utils/api';
import axiosInstance from "@/utils/axios";
import {toast} from "react-toastify";
import Link from "next/link";

import skinData from '@/mock/skinsData'
import teamData from "@/mock/teamsData";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/controller';
import styles from '@/styles/Items.module.scss'

const money = '/money.png'
const Lock = '/Lock.png'
const star = '/Star.png'

export default function Page() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState(1);
    const {coins } = useInit();

    const handleTab = (tab) => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
        setActiveTab(tab)
    }

    return(
        <div className={styles.root}>
            <div className={styles.container}>
                <div className={styles.block}>
                    <div className={styles.buttonSet}>
                        <div className={styles.folderBtnShop}
                             style={{
                                 zIndex: activeTab === 1 ? 112 : 110,
                                 marginBottom:  activeTab === 1 ? '0px' : '-12px',
                                 borderRight:  activeTab === 1 ? '2px solid #3842a4' : 'none',
                             }}
                             onClick={() => handleTab(1)}
                        >shop</div>
                        <div
                            className={styles.folderBtnFlex}
                            style={{
                                zIndex: activeTab === 2 ? 113 : 110,
                                marginBottom:  activeTab === 2 ? '-0px' : '2px',
                            }}
                            onClick={() => handleTab(2)}
                        >flex</div>
                        <div
                            className={styles.folderBtnTats}
                            style={{
                                zIndex: activeTab === 3 ? 114 : 109,
                                marginBottom:  activeTab === 3 ? '-0px' : '2px',
                            }}
                            onClick={() => handleTab(3)}
                        >tats</div>
                    </div>
                    {activeTab === 1 &&<div className={styles.personalContainer}>
                        <div className={styles.padding}>
                            <div>
                                <div className={styles.barItem}>{t('account.cur_balance')}</div>
                                <div className={styles.balance}>{formatNumber(coins, 15)}{' '}<Image src={money} alt={''} width={21} height={21} loading="lazy"/></div>
                            </div>
                        </div>
                    </div>}
                    {activeTab === 2 && <div className={styles.skinContainer}>
                        <div className={styles.padding}>
                            <div>
                                <div className={styles.barItem}>{t('account.cur_balance')}</div>
                                <div className={styles.balance}>{formatNumber(coins, 15)}{' '}<Image src={money} alt={''} width={21} height={21} loading="lazy"/></div>
                            </div>
                        </div>
                    </div>}
                    {activeTab === 3 && <div className={styles.skinContainer}>
                        <div className={styles.padding}>
                            <div>
                                <div className={styles.barItem}>{t('account.cur_balance')}</div>
                                <div className={styles.balance}>{formatNumber(coins, 15)}{' '}<Image src={money} alt={''} width={21} height={21} loading="lazy"/></div>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    )
}