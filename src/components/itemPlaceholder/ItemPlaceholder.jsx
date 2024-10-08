import styles from './ItemPlaceholder.module.scss';

// eslint-disable-next-line react/prop-types
export const ItemPlaceholder = ({ item, onUpgrade }) => {
    return (
        <div className={styles.root} onClick={() => onUpgrade(item.id)}>
            {item ? (
                <>
                    <div className={styles.icon}></div>
                    <div className={styles.title}>{item.name}</div>
                    <div className={styles.details}>Cost: {item.cost}</div>
                    <div className={styles.details}>Increase per: {item.increasePer}</div>
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
