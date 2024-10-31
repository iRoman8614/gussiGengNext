import {useEffect, useState} from "react";
import Image from "next/image";

import styles from './Loader.module.scss'
import {useRouter} from "next/router";
import {toast} from "react-toastify";

const loader = '/loadingImg.jpg'
export const LoaderGif = () => {
    return(
        <div className={styles.root}>
            <Image width={450} height={1000} className={styles.video} src={loader} alt="Loading..." priority />
            <LoadingText />
        </div>
    )
}

const LoadingText = () => {
    const router = useRouter();
    const [dots, setDots] = useState(0);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prevDots => (prevDots + 1) % 4);
        }, 500);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prevTimer => prevTimer + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if(timer === 25) {
            toast.error("Pair not found");
            setTimeout(() => {
                router.push('/main');
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [timer])

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className={styles.container}>
            <div className={styles.hint}>Expected time: 20 sec</div>
            <div className={styles.timer}>{formatTime(timer)}</div>
            <div className={styles.loading}>
                Loading{'.'.repeat(dots)}
            </div>
        </div>
    );
};