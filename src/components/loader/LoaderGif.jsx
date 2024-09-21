// import Image from "next/image";
//
// import styles from './Loader.module.scss'
//
// const loader = '/loading.gif'
// export const LoaderGif = () => {
//     return(
//         <div className={styles.root}>
//             <Image className={styles.video} width={450} height={1000} src={loader} alt="Loading..."/>
//         </div>
//     )
// }

import {useEffect, useState} from "react";
import Image from "next/image";

import styles from './Loader.module.scss'

const loader = '/loading.gif'
export const LoaderGif = () => {
    return(
        <div className={styles.root}>
            <Image className={styles.video} src={loader} alt="Loading..."/>
            <LoadingText />
        </div>
    )
}

const LoadingText = () => {
    const [dots, setDots] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prevDots => (prevDots + 1) % 4);
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.loading}>
            Loading{'.'.repeat(dots)}
        </div>
    );
};

export default LoadingText;