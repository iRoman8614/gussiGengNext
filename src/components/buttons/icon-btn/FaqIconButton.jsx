import Image from "next/image";

import styles from './FaqIconButton.module.scss'

const arrow = '/faq/longArrow.png'
const roundarrow = '/faq/longRoundArrow.png'

// eslint-disable-next-line react/prop-types
export const FaqIconButton = ({image, title, alt, onClick, hidden, big, rotate}) => {
    const handleClick = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
        if(onClick) {onClick()}
    };
    return(
        <div className={styles.container}>
            {big && rotate === 'downLeft' && <Image className={styles.arrowDownLeft} src={roundarrow} alt={''} width={60} height={80} /> }
            {big && rotate === 'down' && <Image className={styles.arrowDown} src={arrow} alt={''} width={30} height={80} /> }
            {big && rotate === 'downRight' && <Image className={styles.arrowDownRight} src={roundarrow} alt={''} width={60} height={80} /> }
            <div className={hidden ? styles.hidderRoot : (big ? styles.bigroot : styles.root)} onClick={handleClick}>
                <div >
                    <Image width={60} height={40} className={styles.image} src={image} alt={alt} />
                </div>
                {title && <div className={styles.title}>
                    {title}
                </div>}
            </div>
            {big && rotate === 'upLeft' && <Image className={styles.arrowUpLeft} src={roundarrow} alt={''} width={60} height={80} /> }
            {big && rotate === 'up' && <Image className={styles.arrowUp} src={arrow} alt={''} width={30} height={80} /> }
            {big && rotate === 'upRight' && <Image className={styles.arrowUpRight} src={roundarrow} alt={''} width={60} height={80} /> }
        </div>
    )
}