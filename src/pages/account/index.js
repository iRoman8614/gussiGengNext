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
import styles from '@/styles/Account.module.scss'

const money = '/money.png'
const Lock = '/Lock.png'
const star = '/Star.png'

export default function Page() {
    const router = useRouter();
    const { t } = useTranslation();
    const { groupId, liga, dailyEntries, coins, totalCoins, updateContext } = useInit();
    const [activeTab, setActiveTab] = useState(1);
    const [userName, setUserName] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [skinIndex, setSkinIndex] = useState((liga > 0 ? liga : 0) || 0)
    const [skins, setSkins] = useState([]);
    const [mySkins, setMySkins] = useState([]);
    const [defaultSkins, setDefaultSkins] = useState([]);
    const [selectedSkin, setSelectedSkin] = useState(null);
    const [defaultSkin, setDefaultSkin] = useState(false)
    const [skinSource, setSkinSource] = useState('');
    const [link, setLink] = useState('')
    const { fetchProfileStats, data: stats } = useProfileStats();
    const { data: friends } = useMyInvitees();
    const { collectAndStart } = useFarmCollect();

    const skinImages = {
        "thug_life": "/skins/thuglifeIcon.png",
        "netrunner": "/skins/netrunnerIcon.png",
        "the_it_dude": "/skins/theItDudeIcon.png",
        "lilith": "/skins/lilithIcon.png",
        // "pablo":"/skins/pabloIcon.png",
        // "icy":"/skins/icyIcon.png",
        // "PabloT":"/skins/pabloTIcon.png"
    };

    const skinFull = {
        "thug_life": "/skins/tlfull.png",
        "netrunner": "/skins/netfull.png",
        "the_it_dude": "/skins/itfull.png",
        "lilith": "/skins/lilfull.png",
        // "pablo":"/skins/pablofull.png",
        // "icy":"/skins/icyfull.png",
        // "PabloT": "/skins/pabloTfull.png"
    };

    const fetchSkins = async () => {
        try {
            const response = await axiosInstance.get('/skin/all');
            const allSkins = response.data.filter(skin => skin.key in skinImages);
            setSkins(allSkins);
            const mySkinsResponse = await axiosInstance.get('/skin/my');
            console.log('mySkinsResponse', mySkinsResponse)
            setMySkins(mySkinsResponse.data);
            const filteredSkins = response.data.filter(skin => skin.id === 1 || (skin.key.startsWith('liga')));
            console.log("Filtered skins:", filteredSkins);
            setDefaultSkins(filteredSkins);
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
                    setSelectedSkin(null)
                } catch (error) {
                    console.error('Ошибка при покупке и экипировке скина:', error);
                    await refreshMySkins()
                }
            }
        } else {
            try {
                await axiosInstance.get(`/skin/update?skinId=${skinId}`);
                await refreshMySkins()
                await collectAndStart()
                setSelectedSkin(null)
            } catch (error) {
                console.error('Ошибка при покупке и экипировке скина:', error);
                await refreshMySkins()
            }
        }
        setSelectedSkin(null)
    };

    // useEffect(() => {
    //     const skinFromSession = sessionStorage.getItem('skin');
    //     const skin = skinFromSession ? JSON.parse(skinFromSession) : null;
    //     if (skin && skin.key) {
    //         setSkinSource(skinData[skin.key] || skinData[skin.key]?.[groupId] || skinData[groupId]?.[liga]?.icon);
    //     } else {
    //         setSkinSource(skinData[groupId]?.[liga]?.icon);
    //     }
    // }, [groupId, liga]);

    useEffect(() => {
        const skinFromSession = sessionStorage.getItem('skin');
        const skin = skinFromSession ? JSON.parse(skinFromSession) : null;
        function getSkinIcon(skinKey, groupId) {
            const skin = skinData[skinKey];
            if (Array.isArray(skin)) {
                const iconEntry = skin.find(entry => entry[groupId]);
                return iconEntry ? iconEntry[groupId] : null;
            } else {
                return skin;
            }
        }
        if (skin && skin.key) {
            const icon = getSkinIcon(skin.key, groupId);
            if (icon) {
                setSkinSource(icon);
            } else {
                const defaultIcon = skinData[groupId][liga].icon;
                setSkinSource(defaultIcon);
            }
        } else {
            const defaultIcon = skinData[groupId][liga].icon;
            setSkinSource(defaultIcon);
        }
    }, [groupId, liga, mySkins]);


    const refreshMySkins = async () => {
        try {
            const response = await axiosInstance.get('/skin/my');
            const skins = response.data;
            setMySkins(skins);
            const activeSkin = skins.find(skin => skin.id === selectedSkin?.id) || skins.find(skin => skin.active);
            if (activeSkin) {
                sessionStorage.setItem('skin', JSON.stringify(activeSkin));
                setSelectedSkin(activeSkin);
                setDefaultSkin(false)
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
        console.log('selectedSkin', selectedSkin)
    }, [selectedSkin])

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

    const ligsNames = [
        'associate',
        'street soldier',
        'hood hustler',
        'block boss',
        'capo',
        'syndicate kingpin',
        'seven',
    ]

    const nextSkin = () => {
        if(skinIndex === 6) {
            setSkinIndex(0)
        } else {
            setSkinIndex(skin => skin + 1)
        }
    }

    const prevSkin = () => {
        if(skinIndex === 0) {
            setSkinIndex(6)
        } else {
            setSkinIndex(skin => skin - 1)
        }
    }

    const getStarsLink = async (skin) => {
        fetchSkins()
        if (!isOwned(skin.id) && skin.stars > 0) {
            try {
                const response = await axiosInstance.get(`/skin/update?skinId=${skin.id}`);
                setLink(response.data.error);
                setSelectedSkin(skin);
                fetchSkins()
            } catch (error) {
                const errorUrl = error.response.data.error;
                console.log('errorUrl', errorUrl)
                setLink(errorUrl)
                setSelectedSkin(skin);
                fetchSkins()
            }
        } else {
            setSelectedSkin(skin);
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
                        >{t('account.skins')}</div>
                        <div className={styles.season}>
                            {t('account.season')}
                            <div className={styles.nickname}>{userName}</div>
                        </div>
                    </div>
                    {activeTab === 1 &&<div className={styles.personalContainer}>
                        <div className={styles.padding}>
                            <div className={styles.avatarContainer}>
                                <Image className={styles.logo} src={teamData[groupId]?.logo} alt={''} width={40} height={40}
                                       loading="lazy"/>
                                <Image className={styles.character} src={skinSource} alt={''} width={100}
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
                            </div>
                            <div>
                                <div className={styles.barItem}>{t('account.cur_balance')}</div>
                                <div className={styles.balance}>{formatNumber(coins, 15)}{' '}<Image src={money} alt={''} width={21} height={21} loading="lazy"/></div>
                            </div>
                        </div>

                    </div>}
                    {activeTab === 2 && <div className={styles.skinContainer}>
                        <div className={styles.padding}>
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
                                <div className={styles.caption}>
                                    {skins[activeIndex].name}
                                </div>
                                <div className={styles.skinBalance}>
                                    <div className={styles.skinBalanceTitle}>{t('account.balance')}</div>
                                    <div>{formatNumber(coins, 15)}{' '}<Image src={money} alt={''} width={18} height={18} loading="lazy"/></div>
                                </div>
                            </div>
                            <div className={styles.list}>
                                <div className={styles.skinListItem} onClick={() => setDefaultSkin(true)}>
                                    <div>{t('account.default')}</div>
                                </div>
                                {skins.map((skin, index) => {
                                    return (
                                        <div key={skin.id} className={styles.skinListItem} onClick={() => getStarsLink(skin)}>
                                            <div>{skin.name}</div>
                                            <div>
                                                {isOwned(skin.id) ? <>{t('account.owned')}</> : <>{
                                                    skin.price > 0 ?
                                                        <>{formatBalance(skin.price)}{' '}<Image src={money} alt={''}
                                                                                                 width={15}
                                                                                                 height={15}
                                                                                                 loading="lazy"/>
                                                        </> : <>{skin.stars > 0 ? <>
                                                                {skin.stars}{' '}<Image src={star} alt={''} width={15}
                                                                                        height={15} loading="lazy"/>
                                                            </> :
                                                            <div onClick={() => {
                                                                router.push('/tasks')
                                                            }}>{t('account.task')}</div>}</>
                                                }</>}
                                            </div>
                                        </div>);
                                })}
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
            {selectedSkin && (
                <div className={styles.skinPopUp}>
                    <div className={styles.popUpClose} onClick={() => {
                        setSelectedSkin(null)
                    }}>x</div>
                    <div className={styles.modalBorder}>
                        <div className={styles.popUpContent}>
                            <Image className={styles.fullSkin} src={skinFull[selectedSkin?.key]} alt={''} width={130} height={220} />
                            <div className={styles.popUpText}>{selectedSkin?.name}</div>
                            {isOwned(selectedSkin.id) ?
                                <div></div> :
                                <>
                                    {selectedSkin.key === 'thug_life' ?
                                        <div className={styles.popUpText}>10 daily entries</div> :
                                        <>
                                            {selectedSkin.stars > 0 ?
                                                <div className={styles.popUpText}>{selectedSkin.stars}{' '}<Image src={star} alt={''} width={15} height={15} loading="lazy"/>
                                                </div> :
                                                <div className={styles.popUpText}>{selectedSkin?.price}{' '}<Image
                                                    src={money} alt={''} width={15} height={15} loading="lazy"/>
                                                </div>}
                                        </>
                                    }
                                </>
                            }
                        </div>
                    </div>
                    <div className={styles.modalBorder}>
                        {!isOwned(selectedSkin.id) && selectedSkin.stars > 0  ? <>
                            <Link
                                className={styles.link}
                                href={link}
                            >
                               <div className={styles.modalBtn}>
                                   {isOwned(selectedSkin.id) ? <>{t('account.equip')}</> : <>{t('account.buy')}</>}
                               </div>
                            </Link>
                        </> : <>
                            <div
                                className={styles.modalBtn}
                                onClick={() => handlePurchaseOrEquip(selectedSkin.id, selectedSkin.price)}
                            >
                                {isOwned(selectedSkin.id) ? <>{t('account.equip')}</> : <>{t('account.buy')}</>}
                            </div>
                        </>}
                    </div>
                </div>
            )}
            {defaultSkin &&
                <div className={styles.skinPopUp}>
                    <div className={styles.popUpClose} onClick={() => setDefaultSkin(false)}>x</div>
                    <div className={styles.row}>
                        <div className={styles.navLeft} onClick={prevSkin}>
                            <Image src={'/ArrowWhite.png'} alt={''} width={15} height={15} loading="lazy" />
                        </div>
                        <div className={styles.modalBorder}>
                            <div className={styles.popUpContent}>
                                <Image className={styles.fullSkin} src={skinData[groupId][skinIndex].icon} alt={''} width={130} height={220} />
                                <div className={styles.popUpText}>{ligsNames[skinIndex]}</div>
                                {(skinIndex > liga) &&
                                    <div className={styles.lock}>
                                        <Image width={70} height={70} alt="" src={Lock} priority/>
                                        <div className={styles.lockDesk}>reach next leagues</div>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className={styles.navRight} onClick={nextSkin}>
                            <Image src={'/ArrowWhite.png'} alt={''} width={15} height={15} loading="lazy" />
                        </div>
                    </div>
                    {(skinIndex > liga) ? <div className={styles.modalBorderHidden}>
                        <div className={styles.modalBorder}>
                            <div
                                className={styles.modalBtn}
                            >{t('account.equip')}</div>
                        </div>
                    </div> : <div>
                        <div className={styles.modalBorder}>
                            <div
                                className={styles.modalBtn}
                                onClick={() => handlePurchaseOrEquip(defaultSkins[skinIndex].id, defaultSkins[skinIndex].price)}
                            >{t('account.equip')}</div>
                        </div>
                    </div>}
                </div>}
        </div>
    )
}