import React, {useEffect, useState} from 'react';
import Image from "next/image";
import {useRouter} from "next/router";

import {ItemPlaceholder} from "@/components/itemPlaceholder/ItemPlaceholder";
import {TaskBtn} from "@/components/taskBtn/TaskBtn";

import styles from '@/styles/Upgrades.module.scss'

const bg = '/backgrounds/accountBG.png'

export default function Page() {
    const router = useRouter();
    const [totalCoins, setTotalCoins] = useState(0);
    const [activeTab, setActiveTab] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
                setTotalCoins(start.totalCoins);
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
                <div className={styles.balance}>{totalCoins}</div>
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
                    {activeTab === 1 &&<div className={styles.personalContainer}>
                        <div className={styles.list}>
                            <ItemPlaceholder />
                            <ItemPlaceholder />
                            <ItemPlaceholder />
                            <ItemPlaceholder />
                            <ItemPlaceholder />
                            <ItemPlaceholder />
                            <ItemPlaceholder />
                            <ItemPlaceholder />
                            <ItemPlaceholder />
                            <ItemPlaceholder />
                            <ItemPlaceholder />
                            <ItemPlaceholder />
                            <ItemPlaceholder />
                            <ItemPlaceholder />
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
                {isModalOpen && <div className={styles.modal}>
                    <div className={styles.label}>Daily rewards</div>
                </div>}
            </div>
        </div>
    );
};
