import styles from './ItemPlaceholder.module.scss';

// eslint-disable-next-line react/prop-types
export const ItemPlaceholder = ({ item, onUpgrade }) => {
    return (
        <div className={styles.root} onClick={() => onUpgrade(item.id)}>
            {item ? (
                <>
                    {/*<div className={styles.icon}></div>*/}
                    <div className={styles.title}>{item.Name}</div>
                    <div className={styles.details}>Cost: {item.Cost}</div>
                    <div className={styles.details}>Increase per: {item.IncreasePer}</div>
                    <div className={styles.details}>Card level: {item.Level}</div>
                </>
            ) : (
                <>
                    <div className={styles.icon}></div>
                    <div className={styles.title}>Item name</div>
                </>
            )}
        </div>
    );
}
