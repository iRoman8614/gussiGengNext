import {useEffect, useState} from "react";
import Image from "next/image";
import { useRouter } from 'next/router';
import { IconButton } from "@/components/buttons/icon-btn/IconButton.jsx";
import {PvpBtn, PvpBtnOld} from "@/components/buttons/PvpBtn/PvpBtn";
import {useTranslation} from "react-i18next";

import teamData from '@/mock/teamsData.js';

import styles from '@/styles/faqPvp.module.scss';
import "react-toastify/dist/ReactToastify.css";

const background = '/backgrounds/backalley.png'
const timerBG = '/timer.png'
const heart = '/game-icons/heart.png'
const cross = '/game-icons/lose.png'
const rock = '/game-icons/rock.png'
const paper = '/game-icons/paper.png'
const scis = '/game-icons/scissors.png'
const hand1 = '/faq/faqHand1.png'
const hand2 = '/faq/faqHand2.png'
const bonus = '/main-buttons/bonus.png'

export default function PvpBotPage() {
    const router = useRouter();
    const { t } = useTranslation();
    const [slide, setSlide] = useState(0)
    const [userName, setUserName] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const search = window.Telegram.WebApp.initData;
            const urlParams = new URLSearchParams(search);
            const userParam = urlParams.get('user');

            if (userParam) {
                const decodedUserParam = decodeURIComponent(userParam);
                const userObject = JSON.parse(decodedUserParam);
                setUserName(userObject.first_name);
            }
        }

    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp?.BackButton) {
            window.Telegram.WebApp.BackButton.show();
            window.Telegram.WebApp.BackButton.onClick(() => {
                router.push('/lobby');
            });
            return () => {
                window.Telegram.WebApp.BackButton.hide();
            };
        }
    }, [router]);

    const nextSlide = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred("heavy");
        }
        if(slide === 7) {
            if(typeof window !== 'undefined') {
                localStorage.setItem('pvpfaq', true)
            }
            router.push('/lobby')
        } else {
            setSlide((prev) => prev + 1);
        }
    }

    const prevSlide = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred("heavy");
        }
        if(slide === 0) {
            return;
        } else {
            setSlide((prev) => prev - 1);
        }
    }

    const closeFaq = () => {
        if(typeof window !== 'undefined') {
            localStorage.setItem('pvpfaq', true)
        }
        router.push('/lobby')
    }

    const slideContent = [
        <div className={styles.slideContent1} key={'slideContent1'}>
            <div>{t('PVP.skill')}</div>
        </div>,
        <div className={styles.slideContent2} key={'slideContent2'}>
            <div>{t('PVP.this')} {t('PVP.your')} <a className={styles.yellow}>{t('PVP.opp')}</a>{t('PVP.dot')}</div>
            <div>{t('PVP.this')} <a className={styles.green}>{t('PVP.you')}</a>{t('PVP.dot')}</div>
        </div>,
        <div className={styles.slideContent3} key={'slideContent3'}>
            <div><a className={styles.green}>{t('PVP.hp')}</a></div>
            <div><a className={styles.yellow}>{t('PVP.opphp')}</a></div>
        </div>,
        <div className={styles.slideContent4} key={'slideContent4'}>
            <div>{t('PVP.move')}</div>
        </div>,
        <div className={styles.slideContent5} key={'slideContent5'}>
            <div><a className={styles.green}>{t('PVP.time')}</a></div>
            <div><a className={styles.yellow}>{t('PVP.round')}</a></div>
        </div>,
        <div className={styles.slideContent6} key={'slideContent6'}>
            <div>{t('PVP.3wins.first')} <a className={styles.yellow}>{t('PVP.3wins.3')}</a> {t('PVP.3wins.wins')} <br/>
                {t('PVP.gl')}{userName}{t('PVP.imp')}</div>
        </div>,
        <div className={styles.slideContent7} key={'slideContent7'}>
            <div className={styles.beat1}><a className={styles.red}>{t('PVP.paper')}</a>{t('PVP.pr')}</div>
            <div className={styles.beat2}><a className={styles.yellow}>{t('PVP.rock')}</a>{t('PVP.rs')}</div>
            <div className={styles.beat3}><a className={styles.green}>{t('PVP.scissors')}</a>{t('PVP.sp')}</div>
        </div>,
        <div className={styles.slideContent6} key={'slideContent8'}>
            <div>{t('PVP.bonus')}</div>
        </div>
    ];

    return (
        <>
            <div className={styles.root}>
                <Image className={styles.background} src={background} width={300} height={1000} alt={'bg'} priority />
                <div className={styles.container}>
                    <div className={slide === 1 ? `${styles.oppNickname2} ${styles.visible}` : styles.oppNickname}>{t('PVP.opp')}</div>
                    <div className={slide === 1 ? `${styles.optionBg} ${styles.visible}` : styles.optionBg}>
                        <Image
                            width={90}
                            height={190}
                            className={styles.choose}
                            src={hand1}
                            alt="3"
                            loading="lazy"
                        />
                    </div>
                    {slide === 2 ? <VictoryCounterOpp score={0} slide={slide}/> : <VictoryCounter score={0} slide={slide}/>}
                    <IconButton image={teamData[1].logo} alt={'gang'} />
                    <div className={slide === 4 ? `${styles.roundTimer} ${styles.visible}` : styles.roundTimer}>
                        <Image src={timerBG} alt={'timer'} height={144} width={144} className={styles.roundTimerBG} loading="lazy" />
                        <div className={slide === 4 ? styles.time4 : styles.time}>5</div>
                    </div>
                    <IconButton image={teamData[2].logo} alt={'gang'} />
                    {slide === 2 ? <VictoryCounterMe score={0} slide={slide}/> : <VictoryCounter score={0} slide={slide}/>}
                    <div className={slide === 1 ? `${styles.optionBg} ${styles.visible}` : styles.optionBg}>
                        <Image
                            width={90}
                            height={190}
                            className={styles.mychoose}
                            src={hand2}
                            alt="3"
                            loading="lazy"
                        />
                    </div>
                    <div className={slide === 1 ? `${styles.round2} ${styles.visible}` : (slide === 4 ? `${styles.round4} ${styles.visible}` : styles.round)}>
                        {slide === 1 ? `${t('PVP.you')}` : `${t('PVP.rounds')} 3`}
                    </div>
                    <div className={slide === 3 ? `${styles.buttonSet2} ${styles.visible}` : styles.buttonSet}>
                        {slide === 3 ? <PvpBtnOld arrow={'left'} title={t('PVP.rock')} img={rock} value={1}/> :  <PvpBtn title={t('PVP.rock')} img={rock} value={1}/>}
                        {slide === 3 ? <PvpBtnOld arrow={'mid'}  title={t('PVP.paper')} img={paper} value={2} /> :  <PvpBtn title={t('PVP.paper')} img={paper} value={1}/>}
                        {slide === 3 ? <PvpBtnOld arrow={'right'}  title={t('PVP.scissors')} img={scis} value={3} /> :  <PvpBtn title={t('PVP.scissors')} img={scis} value={1}/>}
                    </div>
                </div>
            </div>
            <div className={styles.filter}></div>
            <div className={styles.popUpClose} onClick={closeFaq}>x</div>
            {slide === 7 && <Image className={styles.bonus} src={bonus} alt={''} width={138} height={138} priority/>}
            <div className={slide === 4 ? styles.tutorial4 : (slide === 6 ? styles.tutorial7 : styles.tutorial)}>
                    <div className={styles.col}>
                        <div className={styles.dot}>1</div>
                        <div className={styles.navLeft} onClick={prevSlide}>
                            <Image src={'/ArrowWhite.png'} alt={''} width={24} height={24} loading="lazy" />
                        </div>
                        <div className={styles.dot}>1</div>
                    </div>
                    <div className={styles.caption}>
                        {slideContent[slide]}
                    </div>
                    <div className={styles.col}>
                        <div className={styles.dot}>1</div>
                        <div className={styles.navRight} onClick={nextSlide}>
                            <Image src={'/ArrowWhite.png'} alt={''} width={24} height={24} loading="lazy" />
                        </div>
                        <div className={styles.pagination}>{slide+1}/8</div>
                    </div>
                </div>
        </>
    )
}


