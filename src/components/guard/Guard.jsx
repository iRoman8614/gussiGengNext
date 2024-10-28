import { useEffect } from 'react';
import { useRouter } from 'next/router';

const MobileGuard = () => {
    const router = useRouter();

    useEffect(() => {
        const checkMobileTelegram = () => {
            if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
                const platform = window.Telegram.WebApp.platform;
                if (platform === 'android' || platform === 'ios') {
                    console.log("Пользователь находится в Telegram Web App на мобильном устройстве.");
                } else {
                    router.push('/qr');
                }
            }
        };

        checkMobileTelegram();
    }, [router]);

    return null;
};

export default MobileGuard;
