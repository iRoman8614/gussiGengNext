import styles from './Listitem.module.scss'
import Image from "next/image";

export const ListItem = ({item, index}) => {
    return(
        <div className={styles.root}>
            <Image className={styles.bg} src={item.image} alt={''} width={450} height={65} />
            <div className={styles.container}>
                <div className={styles.avatar}>
                    {item.avatar && <Image src={item.avatar} alt={'avatar'} width={60} height={60} /> }
                </div>
                <div className={styles.nickname}>{item.nickname}</div>
                <div className={styles.sum}>{item.sum}</div>
                {index && <div className={styles.index}>{index}</div>}
            </div>

        </div>
    )
}