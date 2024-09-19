import styles from './Loader.module.scss'
import loader from '/loadingImg.jpg'
import {useEffect, useState} from "react";

export const LoaderImage = () => {
    return(
        <div className={styles.root}>
            <img className={styles.video} src={loader} alt="Loading..."/>
            <LoadingText />
        </div>
    )
}

const LoadingText = () => {
    const [dots, setDots] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prevDots => (prevDots + 1) % 4); // Меняем количество точек от 0 до 3
        }, 500); // Интервал обновления 500 миллисекунд

        return () => clearInterval(interval); // Очистка интервала при размонтировании компонента
    }, []);

    return (
        <div className={styles.loading}>
            Loading{'.'.repeat(dots)}
        </div>
    );
};

export default LoadingText;