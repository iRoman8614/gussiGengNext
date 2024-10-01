import styles from './Listitem.module.scss'
import Image from "next/image";

export const ListItem = ({item, index, me}) => {
    return(
        <>
            <div className={me ? styles.rootMe : styles.root}>
                <div className={styles.avatar}>
                    {item.avatar && <Image src={item.avatar} alt={'avatar'} width={40} height={44} /> }
                </div>
                <div className={styles.container}>
                    <Image className={styles.bg} src={item.image} alt={''} width={450} height={65} />
                    <div className={styles.content}>
                        <div className={styles.nickname}>{item.nickname}</div>
                        <div className={styles.sum}>{item.sum}</div>
                        {index && <div className={styles.index}>{index}</div>}
                    </div>
                </div>
            </div>
        </>
    )
}