import {useEffect, useState} from "react";
import Image from "next/image";
import {IconButton} from "@/components/buttons/icon-btn/IconButton";
import {CollectBar} from "@/components/bars/CollectBar";

import teamData from "@/mock/teamsData.js";
import skinData from '@/mock/skinsData'

import styles from "@/styles/faqHome.module.scss";
import {BigButton} from "@/components/buttons/big-btn/BigButton";
import {useRouter} from "next/router";

const account = "/main-buttons/account.png";
const settings = "/main-buttons/settings.png";
const boards = "/main-buttons/boards.png";
const wallet = "/main-buttons/wallet.png";
const claim = '/claimBTN.png'
const border = '/totalbar.png'
const background = '/backgrounds/nightcity.png'
const upgrades = '/main-buttons/upgrades.png';
const hands = '/main-buttons/hands.png';
const friends = '/main-buttons/friends.png';
const bag = '/main-buttons/bag.png';
const FAQ = '/main-buttons/FAQ.png'

export default function Home() {
    const router = useRouter()
    const [slide, setSlide] = useState(0)

    useEffect(() => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp?.BackButton) {
            window.Telegram.WebApp.BackButton.show();
            window.Telegram.WebApp.BackButton.onClick(() => {
                router.push('/faq');
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
        if(slide === 6) {
            router.push('/faq')
        } else {
            setSlide((prev) => prev + 1);
        }
    }

    const prevSlide = () => {
        if(slide === 0) {
            return
        } else {
            setSlide((prev) => prev - 1);
        }
    }

    const slideContent = [
        <div className={styles.slideContent1} key={'slideContent1'}>
            <div>this is your <br/> current <a className={styles.green}>balance</a></div>
            <div>and that is your <br/> limited farm <a className={styles.yellow}>pool</a></div>
        </div>,
        <div className={styles.slideContent2} key={'slideContent2'}>
            <div>this is your claim button. use it to <a className={styles.yellow}>claim</a> money from the limited <a className={styles.yellow}>farm pool</a> and add it to your current <a className={styles.green}>balance</a> </div>
        </div>,
        <div className={styles.slideContent3} key={'slideContent3'}>
            <div><a className={styles.green}>Account</a> - check your stats and customise your profile</div>
            <div><a className={styles.green}>Ganglogo</a> - swap your gang here</div>
            <div><a className={styles.green}>Settings</a> - change your language and ui prefferences</div>
        </div>,
        <div className={styles.slideContent4} key={'slideContent4'}>
            <div><a className={styles.green}>Leaderboard</a> - check out your  rank and leaderboard standings</div>
            <div><a className={styles.yellow}>wallet</a> - link your cryptowallet</div>
        </div>,
        <div className={styles.slideContent5} key={'slideContent5'}>
            <div>PVP - <a className={styles.yellow}>battle</a> your way to the top of the <a className={styles.yellow}>ranks</a> or test your skills for <a className={styles.yellow}>ton</a></div>
        </div>,
        <div className={styles.slideContent6} key={'slideContent6'}>
            <div>
                Items - bling out your <a className={styles.yellow}>battle avatar</a> with earned and bought items
                </div>
            <div>
                Exp -  upgrade your <a className={styles.yellow}>farming rate</a> and <a className={styles.green}>farming limit</a></div>
        </div>,
        <div className={styles.slideContent7} key={'slideContent7'}>
            <div>friends - <a className={styles.yellow}>invite</a> yor friends and <a className={styles.green}>gain</a> bonuses</div>
            <div>faq - wouldnt be here without it</div>
        </div>,
    ];

    return (
        <>
            <div className={styles.root}>
                <Image className={styles.background} src={background} width={300} height={1000}  alt={'bg'}/>
                <div className={slide === 2 ? `${styles.item1} ${styles.visible}` : styles.item1}>
                    <IconButton image={account} alt={'account'} title={'account'} />
                </div>
                <div className={slide === 2 ? `${styles.item2} ${styles.visible}` : styles.item2}>
                    <IconButton image={teamData[4].logo} alt={'gang'}/>
                </div>
                <div className={slide === 2 ? `${styles.item3} ${styles.visible}` : styles.item3}>
                    <IconButton image={settings} alt={'settings'} title={'settings'} />
                </div>
                <div className={slide === 3 ? `${styles.item4} ${styles.visible}` : styles.item4}>
                    <IconButton image={boards} alt={'boards'} title={'board'} />
                </div>
                <div className={slide === 0 ? `${styles.item5} ${styles.visible}` : styles.item5}>
                    <Image src={border} width={600} height={200} alt={'border'} className={styles.totalBarRoot}/>
                    <div className={styles.totalText}>525 000 000</div>
                </div>
                <div className={slide === 3 ? `${styles.item6} ${styles.visible}` : styles.item6}>
                    <IconButton image={wallet} alt={'wallet'} title={'wallet'} />
                </div>
                <div className={styles.item7}>
                    <Image width={1000} height={1000} className={styles.char} alt={'character'} src={skinData[1][0].icon}/>
                </div>
                <div className={slide === 0 ? `${styles.item8} ${styles.visible}` : styles.item8}>
                    <CollectBar
                        currentCoins={formatNumberFromEnd(7250)}
                        maxCoins={formatNumberFromEnd(35000)}
                        width={60}
                    />
                </div>
                <div className={slide === 1 ? `${styles.item9} ${styles.visible}` : styles.item9}>
                    <Image className={styles.claimRoot} width={600} height={200} src={claim} alt={'claim'} />
                </div>
                <div className={slide === 5 ? `${styles.item10} ${styles.visible}` : styles.item10}><IconButton image={bag} alt={'items'} title={'items'} /></div>
                <div className={slide === 5 ? `${styles.item11} ${styles.visible}` : styles.item11}><IconButton image={upgrades} alt={'upgrades'} title={'exp'} /></div>
                <div className={slide === 4 ? `${styles.item12} ${styles.visible}` : styles.item12}><BigButton image={hands} alt={'pvp'} title={'pvp'} /></div>
                <div className={slide === 6 ? `${styles.item13} ${styles.visible}` : styles.item13}><IconButton image={friends} alt={'friends'} title={'friends'} /></div>
                <div className={slide === 6 ? `${styles.item14} ${styles.visible}` : styles.item14}><IconButton image={FAQ} alt={'home'} title={'FAQ'} /></div>
            </div>
            <div className={styles.filter}>
                <div className={styles.tutorial}>
                    <div className={styles.col}>
                        <div className={styles.dot}>.</div>
                        <div className={styles.navLeft} onClick={prevSlide}>
                            <Image src={'/ArrowWhite.png'} alt={''} width={24} height={24} />
                        </div>
                        <div className={styles.dot}>.</div>
                    </div>
                    <div className={styles.caption}>
                        {slideContent[slide]}
                    </div>
                    <div className={styles.col}>
                        <div className={styles.dot}>.</div>
                        <div className={styles.navRight} onClick={nextSlide}>
                            <Image src={'/ArrowWhite.png'} alt={''} width={24} height={24} />
                        </div>
                        <div className={styles.pagination}>{slide+1}/7</div>
                    </div>
                </div>
            </div>
        </>
    );
}