import styles from './ItemPlaceholder.module.scss';

// eslint-disable-next-line react/prop-types
export const ItemPlaceholder = () => {
    return (
        <div className={styles.root}>
            <div className={styles.icon}></div>
            <div className={styles.title}>Имя карты</div>
        </div>
    );
}
