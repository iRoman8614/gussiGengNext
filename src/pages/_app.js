import "@/styles/globals.scss";
import {Head} from "next/document";

export default function App({ Component, pageProps }) {
  return(
      <>
        <Head>
          <script src="https://telegram.org/js/telegram-web-app.js"></script>
        </Head>
        <Component {...pageProps} />
      </>
      );
}