// eslint-disable-next-line react/prop-types
const VictoryCounter = ({ score, slide }) => (
    <div className={slide === 2 ? `${styles.counter} ${styles.visible}` : styles.counter}>
        {(score >= 1) ? <Image className={styles.heart} src={cross} alt={''} width={55} height={55} loading="lazy" /> : <Image className={styles.heart} src={heart} alt={''} width={55} height={55} loading="lazy"  />}
        {(score >= 2) ? <Image className={styles.heart} src={cross} alt={''} width={55} height={55} loading="lazy" /> : <Image className={styles.heart} src={heart} alt={''} width={55} height={55} loading="lazy" />}
        {(score >= 3) ? <Image className={styles.heart} src={cross} alt={''} width={55} height={55} loading="lazy" /> : <Image className={styles.heart} src={heart} alt={''} width={55} height={55} loading="lazy" />}
    </div>
);

const VictoryCounterMe = ({ score, slide }) => (
    <div className={slide === 2 ? `${styles.counterMe} ${styles.visible}` : styles.counter}>
        {(score >= 1) ? <Image className={styles.heart} src={cross} alt={''} width={55} height={55} loading="lazy" /> : <Image className={styles.heart} src={heart} alt={''} width={55} height={55} loading="lazy"  />}
        {(score >= 2) ? <Image className={styles.heart} src={cross} alt={''} width={55} height={55} loading="lazy" /> : <Image className={styles.heart} src={heart} alt={''} width={55} height={55} loading="lazy" />}
        {(score >= 3) ? <Image className={styles.heart} src={cross} alt={''} width={55} height={55} loading="lazy" /> : <Image className={styles.heart} src={heart} alt={''} width={55} height={55} loading="lazy" />}
    </div>
);

const VictoryCounterOpp = ({ score, slide }) => (
    <div className={slide === 2 ? `${styles.counterOpp} ${styles.visible}` : styles.counter}>
        {(score >= 1) ? <Image className={styles.heart} src={cross} alt={''} width={55} height={55} loading="lazy" /> : <Image className={styles.heart} src={heart} alt={''} width={55} height={55} loading="lazy"  />}
        {(score >= 2) ? <Image className={styles.heart} src={cross} alt={''} width={55} height={55} loading="lazy" /> : <Image className={styles.heart} src={heart} alt={''} width={55} height={55} loading="lazy" />}
        {(score >= 3) ? <Image className={styles.heart} src={cross} alt={''} width={55} height={55} loading="lazy" /> : <Image className={styles.heart} src={heart} alt={''} width={55} height={55} loading="lazy" />}
    </div>
);