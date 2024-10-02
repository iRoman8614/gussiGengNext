// pages/api/getAvatar.js

export default async function handler(req, res) {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    // Тестовый токен
    const botToken = '7211901244:AAGzg3LpphBkxqJtALmTcguIrCvV958Xpgc';

    try {
        // Запрос к Telegram Bot API для получения фотографий профиля пользователя
        const telegramApiUrl = `https://api.telegram.org/bot${botToken}/getUserProfilePhotos?user_id=${userId}`;
        const response = await fetch(telegramApiUrl);
        const data = await response.json();

        let avatar = null;
        if (data.ok && data.result.total_count > 0) {
            const fileId = data.result.photos[0][0].file_id;

            // Запрос на получение информации о файле по его ID
            const fileInfoUrl = `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`;
            const fileResponse = await fetch(fileInfoUrl);
            const fileData = await fileResponse.json();

            if (fileData.ok) {
                avatar = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`;
            }
        }

        // Запрос для получения информации о пользователе (например, никнейм)
        const chatInfoUrl = `https://api.telegram.org/bot${botToken}/getChat?chat_id=${userId}`;
        const chatInfoResponse = await fetch(chatInfoUrl);
        const chatInfoData = await chatInfoResponse.json();

        let nickname = null;
        if (chatInfoData.ok && chatInfoData.result) {
            nickname = chatInfoData.result.username || chatInfoData.result.first_name || 'Unknown';
        }

        return res.status(200).json({ avatar, nickname });
    } catch (error) {
        console.error('Error fetching avatar or nickname:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
