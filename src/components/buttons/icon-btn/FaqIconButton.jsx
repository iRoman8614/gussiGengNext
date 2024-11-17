import Image from "next/image";

import styles from './FaqIconButton.module.scss'

const arrow = '/faq/longArrow.png'

// eslint-disable-next-line react/prop-types
export const FaqIconButton = ({image, title, alt, onClick, hidden, big, rotate}) => {
    const handleClick = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
        if(onClick) {onClick()}
    };
    return(
        <>
            <div className={hidden ? styles.hidderRoot : (big ? styles.bigroot : styles.root)} onClick={handleClick}>
                <div >
                    <Image width={60} height={40} className={styles.image} src={image} alt={alt} />
                </div>
                {title && <div className={styles.title}>
                    {title}
                </div>}
            </div>
            {big && rotate === 15 && <Image className={styles.arrow1} src={arrow} alt={''} width={30} height={80} /> }
            {big && rotate === -15 && <Image className={styles.arrow2} src={arrow} alt={''} width={30} height={80} /> }
            {big && rotate === 30 && <Image className={styles.arrow3} src={arrow} alt={''} width={30} height={80} /> }
        </>

    )
}