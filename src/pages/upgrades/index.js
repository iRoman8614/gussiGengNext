import React, {useEffect, useState} from 'react';
import Image from "next/image";
import {useRouter} from "next/router";
import axiosInstance from '@/utils/axios';

import {ItemPlaceholder} from "@/components/itemPlaceholder/ItemPlaceholder";
import {TaskBtn} from "@/components/taskBtn/TaskBtn";

import styles from '@/styles/Upgrades.module.scss'

const bg = '/backgrounds/accountBG.png'
const money = '/money.png'

export default function Page() {
    const router = useRouter();
    const [balance, setBalance] = useState(0);
    const [activeTab, setActiveTab] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [limitLevels, setLimitLevels] = useState([]);
    const [rateLevels, setRateLevels] = useState([]);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false); // Модальное окно для апгрейда
    const [selectedItem, setSelectedItem] = useState(null);

    const Tasks = {
        daily: [
            {
                name: 'daily login',
                desc: 'daily login',
                complite: 'false',
                action: 'modal'
            },
            {
                name: 'PLay 5 games',
                desc: '4/5',
                complite: 'false',
                action: 'navigate',
                path: '/pvp'
            },
        ],
        main: [
            {
                name: 'subscribe to GW telegram',
                desc: '',
                complite: 'false',
                action: 'link',
                url: 'https://t.me/gang_wars_game'
            },
            {
                name: 'subscribe to Gw x',
                desc: '',
                complite: 'true',
                action: 'link',
                url: 'https://twitter.com'
            },
            {
                name: 'invite 5 friends',
                desc: '3/5',
                complite: 'false',
                action: 'navigate',
                path: '/friends'
            },
            {
                name: 'win 10 pvp games',
                desc: '7/10',
                complite: 'false',
                action: 'navigate',
                path: '/pvp'
            },
        ]
    };

    const fetchLevels = async () => {
        try {
            const limitResponse = await axiosInstance.get(`/farm/limit-levels`);
            const limitLevelsWithType = limitResponse.data.map(level => ({ ...level, type: 'limit' }));
            setLimitLevels(limitLevelsWithType);
            const rateResponse = await axiosInstance.get(`/farm/rate-levels`);
            const rateLevelsWithType = rateResponse.data.map(level => ({ ...level, type: 'rate' }));
            setRateLevels(rateLevelsWithType);
        } catch (error) {
            console.error('Ошибка при загрузке уровней:', error);
        }
    };

    useEffect(() => {
        fetchLevels();
    }, []);

    // Открытие модального окна для апгрейда
    const openUpgradeModal = (item) => {
        setSelectedItem(item);
        setIsUpgradeModalOpen(true);
    };

    // Закрытие модального окна для апгрейда
    const closeUpgradeModal = () => {
        setIsUpgradeModalOpen(false);
        setSelectedItem(null);
    };

    // Функция для обработки клика по карточке улучшения лимита
    const handleLimitUpgrade = async (levelId, cost) => {
        try {
            const response = await axiosInstance.get(`/farm/limit-level-up?levelId=${levelId}`);
            console.log('Улучшение лимита:', response.data);
            setLimitLevels(prevLevels => prevLevels.map(item =>
                item.Id === levelId ? response.data : item
            ));
            // Вычитаем стоимость из баланса
            const updatedBalance = balance - cost;
            setBalance(updatedBalance);

            // Обновляем баланс в localStorage
            const start = JSON.parse(localStorage.getItem("start"));
            start.balance = updatedBalance;
            localStorage.setItem("start", JSON.stringify(start));
            closeUpgradeModal();
            fetchLevels();
        } catch (error) {
            console.error('Ошибка при улучшении лимита:', error);
        }
    };

    // Функция для обработки клика по карточке улучшения прокачки
    const handleRateUpgrade = async (levelId, cost) => {
        try {
            const response = await axiosInstance.get(`/farm/rate-level-up?levelId=${levelId}`);
            console.log('Улучшение прокачки:', response.data);
            setRateLevels(prevLevels => prevLevels.map(item =>
                item.Id === levelId ? response.data : item
            ));
            const updatedBalance = balance - cost;
            setBalance(updatedBalance);
            const start = JSON.parse(localStorage.getItem("start"));
            start.balance = updatedBalance;
            localStorage.setItem("start", JSON.stringify(start));
            closeUpgradeModal();
        } catch (error) {
            console.error('Ошибка при улучшении прокачки:', error);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };
    const navigateToPage = (path) => {
        router.push(path);
    };
    const openLink = (url) => {
        window.open(url, '_blank');
    };
    const handleTaskClick = (task) => {
        switch (task.action) {
            case 'modal':
                openModal();
                break;
            case 'navigate':
                navigateToPage(task.path);
                break;
            case 'link':
                openLink(task.url);
                break;
            default:
                console.log('No action for this task.');
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            const start = JSON.parse(localStorage.getItem("start"));
            if (start) {
                setBalance(start.balance);
            }
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

    return (
        <div className={styles.root}>
            <Image src={bg} alt={'bg'} width={450} height={1000} className={styles.bg} />
            <div className={styles.container}>
                <div className={styles.balance}>{balance}<Image src={money} alt={''} width={15} height={15} /></div>
                <div className={styles.block}>
                    <div className={styles.buttonSet}>
                        <div className={styles.folderBtnStats}
                             style={{
                                 zIndex: activeTab === 1 ? 112 : 110,
                                 marginBottom:  activeTab === 1 ? '0px' : '-12px',
                                 borderRight:  activeTab === 1 ? '2px solid #3842a4' : 'none',
                             }}
                             onClick={() => {
                                 setActiveTab(1)
                                 setIsModalOpen(false)
                             }}>Upgrades</div>
                        <div
                            className={styles.folderBtnSkins}
                            style={{
                                zIndex: activeTab === 2 ? 113 : 110,
                                marginBottom:  activeTab === 2 ? '-0px' : '2px',
                            }}
                            onClick={() => {
                                setActiveTab(2)
                                setIsModalOpen(false)
                            }}
                        >tasks</div>
                    </div>
                    {activeTab === 1 && <div className={styles.personalContainer}>
                        <div className={styles.warning}>
                            Upgrades are applied after collecting the current earnings.
                        </div>
                        {limitLevels.length === 0 && rateLevels.length === 0 && <div className={styles.warning}>No available upgrades</div>}
                        <div className={styles.list}>
                            {limitLevels.map((item, index) => (
                                <ItemPlaceholder item={item} key={index} onClick={() => openUpgradeModal(item)} />
                            ))}
                            {rateLevels.map((item, index) => (
                                <ItemPlaceholder item={item} key={index} onClick={() => openUpgradeModal(item)} />
                            ))}
                        </div>
                    </div>}
                    {activeTab === 2 && <div className={styles.skinContainer}>
                        <div className={styles.col}>
                            <div className={styles.label}>Daily</div>
                            {Tasks.daily.map((task, index) => {
                                return(
                                    <TaskBtn title={task.name} desc={task.desc} complite={task.complite} key={index} onClick={() => handleTaskClick(task)} />
                                )
                            })}
                            <div className={styles.label}>MAIn tasks</div>
                            {Tasks.main.map((task, index) => {
                                return(
                                    <TaskBtn subtitle={task.name} desc={task.desc} complite={task.complite} key={index} onClick={() => handleTaskClick(task)} />
                                )
                            })}
                        </div>
                    </div>}
                </div>
                {isUpgradeModalOpen && selectedItem && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalUpgrades}>
                            <h2>
                                {selectedItem.type === 'limit' ? `limit +${selectedItem.Name}` : `rate +${selectedItem.Name}`}
                            </h2>
                            <p>Cost: {selectedItem.Cost}</p>
                            <p>Increase per: {selectedItem.IncreasePer}</p>
                            <p>Card level: {selectedItem.Level}</p>
                            <div className={styles.modalButtons}>
                                <button
                                    className={styles.btnUpgrade}
                                    onClick={() => {
                                        if (selectedItem) {
                                            selectedItem.type === 'limit'
                                                ? handleLimitUpgrade(selectedItem.Id, selectedItem.Cost)
                                                : handleRateUpgrade(selectedItem.Id, selectedItem.Cost);
                                        }
                                    }}
                                    disabled={selectedItem && balance < selectedItem.Cost} // Делаем кнопку неактивной, если баланс меньше стоимости
                                >
                                    Upgrade
                                </button>
                                <button className={styles.btnClose} onClick={closeUpgradeModal}>Close</button>
                            </div>
                            {selectedItem && balance < selectedItem.Cost && (
                                <p className={styles.errorMessage}>Not enough coins available.</p>
                            )}
                        </div>
                    </div>
                )}
                {isModalOpen && <div className={styles.modal}>
                    <div className={styles.label}>Daily rewards</div>
                </div>}
            </div>
        </div>
    );
};
