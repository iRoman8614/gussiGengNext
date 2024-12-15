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


import skinData from '@/mock/skinsData'
import teamData from "@/mock/teamsData";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/controller';
import styles from '@/styles/Account.module.scss'
import {toast} from "react-toastify";

const money = '/money.png'

export default function Page() {
    const router = useRouter();
    const { t } = useTranslation();
    const { groupId, liga, dailyEntries, coins, totalCoins, updateContext } = useInit();
    const [activeTab, setActiveTab] = useState(1);
    const [userName, setUserName] = useState(null);
    const [tasks, setTasks] = useState(0)
    const [activeIndex, setActiveIndex] = useState(0);
    const [skins, setSkins] = useState([]);
    const [mySkins, setMySkins] = useState([]);
    const [selectedSkin, setSelectedSkin] = useState(null);
    const { fetchProfileStats, data: stats } = useProfileStats();
    const { data: friends } = useMyInvitees();
    const { collectAndStart } = useFarmCollect();

    const skinImages = {
        "Thug Life": "/skins/thuglifeIcon.png",
        "Netrunner": "/skins/netrunnerIcon.png",
        "skin_3": "/skins/theItDudeIcon.png",
        "Lilith": "/skins/lilithIcon.png"
    };

    const skinFull = {
        "Thug Life": "/skins/tlfull.png",
        "Netrunner": "/skins/netfull.png",
        "skin_3": "/skins/itfull.png",
        "Lilith": "/skins/lilfull.png"
    };

    const fetchSkins = async () => {
        try {
            const response = await axiosInstance.get('/skin/all');
            const filteredSkins = response.data.filter(skin => skin.key in skinImages);
            setSkins(filteredSkins);
            const mySkinsResponse = await axiosInstance.get('/skin/my');
            setMySkins(mySkinsResponse.data);
        } catch (error) {
            console.error('Error fetching skins:', error);
        }
    };

    useEffect(() => {
        fetchSkins();
    }, []);

    const isOwned = (skinId) => {
        console.log('skinId isOwned', skinId)
        return mySkins.some(mySkin => mySkin.id === skinId);
    }
    const isActive = (skinId) => {
        console.log('skinId isActive', skinId)
        return mySkins.some(mySkin => mySkin.id === skinId && mySkin.active);
    }

    const handlePurchaseOrEquip = async (skinId, price) => {
        if (!isOwned(skinId)) {
            if (coins < price) {
                toast.alert("You dont have enought money");
            } else {
                try {
                    await axiosInstance.get(`/skin/update?skinId=${skinId}`);
                    await refreshMySkins()
                    await collectAndStart()
                } catch (error) {
                    console.error('Ошибка при покупке и экипировке скина:', error);
                }
            }
        } else {
            try {
                await axiosInstance.get(`/skin/update?skinId=${skinId}`);
                await refreshMySkins()
                await collectAndStart()
            } catch (error) {
                console.error('Ошибка при покупке и экипировке скина:', error);
            }
        }
    };

    const refreshMySkins = async () => {
        try {
            const response = await axiosInstance.get('/skin/my');
            const skins = response.data;
            setMySkins(skins);
            const activeSkin = skins.find(skin => skin.id === selectedSkin?.id) || skins.find(skin => skin.active);
            if (activeSkin) {
                sessionStorage.setItem('skin', JSON.stringify(activeSkin));
                setSelectedSkin(activeSkin);
            }
        } catch (error) {
            console.error('Ошибка при получении списка скинов:', error);
        }
    };

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

    useEffect(() => {
        fetchProfileStats()
        updateContext()
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const search = window.Telegram.WebApp.initData;
            const urlParams = new URLSearchParams(search);
            const userParam = urlParams.get('user');

            if (userParam) {
                const decodedUserParam = decodeURIComponent(userParam);
                const userObject = JSON.parse(decodedUserParam);
                setUserName(userObject.username);
            }
        }

    }, []);

    const handleTab = (tab) => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
        setActiveTab(tab)
    }

    const fetchCompletedTasks = async () => {
        try {
            const response = await axiosInstance.get('/task/completed-tasks');
            setTasks(response.data.length)
        } catch (error) {
            console.error('Error fetching completed tasks:', error);
        }
    };

    useEffect(()=>{
        fetchCompletedTasks()
    }, [])

    const formatBalance = (balance) => {
        if (balance >= 1e12) return (balance / 1e12).toFixed(1) + 't';
        if (balance >= 1e9) return (balance / 1e9).toFixed(1) + 'b';
        if (balance >= 1e6) return (balance / 1e6).toFixed(1) + 'm';
        if (balance >= 1e3) return (balance / 1e3).toFixed(1) + 'k';
        return balance;
    };

    const swiperRef = useRef(null);

    const handleSlideChange = (swiper) => {
        setActiveIndex(swiper.realIndex);
    };

    const handleSlidePrev = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
        if (swiperRef.current) {
            swiperRef.current.slidePrev();
        }
    };

    const handleSlideNext = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
        if (swiperRef.current) {
            swiperRef.current.slideNext();
        }
    };

    return(
        <div className={styles.root}>
            <div className={styles.container}>
                <div className={styles.block}>
                    <div className={styles.buttonSet}>
                        <div className={styles.folderBtnStats}
                             style={{
                                 zIndex: activeTab === 1 ? 112 : 110,
                                 marginBottom:  activeTab === 1 ? '0px' : '-12px',
                                 borderRight:  activeTab === 1 ? '2px solid #3842a4' : 'none',
                             }}
                             onClick={() => handleTab(1)}
                        >{t('account.stats')}</div>
                        <div
                            className={styles.folderBtnSkins}
                            style={{
                                zIndex: activeTab === 2 ? 113 : 110,
                                marginBottom:  activeTab === 2 ? '-0px' : '2px',
                            }}
                            onClick={() => handleTab(2)}
                        >skins</div>
                        <div className={styles.season}>
                            {t('account.season')}
                            <div className={styles.nickname}>{userName}</div>
                        </div>
                    </div>
                    {activeTab === 1 &&<div className={styles.personalContainer}>
                        <div className={styles.avatarContainer}>
                            <Image className={styles.logo} src={teamData[groupId]?.logo} alt={''} width={40} height={40}
                                   loading="lazy"/>
                            <Image className={styles.character} src={skinData[groupId]?.[liga]?.icon} alt={''} width={100}
                                   height={178} loading="lazy"/>
                        </div>
                        <div className={styles.stats}>
                            <div className={styles.nickname}>{t('account.league')} {stats?.liga}</div>
                            <div className={styles.stat}>
                                {t('account.total')} <p>{stats?.count}</p>
                            </div>
                            <div className={styles.stat}>
                                {t('account.wins')} <p>{stats?.victory}</p>
                            </div>
                            <div className={styles.stat}>
                                {t('account.defeats')} <p>{stats?.lost}</p>
                            </div>
                            <div className={styles.stat}>
                                {t('account.winRate')} <p>{stats?.count === 0 ? '0%' : `${((stats?.victory / stats?.count) * 100).toFixed(2)}%`}</p>
                            </div>
                        </div>
                        <div className={styles.barBlock}>
                            <div className={styles.barItem}>{t('account.Total')}</div>
                            <div className={styles.barItemStats}>{formatNumber(totalCoins)}</div>
                            {/*<div className={styles.barItem}>total skins owned</div>*/}
                            {/*<div className={styles.barItemStats}>1/11</div>*/}
                            <div className={styles.barItem}>{t('account.friends')}</div>
                            <div className={styles.barItemStats}>{friends.length}</div>
                            <div className={styles.barItem}>{t('account.login')}</div>
                            <div className={styles.barItemStats}>{dailyEntries}</div>
                            <div className={styles.barItem}>{t('account.tasks')}</div>
                            <div className={styles.barItemStats}>{tasks}</div>
                        </div>
                        <div>
                            <div className={styles.barItem}>{t('account.balance')}</div>
                            <div className={styles.balance}>{formatNumber(coins, 15)}{' '}<Image src={money} alt={''} width={21} height={21} loading="lazy"/></div>
                        </div>
                    </div>}
                    {activeTab === 2 && <div className={styles.skinContainer}>
                        <div className={styles.skinSwiper}>
                            {isOwned(skins[activeIndex].id) && <div className={styles.owned}>
                                {
                                    isActive(skins[activeIndex].id) && <Image className={styles.check} src={"/check.png"} alt={''} width={30} height={24} />
                                }
                            </div>}
                            <div className={styles.containerSwiper}>
                                <button className={styles.navLeft} onClick={handleSlidePrev}>
                                    <Image src={'/ArrowWhite.png'} alt={''} width={20} height={20} loading="lazy" />
                                </button>
                                <Swiper
                                    modules={[Navigation, Controller]}
                                    slidesPerView={1}
                                    centeredSlides={false}
                                    spaceBetween={10}
                                    loop={true}
                                    onSwiper={(swiper) => {
                                        swiperRef.current = swiper;
                                    }}
                                    onSlideChange={handleSlideChange}
                                    className={styles.swiper}
                                >
                                    {skins.map((skin, index) => (
                                        <SwiperSlide key={skin.id} className={styles.slide}>
                                            <Image
                                                key={index}
                                                width={170}
                                                height={234}
                                                src={skinImages[skin.key]}
                                                alt={''}
                                                className={styles.icon}
                                                loading="lazy"
                                                onClick={() => setSelectedSkin(skin)}
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <button className={styles.navRight} onClick={handleSlideNext}>
                                    <Image src={'/ArrowWhite.png'} alt={''} width={20} height={20} loading="lazy" />
                                </button>
                            </div>
                            {/*<div className={styles.caption}>*/}
                            {/*    {skinData.paid[activeIndex].name}*/}
                            {/*</div>*/}
                            <div className={styles.caption}>
                                {skins[activeIndex].name}
                            </div>
                            <div className={styles.skinBalance}>
                                <div className={styles.skinBalanceTitle}>balance</div>
                                <div>{formatNumber(coins, 15)}{' '}<Image src={money} alt={''} width={18} height={18} loading="lazy"/></div>
                            </div>
                        </div>
                        <div className={styles.list}>
                            {skins.map((skin, index) => {
                                return (
                                    <div key={skin.id} className={styles.skinListItem} onClick={() => setSelectedSkin(skin)}>
                                        <div>{skin.name}</div>
                                        <div>{formatBalance(skin.price)}{' '}<Image src={money} alt={''} width={15} height={15} loading="lazy"/></div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>}
                </div>
            </div>
            {selectedSkin && (
                <div className={styles.skinPopUp}>
                    <div className={styles.popUpClose} onClick={() => setSelectedSkin(null)}>x</div>
                    <div className={styles.modalBorder}>
                        <div className={styles.popUpContent}>
                            <Image className={styles.fullSkin} src={skinFull[selectedSkin?.key]} alt={''} width={130} height={220} />
                            <div className={styles.popUpText}>{selectedSkin?.name}</div>
                            {isOwned(selectedSkin.id) ? <div></div> : <div className={styles.popUpText}>{selectedSkin?.price}{' '}<Image src={money} alt={''}
                                                                                                width={15} height={15}
                                                                                                loading="lazy"/></div>}
                        </div>
                    </div>
                    <div className={styles.modalBorder}>
                        <div
                            className={styles.modalBtn}
                            onClick={() => handlePurchaseOrEquip(selectedSkin.id, selectedSkin.price)}
                        >
                            {isOwned(selectedSkin.id) ? "equip" : "buy"}
                        </div>
                    </div>
                    {/*<div className={styles.modalBorder}>*/}
                    {/*    <div className={styles.modalBtn} onClick={() => handleBuySkin(selectedSkin.id)}>buy</div>*/}
                    {/*</div>*/}
                    {/*<div className={isOwned(selectedSkin.id) ? styles.modalBtn : styles.modalBtnHidden} >*/}
                    {/*    <div className={styles.modalBtn} onClick={() => handleEquipSkin(selectedSkin.id)}>equip</div>*/}
                    {/*</div>*/}
                </div>
            )}
        </div>
    )
}