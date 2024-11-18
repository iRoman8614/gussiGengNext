import {useCallback, useEffect} from "react";
import Script from "next/script";
import Head from "next/head";
import {toast, ToastContainer} from 'react-toastify';
import { InitProvider } from '@/context/InitContext';
import assetData from "@/mock/assets.json";

import 'react-toastify/dist/ReactToastify.css';
import "@/styles/globals.scss";

export default function App({ Component, pageProps }) {

    const updateBodyHeight = useCallback(() => {
        document.body.style.height = `${window.innerHeight}px`;
    }, []);

    const initializeTelegramWebApp = useCallback(() => {
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.setHeaderColor('#183256');
            window.Telegram.WebApp.expand();
            updateBodyHeight();
            window.addEventListener('resize', updateBodyHeight);
        } else {
            toast.error("Telegram WebApp unavailable");
        }
    }, [updateBodyHeight]);


    useEffect(() => {
        if (typeof window === "undefined") return;
        initializeTelegramWebApp()
        const worker = new Worker(new URL("../workers/assetWorker.js", import.meta.url));
        const assetGroups = [
            { group: "backgrounds", assets: assetData.backgrounds },
            { group: "skins", assets: Object.values(assetData.skins).flat() },
            { group: "icons", assets: assetData.icons },
            { group: "gameItems", assets: assetData.gameItems },
            { group: "upgrades", assets: Object.values(assetData.upgrades).flat() },
            { group: "others", assets: assetData.others },
            { group: "newPlayerAssets", assets: assetData.newPlayerAssets }
        ];

        let currentGroupIndex = 0;

        // Проверка на наличие группы в кэше
        const isGroupCached = async (cacheName) => {
            const cache = await caches.open(cacheName);
            const keys = await cache.keys();
            return keys.length > 0;
        };

        const loadNextGroup = async () => {
            if (currentGroupIndex >= assetGroups.length) {
                console.log("All asset groups loaded");
                return;
            }

            const { group, assets } = assetGroups[currentGroupIndex];
            const cacheName = `assets-cache-${group}`;

            if (await isGroupCached(cacheName)) {
                console.log(`Группа ${group} уже загружена, пропускаем.`);
                currentGroupIndex++;
                loadNextGroup();
            } else {
                console.log(`Загружаем группу: ${group}`);
                worker.postMessage({ assets, cacheName });
            }
        };

        worker.onmessage = (event) => {
            const { status, cacheName, asset, error } = event.data;
            if (status === "loaded") {
                console.log(`Asset ${asset} загружен`);
            } else if (status === "error") {
                console.error(`Ошибка загрузки ассета ${asset}: ${error}`);
            } else if (status === "complete") {
                console.log(`Группа ${cacheName} загружена`);
                currentGroupIndex++;
                loadNextGroup();
            }
        };

        loadNextGroup();
        return () => worker.terminate();
    }, []);

    return(
        <InitProvider>
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
        </InitProvider>
    );
}