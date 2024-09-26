import styles from '@/styles/Account.module.scss'
import Image from "next/image";
import React, {useEffect, useState} from "react";

import skinData from '@/mock/skinsData'
import teamData from "@/mock/teamsData";
import {useRouter} from "next/router";

const bg = '/backgrounds/accountBG.png'
export default function Page() {
    const [teamId, setTeamId] = useState(1)
    const [level, setLevel] = useState(1)
    const [activeTab, setActiveTab] = useState(1);

    const router = useRouter();

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
        if (typeof window !== "undefined") {
            // Получаем init из localStorage
            const init = JSON.parse(localStorage.getItem("init"));
            if (init && init.group) {
                setTeamId(init.group.id); // Устанавливаем команду
            }
        }},[])

    function getRandomNumber() {
        return Math.floor(Math.random() * 6) + 1;
    }
    useEffect(() => {
        const level = getRandomNumber()
        setLevel(level)
    }, [])

    return(
        <div className={styles.root}>
            <Image src={bg} alt={'bg'} width={450} height={1000} className={styles.bg} />
            <div className={styles.container}>
                <div className={styles.seasonBlock}>
                    <div className={styles.season}>season 1</div>
                    <div className={styles.avatarContainer}>
                        <Image className={styles.logo} src={teamData[teamId].logo} alt={''} width={40} height={40} />
                        <Image src={skinData[teamId][level]} alt={''} width={100} height={178} />
                    </div>
                </div>
                <div className={styles.block}>
                    <div className={styles.buttonSet}>
                        <div className={styles.folderBtnStats}
                             style={{
                                 zIndex: activeTab === 1 ? 112 : 110,
                                 marginBottom:  activeTab === 1 ? '0px' : '-12px',
                                 borderRight:  activeTab === 1 ? '2px solid #3842a4' : 'none',
                             }}
                             onClick={() => setActiveTab(1)}>STATS</div>
                        <div
                            className={styles.folderBtnSkins}
                            style={{
                                zIndex: activeTab === 2 ? 113 : 110,
                                marginBottom:  activeTab === 2 ? '-0px' : '2px',
                            }}
                             onClick={() => setActiveTab(2)}
                        >SkinS</div>
                    </div>
                    {activeTab === 1 &&<div className={styles.personalContainer}>
                        <div className={styles.nickname}>
                            tupacshakur
                        </div>
                        <div className={styles.stats}>
                            <div className={styles.nickname}>League 1</div>
                            <div className={styles.stat}>
                                total <br/> 7
                            </div>
                            <div className={styles.stat}>
                                wins <br/> 5
                            </div>
                            <div className={styles.stat}>
                                defeats <br/> 2
                            </div>
                            <div className={styles.stat}>
                                winrate <br/> 70%
                            </div>
                        </div>
                        <div className={styles.barBlock}>
                            <div className={styles.ballanceLabel}>
                                earn a total of 100 k to earn a booster
                            </div>
                            <div className={styles.bar}>
                                <div className={styles.progress}></div>
                            </div>
                            <div className={styles.ballanceLabel}>
                                70K
                            </div>
                        </div>
                        <div>
                            <div className={styles.ballanceLabel}>current balance</div>
                            <div className={styles.balance}> 47000</div>
                        </div>
                    </div>}
                    {activeTab === 2 && <div className={styles.skinContainer}>
                        <div className={styles.nickname}>
                            tupacshakur
                        </div>
                        <div className={styles.stats}>
                            <div className={styles.nickname}>League 2</div>
                            <div className={styles.stat}>
                                total <br/> 9
                            </div>
                            <div className={styles.stat}>
                                wins <br/> 1
                            </div>
                            <div className={styles.stat}>
                                defeats <br/> 6
                            </div>
                            <div className={styles.stat}>
                                winrate <br/> 30%
                            </div>
                        </div>
                        <div className={styles.barBlock}>
                            <div className={styles.ballanceLabel}>
                                earn a total of 100 k to earn a booster
                            </div>
                            <div className={styles.bar}>
                                <div className={styles.progress}></div>
                            </div>
                            <div className={styles.ballanceLabel}>
                                70K
                            </div>
                        </div>
                        <div>
                            <div className={styles.ballanceLabel}>current balance</div>
                            <div className={styles.balance}> 47000</div>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    )
}
