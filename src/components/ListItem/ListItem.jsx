import Image from "next/image";
import styles from './Listitem.module.scss'

export const ListItem = ({item, index}) => {
    const teamData = {
        1: { avatar: '/listItemsBG/avaG.png', image: '/listItemsBG/1grbg.png' },
        2: { avatar: '/listItemsBG/avaB.png', image: '/listItemsBG/2bvbg.png' },
        3: { avatar: '/listItemsBG/avaY.png', image: '/listItemsBG/3yfbg.png' },
        4: { avatar: '/listItemsBG/avaR.png', image: '/listItemsBG/4rrbg.png' }
    };

    const { avatar, image } = teamData[item.teamId] || {};

    return (
        <>
            <div className={styles.root}>
                <div className={styles.avatar}>
                    <Image className={styles.avatar} src={avatar} alt={'avatar'} width={40} height={44} />
                </div>
                <div className={styles.container}>
                    <Image className={styles.bg} src={image} alt={''} width={450} height={65} />
                    <div className={styles.content}>
                        <div className={styles.nickname}>{item.userName || 'Anonymous'}</div>
                        <div className={styles.sum}>{item.balance}</div>
                        {index && <div className={styles.index}>{index}</div>}
                    </div>
                </div>
            </div>
        </>
    );
};
