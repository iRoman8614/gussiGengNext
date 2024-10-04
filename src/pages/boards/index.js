import React, {useEffect, useRef, useState} from "react";
import Image from "next/image";
import {useRouter} from "next/router";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Controller } from 'swiper/modules';
import {ListItem} from "@/components/ListItem/ListItem";
import axiosInstance from "@/utils/axios";

import {ratingData} from '@/mock/ratingData'

import styles from '@/styles/Boards.module.scss'

const bg = '/backgrounds/leaderboardBG.png'

export default function Page() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [teamId, setTeamId] = useState(1)
    const [currentWins, setCurrentWins] = useState(0)
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState(null);
    const [balance, setBalance] = useState(0)
    const [liga, setLiga] = useState(1)
    const [userAvatar, setUserAvatar] = useState(null)
    const router = useRouter();

    const ligsLimits = ['10', '25', '50', '100', '250', '500', '500+']
    const length = currentWins / ligsLimits[activeIndex] * 100

    useEffect(() => {
        if (typeof window !== "undefined") {
            const init = JSON.parse(localStorage.getItem("init"));
            const result = getAvatarAndImageByIndex(teamId);
            if (init && init.group) {
                setTeamId(init.group.id);
                setUserAvatar(result.avatar);
            }
            const start = JSON.parse(localStorage.getItem('start'));
            if (start) {
                setBalance(start.balance)
            }
        }
    }, [])

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
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const search = window.Telegram.WebApp.initData;
            const urlParams = new URLSearchParams(search);
            const userParam = urlParams.get('user');
            if (userParam) {
                const decodedUserParam = decodeURIComponent(userParam);
                const userObject = JSON.parse(decodedUserParam);
                setUserId(userObject.id);
                setUserName(userObject.username);
                fetchStats(userObject.id);
                fetch(`/api/getAvatar?userId=${userObject.id}`)
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.avatar) {
                            setUserAvatar(data.avatar);
                        }
                    })
                    .catch((error) => {
                        console.error('Error fetching avatar:', error);
                    });
            } else {
                setUserId(111);
                setUserName('you');
                fetchStats(111);
            }
        }
    }, []);

    const fetchStats = async (userId) => {
        try {
            const response = await axiosInstance.get(`/profile/stats?profileId=${userId}`);
            if (response.status === 400 || response.status === 401 || response.status === 403) {
                // Вызов /profile/init для обновления токена
                await axiosInstance.get(`/profile/init?profileId=${userId}`)
                    .then(initResponse => {
                        const data = initResponse.data;
                        localStorage.setItem('GWToken', data.jwt);
                    })
                    .catch(error => {
                        throw error;
                    });
                const retryResponse = await axiosInstance.get(`/profile/stats?profileId=${userId}`);
                const retryData = retryResponse.data;
                setCurrentWins(retryData.victory);
                setLiga(retryData.liga);
            } else {
                const data = response.data;
                setCurrentWins(data.victory);
                setLiga(data.liga);
            }
        } catch (error) {
            console.error('Ошибка при получении статистики:', error);
        }
    };

    useEffect(() => {
        console.log('Current avatar:', userAvatar);
    }, [userAvatar]);

    const characters ={
        1: [
            { name: 'Associate', icon: '/skins/gg.png' },
            { name: 'Street soldier', icon: '/skins/gg2.png' },
            { name: 'Hood hustler', icon: '/skins/gg3.png' },
            { name: 'Block boss', icon: '/skins/gg4.png' },
            { name: 'CApo', icon: '/skins/gg5.png' },
            { name: 'Syndicate kingpin', icon: '/skins/gg6.png' },
        ],
        2: [
            { name: 'Associate', icon: '/skins/bg.png' },
            { name: 'Street soldier', icon: '/skins/bg2.png' },
            { name: 'Hood hustler', icon: '/skins/bg3.png' },
            { name: 'Block boss', icon: '/skins/bg4.png' },
            { name: 'CApo', icon: '/skins/bg5.png' },
            { name: 'Syndicate kingpin', icon: '/skins/bg6.png' },
        ],
        3: [
            { name: 'Associate', icon: '/skins/yg.png' },
            { name: 'Street soldier', icon: '/skins/yg2.png' },
            { name: 'Hood hustler', icon: '/skins/yg3.png' },
            { name: 'Block boss', icon: '/skins/yg4.png' },
            { name: 'CApo', icon: '/skins/yg5.png' },
            { name: 'Syndicate kingpin', icon: '/skins/yg6.png' },
        ],
        4: [
            { name: 'Associate', icon: '/skins/rg.png' },
            { name: 'Street soldier', icon: '/skins/rg2.png' },
            { name: 'Hood hustler', icon: '/skins/rg3.png' },
            { name: 'Block boss', icon: '/skins/rg4.png' },
            { name: 'CApo', icon: '/skins/rg5.png' },
            { name: 'Syndicate kingpin', icon: '/skins/rg6.png' },
        ],
    };

    function getAvatarAndImageByIndex(index) {
        let avatar, image;
        switch (index) {
            case 1:
                avatar = '/listItemsBG/avaG.png';
                image = '/listItemsBG/1grbg.png';
                break;
            case 2:
                avatar = '/listItemsBG/avaB.png';
                image = '/listItemsBG/2bvbg.png';
                break;
            case 3:
                avatar = '/listItemsBG/avaY.png';
                image = '/listItemsBG/3yfbg.png';
                break;
            case 4:
                avatar = '/listItemsBG/avaR.png';
                image = '/listItemsBG/4rrbg.png';
                break;
            default:
                throw new Error("Invalid index. Must be between 1 and 4.");
        }
        return { avatar, image };
    }
    const result = getAvatarAndImageByIndex(teamId);

    const Me = {
        avatar: userAvatar,
        nickname: userName,
        sum: balance,
        image: result.image
    }

    const swiperRef = useRef(null);
    const handleSlidePrev = () => {
        if (swiperRef.current) {
            swiperRef.current.slidePrev();
        }
    };

    const handleSlideNext = () => {
        if (swiperRef.current) {
            swiperRef.current.slideNext();
        }
    };

    const handleSlideChange = (swiper) => {
        setActiveIndex(swiper.realIndex);
    };

    let startIndex = 1;

    const firstPart = ratingData[activeIndex].slice(0, -2).map((item, index) => {
        const listItemIndex = startIndex + index;
        return <ListItem key={listItemIndex} item={item} index={listItemIndex} />;
    });
    startIndex += ratingData[activeIndex].length - 2;

    const meElement = activeIndex + 1 === 1 && (
        <div className={styles.me}>
            <ListItem item={Me} index={startIndex} me={true} />
        </div>
    );
    if (activeIndex + 1 === 1) {
        startIndex++;
    }
    const lastPart = ratingData[activeIndex].slice(-2).map((item, index) => {
        const listItemIndex = startIndex + index;
        return <ListItem key={listItemIndex} item={item} index={listItemIndex} />;
    });

    return(
        <div className={styles.root}>
            <div className={styles.containerSwiper}>
                <Swiper
                    modules={[Navigation, Controller]}
                    spaceBetween={-3}
                    slidesPerView={3}
                    centeredSlides={true}
                    loop={true}
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    onSlideChange={handleSlideChange}
                    className={styles.swiper}
                >
                    {characters[teamId].map((character, index) => (
                        <SwiperSlide
                            key={index}
                            className={index === activeIndex ? styles.activeSlide : styles.inactiveSlide}
                        >
                            <div className={index === activeIndex ? styles.activeSlideImageWrapper : styles.inactiveSlideImageWrapper}>
                                <Image
                                    width={index === activeIndex ? 100 : 80}
                                    height={index === activeIndex ? 194 : 155}
                                    src={character.icon}
                                    alt={''}
                                    className={styles.icon}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <div className={styles.navigation}>
                <button className={styles.navLeft} onClick={handleSlidePrev}>
                    <Image src={'/Arrow.png'} alt={''} width={15} height={15} />
                </button>
                <div className={styles.caption}>
                    <span>{characters[teamId][activeIndex].name}</span>
                </div>
                <button className={styles.navRight} onClick={handleSlideNext}>
                    <Image src={'/Arrow.png'} alt={''} width={15} height={15} />
                </button>
            </div>
            <div className={styles.progressBar}>
                <div className={styles.progress} style={{width: `${length}%`}}></div>
            </div>
            <div className={styles.winsCounter}>{`wins ${currentWins}/${ligsLimits[activeIndex]}`}</div>
            <Image src={bg} alt={''} className={styles.bg} width={450} height={1000} />
            <div className={styles.container}>
                {firstPart}
                {meElement}
                {lastPart}
            </div>
        </div>
    )
}



