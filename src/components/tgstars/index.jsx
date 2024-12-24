import React, { useState } from 'react';
import axios from '@/utils/axios';
import Link from "next/link";

function BuySkinButton() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [link, setLink] = useState('')

    const handleBuySkin = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/skin/update?skinId=25');
            if (response.status !== 200) {
                const errorUrl = response.data.error;
                if (errorUrl) {
                    setLink(errorUrl)
                } else {
                    throw new Error('Ссылка для оплаты не найдена');
                }
            }
        } catch (err) {
            if (err.status !== 200) {
                const errorUrl = err.response.data.error;
                console.log('errorUrl', errorUrl)
                setLink(errorUrl)
            }
        }
    };

    return (
        <Link href={link}>
            <div onClick={handleBuySkin}>
                Купить скин
            </div>
        </Link>
    );
}

export default BuySkinButton;
