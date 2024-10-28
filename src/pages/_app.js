import "@/styles/globals.scss";
import Script from "next/script";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from "next/head";
import MobileGuard from "@/components/guard/Guard";
import { AssetsCacheProvider } from "@/context/AssetsCacheContext";

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
            <MobileGuard />
            <Component {...pageProps} />
        </AssetsCacheProvider>
    );
}
