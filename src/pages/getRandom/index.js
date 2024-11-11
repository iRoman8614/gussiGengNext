
import {useEffect, useState} from "react";
import Image from "next/image";
import {useRouter} from "next/router";
import {useTranslation} from "react-i18next";
import {useInit} from "@/context/InitContext";
import { useCachedAssets } from "@/utils/cache";

import gangs from '@/mock/teamsData'

import styles from '@/styles/Random.module.scss'

const assetPathsBackgrounds = {
    bg: '/backgrounds/randomBG.png',
};
const assetPathsRandom = {
    person: '/random/person.png',
    hand: '/random/hand.png',
    dialog: '/random/dialog.png',
    dialog2: '/random/dialog2.png',
    oneCard: '/random/oneCard.png',
    greenCard: '/random/greenCard.png',
    blueCard: '/random/blueCard.png',
    yellowCard: '/random/yellowCard.png',
    redCard: '/random/redCard.png',
};

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

    const cachedBackgrounds = useCachedAssets(assetPathsBackgrounds, 'assets-cache-backgrounds');
    const cachedRandom = useCachedAssets(assetPathsRandom, 'assets-cache-newPlayerAssets');

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

    const ShownCard = ({state, groupId}) => {
        const greenCard = '/random/greenCard.png'
        const blueCard = '/random/blueCard.png'
        const yellowCard = '/random/yellowCard.png'
        const redCard = '/random/redCard.png'

        return(
            <Image
                className={state ? styles.cardImage : styles.hidden}
                style={{ boxShadow: `0 0 20px 10px ${getBoxShadowColor(groupId)}` }}
                src={groupId === 1 ? cachedRandom.greenCard : groupId === 2 ? cachedRandom.blueCard :
                    groupId === 3 ? cachedRandom.yellowCard : cachedRandom.redCard}
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

    return(
        <div className={styles.root}>
            <Image className={styles.bg} src={cachedBackgrounds.bg} alt={'bg'} width={450} height={1000} loading="lazy" />
            {showFrase === 0 && <div className={styles.dialog}>
                <Image src={cachedRandom.dialog} className={styles.dialogImage} width={200} height={100} alt={''} loading="lazy"/>
                <div className={styles.text}>{t('random.pick')}</div>
            </div>}
            {showFrase === 1 && <div className={styles.dialog}>
                <Image src={cachedRandom.dialog} className={styles.dialogImage} width={200} height={100} alt={''} loading="lazy"/>
                <div className={styles.text3}>{t('random.tap')}</div>
            </div>}
            {showFrase === 2 && <div className={styles.dialog}>
                <Image src={cachedRandom.dialog2} className={styles.dialog2Image} width={200} height={100} alt={''} loading="lazy"/>
                <div className={styles.text2}>{t('random.member')} <a className={styles.gang}>{gangs[groupId].Name}</a> {t('random.gang')}</div>
            </div>}
            <Image src={cachedRandom.person} className={styles.person} width={450} height={1000} alt={''} priority />
            <div className={styles.cardSet}>
                <Image
                    src={cachedRandom.oneCard}
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
                    src={cachedRandom.oneCard}
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
                    src={cachedRandom.oneCard}
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
                    src={cachedRandom.oneCard}
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
            <Image src={cachedRandom.hand} className={styles.hand} width={450} height={1000} alt={''} priority />
            <ShownCard state={showCard} groupId={groupId} />
            {showFrase === 2 && <button className={styles.btn} onClick={() => {
                router.push('/faq/home')
            }}>{t('random.continue')}</button>}
        </div>
    )
}
