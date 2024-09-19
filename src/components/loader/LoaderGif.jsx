import Image from "next/image";

import styles from './Loader.module.scss'

const loader = '/loading.gif'
export const LoaderGif = () => {
    return(
        <div className={styles.root}>
            <Image className={styles.video} src={loader} alt="Loading..."/>
        </div>
    )
}