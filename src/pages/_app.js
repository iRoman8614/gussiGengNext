import "@/styles/globals.scss";
import Script from "next/script";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from "next/head";
import MobileGuard from "@/components/guard/Guard";
import {AssetsCacheProvider, useAssetsCache} from "@/context/AssetsCacheContext";
import {useEffect} from "react";

export default function App({ Component, pageProps }) {
    return(
        <AssetsCacheProvider>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            </Head>
            <Script
                src="https://telegram.org/js/telegram-web-app.js"
                strategy="beforeInteractive"
            />
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            {/*<MobileGuard />*/}
            <Component {...pageProps} />
            <BackgroundPreloader />
        </AssetsCacheProvider>
    );
}

function BackgroundPreloader() {
    const otherAssets = [
        '/Arrow.png', '/claimBTN.png', '/claimBTNclicked.png', '/copy.png',
        '/farm_border.png', '/money.png', '/oppNickNameContainer.png',
        '/progress.png', '/qr.png', '/roundContainer.png',
        '/Star.png', '/timer.png', '/totalbar.png', '/wins.png',
        '/skins/bg.png', '/skins/bg2.png', '/skins/bg3.png', '/skins/bg4.png',
        '/skins/bg5.png', '/skins/bg6.png', '/skins/bg7.png',
        '/skins/gg.png', '/skins/gg2.png', '/skins/gg3.png', '/skins/gg4.png',
        '/skins/gg5.png', '/skins/gg6.png', '/skins/gg7.png',
        '/skins/rg.png', '/skins/rg2.png', '/skins/rg3.png', '/skins/rg4.png',
        '/skins/rg5.png', '/skins/rg6.png', '/skins/rg7.png',
        '/skins/yg.png', '/skins/yg2.png', '/skins/yg3.png', '/skins/yg4.png',
        '/skins/yg5.png', '/skins/yg6.png', '/skins/yg7.png',
        '/Tasks/daily.png', '/Tasks/money2.png', '/Tasks/pvp.png',
        '/Tasks/referal.png', '/Tasks/TaskArrow.png', '/Tasks/TaskComplited.png',
        '/Tasks/telegram.png', '/Tasks/twitter.png',
        '/gangs-logos/blue-logo.png', '/gangs-logos/green-logo.png',
        '/gangs-logos/red-logo.png', '/gangs-logos/yellow-logo.png',
        '/listItemsBG/1grbg.png', '/listItemsBG/2bvbg.png', '/listItemsBG/3yfbg.png',
        '/listItemsBG/4rrbg.png', '/listItemsBG/avaB.png', '/listItemsBG/avaG.png',
        '/listItemsBG/avaR.png', '/listItemsBG/avaY.png','/random/blueCard.png',
        '/random/card.png', '/random/dialog.png', '/random/dialog2.png',
        '/random/greenCard.png', '/random/hand.png', '/random/oneCard.png',
        '/random/person.png', '/random/redCard.png', '/random/yellowCard.png',
        '/backgrounds/backalley.png', '/backgrounds/leaderboardBG.png',
        '/backgrounds/Lobby.png', '/backgrounds/nightcity.png', '/backgrounds/randomBG.png',
        '/ArrowWhite.png', '/faq/faqHomeBg.png', '/faq/homeslide.png', '/faq/pvpslide.png'
    ];
    const { preloadAssets } = useAssetsCache();

    useEffect(() => {
        preloadAssets(otherAssets)
    }, [preloadAssets]);

    return null;
}