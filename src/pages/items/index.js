import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import {useTranslation} from "react-i18next";
import { useInit } from '@/context/InitContext';
import {formatNumber} from "@/utils/formatNumber";
import axiosInstance from "@/utils/axios";
import {useRouter} from "next/router";
import Link from "next/link";
import {Swiper, SwiperSlide} from "swiper/react";
import {Controller, Navigation} from "swiper/modules";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/controller';
import styles from '@/styles/Items.module.scss'

const money = '/money.png'
const star = '/Star.png'

export default function Page() {
    const router = useRouter();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState(1);
    const {coins } = useInit();
    const [itemsCat1, setItemsCat1] = useState([])
    const [itemsCat2, setItemsCat2] = useState([])
    const [itemsCat3, setItemsCat3] = useState([])
    const [itemsCat4, setItemsCat4] = useState([])
    const [myItems, setMyItems] = useState([])
    const [selectedItem, setSelectedItem] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);

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

    const itemList = [
        {
            "id": 9,
            "name": "Golden Star",
            "key": "bracelet.wrist.golden_star",
            "price": 0,
            "stars": 1,
            "category": {
                "id": 1,
                "name": "bracelet",
                "key": "bracelet",
                "max": 1
            }
        },
        {
            "id": 2,
            "name": "Golden Ara",
            "key": "bracelet.wrist.golden_ara",
            "price": 0,
            "stars": 0,
            "category": {
                "id": 1,
                "name": "bracelet",
                "key": "bracelet",
                "max": 1
            }
        },
        {
            "id": 1,
            "name": "Diamond Tissue",
            "key": "ring.ring_finger.diamond_tissue",
            "price": 2500000,
            "stars": 0,
            "category": {
                "id": 1,
                "name": "bracelet",
                "key": "bracelet",
                "max": 1
            }
        },
        {
            "id": 3,
            "name": "Chromium G",
            "key": "bracelet.wrist.ghromium_g",
            "price": 0,
            "stars": 250,
            "category": {
                "id": 1,
                "name": "bracelet",
                "key": "bracelet",
                "max": 1
            }
        },
        {
            "id": 10,
            "name": "test 1",
            "key": "test1",
            "price": 0,
            "stars": 0,
            "category": {
                "id": 1,
                "name": "bracelet",
                "key": "bracelet",
                "max": 1
            }
        },
        {
            "id": 11,
            "name": "test 2",
            "key": "test2",
            "price": 0,
            "stars": 0,
            "category": {
                "id": 1,
                "name": "bracelet",
                "key": "bracelet",
                "max": 1
            }
        },
        {
            "id": 12,
            "name": "test 3",
            "key": "test3",
            "price": 0,
            "stars": 0,
            "category": {
                "id": 1,
                "name": "bracelet",
                "key": "bracelet",
                "max": 1
            }
        }
    ]

    const handleTab = (tab) => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
        setActiveTab(tab)
        setActiveIndex(0)
    }

    const fetchItems = async () => {
        try {
            const response1 = await axiosInstance.get('/item/find-category?categoryId=1');
            setItemsCat1(response1.data);
            const response2 = await axiosInstance.get('/item/find-category?categoryId=2');
            setItemsCat2(response2.data);
            const response3 = await axiosInstance.get('/item/find-category?categoryId=3');
            setItemsCat3(response3.data);
            const response4 = await axiosInstance.get('/item/find-category?categoryId=4');
            setItemsCat4(response4.data);
            const myItemsList = await axiosInstance.get('/item/my')
            setMyItems(myItemsList.data)
        } catch (error) {
            console.error('Error fetching skins:', error);
        }
    };

    const isOwned = (itemId) => {
        console.log('skinId isOwned', itemId)
        console.log('myItems', myItems)
        return myItems.some(itemId => itemId.id === itemId);
    }

    useEffect(() => {
        fetchItems()
    }, [])

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
                    {activeTab === 1 && <div className={styles.personalContainer}>
                        <div className={styles.padding}>
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
                                        {itemsCat1.map((item, index) => (
                                            <SwiperSlide key={item.id} className={styles.slide}>
                                                <Image
                                                    key={index}
                                                    width={170}
                                                    height={234}
                                                    src={'/skins/thuglifeIcon.png'}
                                                    alt={''}
                                                    className={styles.icon}
                                                    loading="lazy"
                                                    onClick={() => setSelectedItem(item)}
                                                />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                    <button className={styles.navRight} onClick={handleSlideNext}>
                                        <Image src={'/ArrowWhite.png'} alt={''} width={20} height={20} loading="lazy" />
                                    </button>
                                </div>
                            <div className={styles.list}>
                                {itemsCat1.map((item, index) => {
                                    return(
                                        <div key={item.id} className={styles.ListItem} onClick={() => setSelectedItem(item)}>
                                            <div className={styles.itemRow}>
                                                <div className={styles.itemImage}></div>
                                                <div>{item.name}</div>
                                            </div>
                                            <div>
                                                {<>{
                                                    item.price > 0 ?
                                                        <>{item.price}{' '}<Image src={money} alt={''}
                                                                                                 width={15}
                                                                                                 height={15}
                                                                                                 loading="lazy"/>
                                                        </> : <>{item.stars > 0 ? <>
                                                                {item.stars}{' '}<Image src={star} alt={''} width={15}
                                                                                        height={15} loading="lazy"/>
                                                            </> :
                                                            <div onClick={() => {
                                                                router.push('/tasks')
                                                            }}>{t('account.task')}</div>}</>
                                                }</>}
                                            </div>
                                        </div>
                                    )
                                })}
                                {itemsCat2.map((item, index) => {
                                    return(
                                        <div key={item.id} className={styles.ListItem} onClick={() => setSelectedItem(item)}>
                                            <div className={styles.itemRow}>
                                                <div className={styles.itemImage}></div>
                                                <div>{item.name}</div>
                                            </div>
                                            <div>
                                                {<>{
                                                    item.price > 0 ?
                                                        <>{item.price}{' '}<Image src={money} alt={''}
                                                                                  width={15}
                                                                                  height={15}
                                                                                  loading="lazy"/>
                                                        </> : <>{item.stars > 0 ? <>
                                                                {item.stars}{' '}<Image src={star} alt={''} width={15}
                                                                                        height={15} loading="lazy"/>
                                                            </> :
                                                            <div onClick={() => {
                                                                router.push('/tasks')
                                                            }}>{t('account.task')}</div>}</>
                                                }</>}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div>
                                <div className={styles.barItem}>{t('account.cur_balance')}</div>
                                <div className={styles.balance}>{formatNumber(coins, 15)}{' '}<Image src={money} alt={''} width={21} height={21} loading="lazy"/></div>
                            </div>
                        </div>
                    </div>}
                    {activeTab === 2 && <div className={styles.skinContainer}>
                        <div className={styles.padding}>
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
                                    {itemsCat3.map((item, index) => (
                                        <SwiperSlide key={item.id} className={styles.slide}>
                                            <Image
                                                key={index}
                                                width={170}
                                                height={234}
                                                src={'/skins/thuglifeIcon.png'}
                                                alt={''}
                                                className={styles.icon}
                                                loading="lazy"
                                                onClick={() => setSelectedItem(item)}
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <button className={styles.navRight} onClick={handleSlideNext}>
                                    <Image src={'/ArrowWhite.png'} alt={''} width={20} height={20} loading="lazy" />
                                </button>
                            </div>
                            <div className={styles.list}>
                                {itemsCat3.map((item, index) => {
                                    return(
                                        <div key={item.id} className={styles.ListItem} onClick={() => setSelectedItem(item)}>
                                            <div className={styles.itemRow}>
                                                <div className={styles.itemImage}></div>
                                                <div>{item.name}</div>
                                            </div>
                                            <div>
                                                {<>{
                                                    item.price > 0 ?
                                                        <>{item.price}{' '}<Image src={money} alt={''}
                                                                                  width={15}
                                                                                  height={15}
                                                                                  loading="lazy"/>
                                                        </> : <>{item.stars > 0 ? <>
                                                                {item.stars}{' '}<Image src={star} alt={''} width={15}
                                                                                        height={15} loading="lazy"/>
                                                            </> :
                                                            <div onClick={() => {
                                                                router.push('/tasks')
                                                            }}>{t('account.task')}</div>}</>
                                                }</>}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div>
                                <div className={styles.barItem}>{t('account.cur_balance')}</div>
                                <div className={styles.balance}>{formatNumber(coins, 15)}{' '}<Image src={money} alt={''} width={21} height={21} loading="lazy"/></div>
                            </div>
                        </div>
                    </div>}
                    {activeTab === 3 && <div className={styles.skinContainer}>
                        <div className={styles.padding}>
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
                                    {itemsCat4.map((item, index) => (
                                        <SwiperSlide key={item.id} className={styles.slide}>
                                            <Image
                                                key={index}
                                                width={170}
                                                height={234}
                                                src={'/skins/thuglifeIcon.png'}
                                                alt={''}
                                                className={styles.icon}
                                                loading="lazy"
                                                onClick={() => setSelectedItem(item)}
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <button className={styles.navRight} onClick={handleSlideNext}>
                                    <Image src={'/ArrowWhite.png'} alt={''} width={20} height={20} loading="lazy" />
                                </button>
                            </div>
                            <div className={styles.list}>
                                {itemsCat4.map((item, index) => {
                                    return(
                                        <div key={item.id} className={styles.ListItem} onClick={() => setSelectedItem(item)}>
                                            <div className={styles.itemRow}>
                                                <div className={styles.itemImage}></div>
                                                <div>{item.name}</div>
                                            </div>
                                            <div>
                                                {<>{
                                                    item.price > 0 ?
                                                        <>{item.price}{' '}<Image src={money} alt={''}
                                                                                  width={15}
                                                                                  height={15}
                                                                                  loading="lazy"/>
                                                        </> : <>{item.stars > 0 ? <>
                                                                {item.stars}{' '}<Image src={star} alt={''} width={15}
                                                                                        height={15} loading="lazy"/>
                                                            </> :
                                                            <div onClick={() => {
                                                                router.push('/tasks')
                                                            }}>{t('account.task')}</div>}</>
                                                }</>}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div>
                                <div className={styles.barItem}>{t('account.cur_balance')}</div>
                                <div className={styles.balance}>{formatNumber(coins, 15)}{' '}<Image src={money} alt={''} width={21} height={21} loading="lazy"/></div>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
            {selectedItem && (
                <div className={styles.skinPopUp}>
                    <div className={styles.popUpClose} onClick={() => {
                        setSelectedItem(null)
                    }}>x</div>
                    <div className={styles.modalBorder}>
                        <div className={styles.popUpContent}>
                            <Image className={styles.fullSkin} src={'/skins/thuglifeIcon.png'} alt={''} width={130} height={220} />
                            <div className={styles.popUpText}>{selectedItem?.name}</div>
                            {(!isOwned(selectedItem.id) && selectedItem.stars > 0 )?
                                <div className={styles.popUpText}>{selectedItem.stars}{' '}<Image src={star} alt={''} width={15} height={15} loading="lazy"/>
                                </div> :
                                <div className={styles.popUpText}>{selectedItem?.price}{' '}<Image
                                    src={money} alt={''} width={15} height={15} loading="lazy"/>
                                </div>
                            }
                        </div>
                    </div>
                    <div className={styles.modalBorder}>
                        {!isOwned(selectedItem.id) && selectedItem.stars > 0  ? <>
                            {/*<Link*/}
                            {/*    className={styles.link}*/}
                            {/*    // href={link}*/}
                            {/*>*/}
                                <div className={styles.modalBtn}>
                                    {isOwned(selectedItem.id) ? <>{t('account.equip')}</> : <>{t('account.buy')}</>}
                                </div>
                            {/*</Link>*/}
                        </> : <>
                            <div
                                className={styles.modalBtn}
                                // onClick={() => handlePurchaseOrEquip(selectedSkin.id, selectedSkin.price)}
                            >
                                {isOwned(selectedItem.id) ? <>{t('account.equip')}</> : <>{t('account.buy')}</>}
                            </div>
                        </>}
                    </div>
                </div>
            )}
        </div>
    )
}