import {useEffect, useState} from "react";
import Image from "next/image";
import {FaqIconButton} from "@/components/buttons/icon-btn/FaqIconButton";
import {CollectBar} from "@/components/bars/CollectBar";
import {useTranslation} from "react-i18next";

import teamData from "@/mock/teamsData.js";
import skinData from '@/mock/skinsData'

import styles from "@/styles/faqHome.module.scss";
import {BigButton} from "@/components/buttons/big-btn/BigButton";
import {useRouter} from "next/router";
import { useInit } from '@/context/InitContext';

const account = "/main-buttons/account.png";
const settings = "/main-buttons/settings.png";
const boards = "/main-buttons/boards.png";
const wallet = "/main-buttons/wallet.png";
const claim = '/lootBTN.png'
const border = '/totalbar.png'
const background = '/backgrounds/nightcity.png'
const upgrades = '/main-buttons/upgrades.png';
const hands = '/main-buttons/hands.png';
const friends = '/main-buttons/friends.png';
const bag = '/main-buttons/bag.png';
const FAQ = '/main-buttons/FAQ.png'
const arrow = '/faq/longArrow.png'

export default function Home() {
    const router = useRouter()
    const { t } = useTranslation();
    const [slide, setSlide] = useState(0)
    const { groupId } = useInit();

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
    function formatNumberFromEnd(num) {
        if (isNaN(num) || typeof num !== 'number') {
            return '10800';
        }
        return Math.round(num).toString().replace(/(\d)(?=(\d{3})+$)/g, "$1 ");
    }

    const nextSlide = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred("heavy");
        }
        if(slide === 7) {
            router.push('/main')
        } else {
            setSlide((prev) => prev + 1);
        }
    }

    const prevSlide = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred("heavy");
        }
        if(slide === 0) {
            return
        } else {
            setSlide((prev) => prev - 1);
        }
    }

    const slideContent = [
        <div className={styles.slideContent1} key={'slideContent1'}>
            <div>{t('FAQ.1.current')} <a className={styles.yellow}>{t('FAQ.1.balance')}</a></div>
            <div>{t('FAQ.1.farmPool')} <a className={styles.yellow}> {t('FAQ.1.pool')}</a> {t('FAQ.1.end')}</div>
        </div>,
        <div className={styles.slideContent2} key={'slideContent2'}>
            {t('FAQ.2.this')} <a className={styles.yellow}>{t('FAQ.2.loot')}</a>{t('FAQ.2.btn')}<br/>
            {t('FAQ.2.use')}<a className={styles.yellow}>{t('FAQ.2.pool')}</a>{t('FAQ.2.balance')}

        </div>,
        <div className={styles.slideContent3} key={'slideContent3'}>
            <div><a className={styles.yellow}>{t('FAQ.3.account')}</a> - {t('FAQ.3.check')}</div>
            <div><a className={styles.yellow}>{t('FAQ.3.gl')}</a> - {t('FAQ.3.swap')}</div>
            <div><a className={styles.yellow}>{t('FAQ.3.settings')}</a> - {t('FAQ.3.change')}</div>
        </div>,
        <div className={styles.slideContent4} key={'slideContent4'}>
            <div><a className={styles.yellow}>{t('FAQ.4.boards')}</a> - {t('FAQ.4.check')}</div>
            <div><a className={styles.yellow}>{t('FAQ.4.wallet')}</a> - {t('FAQ.4.link')}</div>
        </div>,
        <div className={styles.slideContent5} key={'slideContent5'}>
            <div><a className={styles.yellow}>{t('FAQ.5.pvp')} </a> {t('FAQ.5.battle')} {t('FAQ.5.way')} <a className={styles.yellow}>{t('FAQ.5.ranks')}</a>{t('FAQ.5.dot')} {t('FAQ.5.test')} {t('FAQ.5.ton')} {t('FAQ.5.soon')}</div>
        </div>,
        <div className={styles.slideContent6} key={'slideContent6'}>
            <div>
                <a className={styles.yellow}>{t('FAQ.6.exp')}</a>{t('FAQ.6.upgrade')}
            </div>
            <div>
                <a className={styles.yellow}>{t('FAQ.6.items')}</a>{t('FAQ.6.soon')}
            </div>
        </div>,
        <div className={styles.slideContent7} key={'slideContent7'}>
            <div><a className={styles.yellow}>{t('FAQ.7.friends')}</a>{t('FAQ.7.invite')}</div>
            <div><a className={styles.yellow}>{t('FAQ.7.tasks')}</a>{t('FAQ.7.complete')}</div>
        </div>,
        <div className={styles.slideContent8} key={'slideContent8'}>
            <div><a className={styles.yellow}>{t('FAQ.8.bags')}</a></div>
        </div>
    ];

    const closeFaq = () => {
        router.push('/main')
    }

    return (
        <>
            <div className={styles.root}>
                <Image className={styles.background} src={background} width={300} height={1000} alt={'bg'} loading="lazy"/>
                <div className={styles.item1}>
                    <FaqIconButton image={account} alt={'account'} title={t('main.account')} />
                </div>
                <div className={styles.item2}>
                    <FaqIconButton image={teamData[groupId]?.logo} alt={'gang'}/>
                </div>
                <div className={styles.item3}>
                    <FaqIconButton image={settings} alt={'settings'} title={t('main.settings')} />
                </div>
                <div className={styles.item4}>
                    <FaqIconButton image={boards} alt={'boards'} title={t('main.boards')} />
                </div>
                <div className={styles.item5}>
                    <Image src={border} width={600} height={190} alt={'border'} className={styles.totalBarRoot} loading="lazy"/>
                    <div className={styles.totalText}>525 000 000</div>
                </div>
                <div className={styles.item6}>
                    <FaqIconButton image={wallet} alt={'wallet'} title={t('main.wallet')} />
                </div>
                <div className={styles.item7}>
                    <Image width={1000} height={1000} className={styles.char} alt={'character'} src={skinData[groupId]?.[0]?.icon} loading="lazy"/>
                </div>
                <div className={styles.item8}>
                    <CollectBar
                        currentCoins={7250}
                        maxCoins={35000}
                        width={60}
                    />
                </div>
                <div className={styles.item9}>
                    <Image className={styles.claimRoot} width={600} height={200} src={claim} alt={'claim'} loading="lazy" />
                    <p className={styles.btn}>{t('main.loot')}</p>
                </div>
                <div className={styles.item10}><FaqIconButton image={bag} alt={'items'} title={t('main.items')} /></div>
                <div className={styles.item11}><FaqIconButton image={upgrades} alt={'upgrades'} title={t('main.exp')} /></div>
                <div className={styles.item12}><BigButton image={hands} alt={'pvp'} title={t('main.pvp')} /></div>
                <div className={styles.item13}><FaqIconButton image={friends} alt={'friends'} title={t('main.friends')} /></div>
                <div className={styles.item14}><FaqIconButton image={FAQ} alt={'home'} title={t('main.tasks')} /></div>
            </div>
            <div className={styles.filter}>
                <div className={styles.popUpClose} onClick={closeFaq}>x</div>
                {slide === 0 && <div>.</div>}
                {slide === 0 && <div className={slide === 0 && styles.item5vis}>
                    <Image src={border} width={600} height={190} alt={'border'} className={styles.totalBarRoot} loading="lazy"/>
                    <div className={styles.totalText}>525 000 000</div>
                </div>}
                {slide === 0 && <Image className={styles.arrowUp} src={arrow} alt={''} width={30} height={85}/>}
                {slide === 1 && <div>.</div>}
                {slide === 1 && <div>.</div>}
                {slide === 1 && <div>.</div>}
                {slide === 1 && <div>.</div>}
                {slide === 1 && <div>.</div>}
                {slide === 1 && <div>.</div>}
                {slide === 1 && <div>.</div>}
                {slide === 1 && <div>.</div>}
                {slide === 2 && <div>.</div>}
                {slide === 2 && <div className={styles.row}>
                    <div className={slide === 2 ? `${styles.item1} ${styles.visible}` : styles.item1}>
                        <FaqIconButton image={account} alt={'account'} title={t('main.account')} big={slide === 2 && true} rotate={"upLeft"} />
                    </div>
                    <div className={slide === 2 ? `${styles.item2} ${styles.visible}` : styles.item2}>
                        <FaqIconButton image={teamData[groupId]?.logo} alt={'gang'} big={slide === 2 && true} rotate={'up'}/>
                    </div>
                    <div className={slide === 2 ? `${styles.item3} ${styles.visible}` : styles.item3}>
                        <FaqIconButton image={settings} alt={'settings'} title={t('main.settings')} big={slide === 2 && true} rotate={"upRight"} />
                    </div>
                </div>}
                {slide === 3 && <div>.</div>}
                {slide === 3 && <div className={styles.row}>
                    <div className={slide === 3 ? `${styles.item1} ${styles.visible}` : styles.item4}>
                        <FaqIconButton image={boards} alt={'boards'} title={t('main.boards')} big={slide === 3 && true} rotate={"upLeft"} />
                    </div>
                    <div className={slide === 3 ? `${styles.item3} ${styles.visible}` : styles.item6}>
                        <FaqIconButton image={wallet} alt={'wallet'} title={t('main.wallet')} big={slide === 3 && true} rotate={"upRight"}  />
                    </div>
                </div>}
                {slide === 4 && <div>.</div>}
                {slide === 4 && <div>.</div>}
                {slide === 4 && <div>.</div>}
                {slide === 4 && <div>.</div>}
                {slide === 4 && <div>.</div>}
                {slide === 4 && <div>.</div>}
                {slide === 5 && <div>.</div>}
                {slide === 5 && <div>.</div>}
                {slide === 5 && <div>.</div>}
                {slide === 5 && <div>.</div>}
                {slide === 5 && <div>.</div>}
                {slide === 5 && <div>.</div>}
                {slide === 6 && <div>.</div>}
                {slide === 6 && <div>.</div>}
                {slide === 6 && <div>.</div>}
                {slide === 6 && <div>.</div>}
                {slide === 6 && <div>.</div>}
                {slide === 6 && <div>.</div>}

                <div className={slide === 7 ? styles.tutorial7 : styles.tutorial}>
                        <div className={styles.col}>
                            <div className={styles.dot}>.</div>
                            <div className={styles.navLeft} onClick={prevSlide}>
                                <Image src={'/ArrowWhite.png'} alt={''} width={24} height={24} loading="lazy" />
                            </div>
                            <div className={styles.dot}>8</div>
                        </div>
                        <div className={slide === 7 ? styles.caption7 : styles.caption}>
                            {slideContent[slide]}
                        </div>
                        <div className={styles.col}>
                            <div className={styles.dot}>.</div>
                            <div className={styles.navRight} onClick={nextSlide}>
                                <Image src={'/ArrowWhite.png'} alt={''} width={24} height={24} loading="lazy" />
                            </div>
                            <div className={styles.pagination}>{slide+1}/8</div>
                        </div>
                    </div>

                {slide === 0 && <Image className={styles.arrowDown} src={arrow} alt={''} width={30} height={85}/>}
                {slide === 0 && <div className={slide === 0 && styles.item8vis}>
                    <CollectBar
                        currentCoins={formatNumberFromEnd(7250)}
                        maxCoins={formatNumberFromEnd(35000)}
                        width={60}
                    />
                </div>}
                {slide === 0 && <div>.</div>}
                {slide === 0 && <div>.</div>}
                {slide === 1 && <Image className={styles.arrowDown} src={arrow} alt={''} width={30} height={85}/>}
                {slide === 1 && <div className={slide === 1 && styles.item9vis}>
                    <Image className={styles.claimRoot} width={600} height={200} src={claim} alt={'claim'} loading="lazy" />
                    <p className={styles.btnVis}>{t('main.loot')}</p>
                </div>}
                {slide === 1 && <div>.</div>}
                {slide === 1 && <div>.</div>}
                {slide === 2 && <div>.</div>}
                {slide === 2 && <div>.</div>}
                {slide === 2 && <div>.</div>}
                {slide === 2 && <div>.</div>}
                {slide === 2 && <div>.</div>}
                {slide === 2 && <div>.</div>}
                {slide === 2 && <div>.</div>}
                {slide === 2 && <div>.</div>}
                {slide === 2 && <div>.</div>}
                {slide === 3 && <div>.</div>}
                {slide === 3 && <div>.</div>}
                {slide === 3 && <div>.</div>}
                {slide === 3 && <div>.</div>}
                {slide === 3 && <div>.</div>}
                {slide === 3 && <div>.</div>}
                {slide === 3 && <div>.</div>}
                {slide === 3 && <div>.</div>}
                {slide === 3 && <div>.</div>}
                {slide === 4 && <div className={styles.item12}><FaqIconButton image={hands} alt={'pvp'} title={t('main.pvp')} big={slide === 4 && true} rotate={"down"}  /></div>}
                {slide === 5 && <div className={styles.rowLeft}>
                    <div className={slide === 5 ? `${styles.item10} ${styles.visible}` : styles.item10}><FaqIconButton image={bag} alt={'items'} title={t('main.items')} big={slide === 5 && true} rotate={"downLeft"}/></div>
                    <div className={slide === 5 ? `${styles.item11} ${styles.visible}` : styles.item11}><FaqIconButton image={upgrades} alt={'upgrades'} title={t('main.exp')} big={slide === 5 && true} rotate={"down"} /></div>
                </div>}
                {slide === 6 && <div className={styles.rowRight}>
                    <div className={slide === 6 ? `${styles.item13} ${styles.visible}` : styles.item13}><FaqIconButton image={friends} alt={'friends'} title={t('main.friends')} big={slide === 6 && true} rotate={"down"}/></div>
                    <div className={slide === 6 ? `${styles.item14} ${styles.visible}` : styles.item14}><FaqIconButton image={FAQ} alt={'home'} title={t('main.tasks')} big={slide === 6 && true} rotate={"downRight"} /></div>
                </div>}
            </div>

        </>
    );
}