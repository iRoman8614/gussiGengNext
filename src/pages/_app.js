import "@/styles/globals.scss";
import {Head} from "next/head";
import Script from "next/script";

export default function App({ Component, pageProps }) {
  return(
      <>
        <Script
            src="https://telegram.org/js/telegram-web-app.js"
            strategy="beforeInteractive"
        />
        <Component {...pageProps} />
      </>
      );
}
