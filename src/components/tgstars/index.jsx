import React, { useState } from 'react';
import axios from '@/utils/axios';

function BuySkinButton() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleBuySkin = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/skin/update?skinId=25');
            if (response.status !== 200) {
                const errorUrl = response.data.error;
                if (errorUrl) {
                    window.open(errorUrl, '_blank');
                } else {
                    throw new Error('Ссылка для оплаты не найдена');
                }
            }
        } catch (err) {
            if (err.status !== 200) {
                console.log('err', err)
                console.log('err.responce.data', err.response.data.error)
                const errorUrl = err.response.data.error;
                console.log('errorUrl', errorUrl)
                if (errorUrl) {
                    window.open(errorUrl, '_blank');
                } else {
                    throw new Error('Ссылка для оплаты не найдена');
                }
            }
            console.error('Ошибка при покупке скина:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={handleBuySkin} disabled={loading}>
                Купить скин
            </button>
            {error && <p>Ошибка: {error}</p>}
        </div>
    );
}

export default BuySkinButton;
