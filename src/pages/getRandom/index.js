import {useState} from "react";
import Image from "next/image";
import {useRouter} from "next/router";
import {useTranslation} from "react-i18next";
import {useInit} from "@/context/InitContext";

import gangs from '@/mock/teamsData'

import styles from '@/styles/Random.module.scss'
import {BigButton} from "@/components/buttons/big-btn/BigButton";
import {FaqIconButton} from "@/components/buttons/icon-btn/FaqIconButton";
import {CollectBar} from "@/components/bars/CollectBar";

const bg = '/backgrounds/randomBG.png'
const person = '/random/person.png'
const hand = '/random/hand.png'
const dialog = '/random/dialog.png'
const dialog2 = '/random/dialog2.png'
const oneCard = '/random/oneCard.png'
const greenCard = '/random/greenCard.png'
const blueCard = '/random/blueCard.png'
const yellowCard = '/random/yellowCard.png'
const redCard = '/random/redCard.png'
const hands = '/main-buttons/hands.png';
const claim = '/lootBTN.png'
const upgrades = '/main-buttons/upgrades.png';

export default function Page() {
    const router = useRouter();
    const { t } = useTranslation();
    const { groupId } = useInit();
    const [clickCount1, setClickCount1] = useState(0);
    const [clickCount2, setClickCount2] = useState(0);
    const [clickCount3, setClickCount3] = useState(0);
    const [clickCount4, setClickCount4] = useState(0);
    const [showCard, setShowCard] = useState(false);
    const [showFrase, setShowFrase] = useState(0)
    const [showFAQ, setShowFAQ] = useState(false)

    const getBoxShadowColor = (groupId) => {
        switch (groupId) {
            case 1:
                return 'rgba(0,167,0)';
            case 2:
                return 'rgba(22,67,235)';
            case 3:
                return 'rgba(252,192,46)';
            case 4:
                return 'rgba(199,21,22)';
        }
    };

    const ShownCard = ({state, groupId}) => {
        // const greenCard = '/random/greenCard.png'
        // const blueCard = '/random/blueCard.png'
        // const yellowCard = '/random/yellowCard.png'
        // const redCard = '/random/redCard.png'

        return(
            <Image
                className={state ? styles.cardImage : styles.hidden}
                style={{ boxShadow: `0 0 20px 10px ${getBoxShadowColor(groupId)}` }}
                src={groupId === 1 ? greenCard : groupId === 2 ? blueCard :
                    groupId === 3 ? yellowCard : redCard}
                alt="" width={200} height={340} loading="lazy" />
        )
    }

    const handleClick1 = () => {
        if (clickCount1 === 0) {
            setClickCount1(1);
            setClickCount2(0)
            setClickCount3(0)
            setClickCount4(0)
            setShowFrase(1)
        } else if (clickCount1 === 1) {
            setClickCount1(2);
            setShowCard(true);
            setShowFrase(2)
        }
    };
    const handleClick2 = () => {
        if (clickCount2 === 0) {
            setClickCount2(1);
            setClickCount1(0)
            setClickCount3(0)
            setClickCount4(0)
            setShowFrase(1)
        } else if (clickCount2 === 1) {
            setClickCount2(2);
            setShowCard(true);
            setShowFrase(2)
        }
    };
    const handleClick3 = () => {
        if (clickCount3 === 0) {
            setClickCount3(1);
            setClickCount2(0)
            setClickCount1(0)
            setClickCount4(0)
            setShowFrase(1)
        } else if (clickCount3 === 1) {
            setClickCount3(2);
            setShowCard(true);
            setShowFrase(2)
        }
    };
    const handleClick4 = () => {
        if (clickCount4 === 0) {
            setClickCount4(1);
            setClickCount2(0)
            setClickCount3(0)
            setClickCount1(0)
            setShowFrase(1)
        } else if (clickCount4 === 1) {
            setClickCount4(2);
            setShowCard(true);
            setShowFrase(2)
        }
    };

    function formatNumberFromEnd(num) {
        if (isNaN(num) || typeof num !== 'number') {
            return '10800';
        }
        return Math.round(num).toString().replace(/(\d)(?=(\d{3})+$)/g, "$1 ");
    }

    const showSmallFaq = () => {
        setShowFAQ(true)
        setShowFrase(3)
    }

    return(
        <div className={styles.root}>
            <Image className={styles.bg} src={bg} alt={'bg'} width={450} height={1000} loading="lazy" />
            {showFrase === 0 && <div className={styles.dialog}>
                <Image src={dialog} className={styles.dialogImage} width={200} height={100} alt={''} loading="lazy"/>
                <div className={styles.text}>{t('random.pick')}</div>
            </div>}
            {showFrase === 1 && <div className={styles.dialog}>
                <Image src={dialog} className={styles.dialogImage} width={200} height={100} alt={''} loading="lazy"/>
                <div className={styles.text3}>{t('random.tap')}</div>
            </div>}
            {showFrase === 2 && <div className={styles.dialog}>
                <Image src={dialog2} className={styles.dialog2Image} width={200} height={100} alt={''} loading="lazy"/>
                <div className={styles.text2}>{t('random.member')} <a className={styles.gang}>{gangs[groupId].Name}</a> {t('random.gang')}</div>
            </div>}
            <Image src={person} className={styles.person} width={450} height={1000} alt={''} priority />
            <div className={styles.cardSet}>
                <Image
                    src={oneCard}
                    alt={''}
                    width={100}
                    height={155}
                    style={clickCount1 > 0 && { boxShadow: `0 0 20px 10px #FF9740` }}
                    className={
                        clickCount1 === 0
                            ? styles.oneCard1
                            : clickCount1 === 1
                                ? styles.oneCard1FirstClick
                                : styles.oneCard1SecondClick
                    }
                    priority
                    onClick={handleClick1} />
                <Image
                    src={oneCard}
                    alt={''}
                    width={100}
                    height={155}
                    style={clickCount2 > 0 && { boxShadow: `0 0 20px 10px #FF9740` }}
                    className={
                        clickCount2 === 0
                            ? styles.oneCard2
                            : clickCount2 === 1
                                ? styles.oneCard2FirstClick
                                : styles.oneCard2SecondClick
                    }
                    priority
                    onClick={handleClick2} />
                <Image
                    src={oneCard}
                    alt={''}
                    width={100}
                    height={155}
                    style={clickCount3 > 0 && { boxShadow: `0 0 20px 10px #FF9740` }}
                    className={
                        clickCount3 === 0
                            ? styles.oneCard3
                            : clickCount3 === 1
                                ? styles.oneCard3FirstClick
                                : styles.oneCard3SecondClick
                    }
                    priority
                    onClick={handleClick3} />
                <Image
                    src={oneCard}
                    alt={''}
                    width={100}
                    height={155}
                    style={clickCount4 > 0 && { boxShadow: `0 0 20px 10px #FF9740` }}
                    className={
                        clickCount4 === 0
                            ? styles.oneCard4
                            : clickCount4 === 1
                                ? styles.oneCard4FirstClick
                                : styles.oneCard4SecondClick
                    }
                    priority
                    onClick={handleClick4} />
            </div>
            <Image src={hand} className={styles.hand} width={450} height={1000} alt={''} priority />
            <ShownCard state={showCard} groupId={groupId} />
            {showFrase === 2 && <div className={styles.btn} onClick={showSmallFaq}>{t('random.continue')}</div>}
            {showFAQ && <div className={styles.shortFAQ}>
                <div className={styles.slide1}>
                    <div className={styles.item12}><FaqIconButton image={hands} alt={'pvp'} title={t('main.pvp')} big={true}/></div>
                    <div className={styles.slideText}><a>{t('random.faq.play')}</a>{t('random.faq.earn')}</div>
                </div>
                <div className={styles.slide2}>
                    <div className={styles.item8vis}>
                        <CollectBar
                            currentCoins={formatNumberFromEnd(7250)}
                            maxCoins={formatNumberFromEnd(35000)}
                            width={60}
                        />
                    </div>
                    <div className={styles.slideText}><a>{t('random.faq.watch')}</a>{t('random.faq.farm')}</div>
                    <div className={styles.item9vis}>
                        <Image className={styles.claimRoot} width={600} height={200} src={claim} alt={'claim'}
                               loading="lazy"/>
                        <p className={styles.btnVis}>{t('main.loot')}</p>
                    </div>
                </div>
                <div className={styles.slide3}>
                    <div className={styles.slideText}><a>{t('random.faq.upgrade')}</a>{t('random.faq.airdrop')}</div>
                    <div><FaqIconButton image={upgrades} alt={'upgrades'} title={t('main.exp')} big={true}/></div>
                </div>
                <div className={styles.slideBtns}>
                    <div className={styles.fullBtn} onClick={() => {
                        localStorage.setItem('picked', true)
                        router.push('/faq/home')
                    }}>full faq
                    </div>
                    <div className={styles.startBtn} onClick={() => {
                        localStorage.setItem('picked', true)
                        router.push('/main')
                    }}>start
                    </div>
                </div>
            </div>}
        </div>
    )
}
