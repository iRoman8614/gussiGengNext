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

        if (data.ok && data.result.total_count > 0) {
            const fileId = data.result.photos[0][0].file_id;

            // Запрос на получение информации о файле по его ID
            const fileInfoUrl = `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`;
            const fileResponse = await fetch(fileInfoUrl);
            const fileData = await fileResponse.json();

            if (fileData.ok) {
                // Правильный путь к файлу
                const fileUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`;
                return res.status(200).json({ avatar: fileUrl });
            }
        }

        return res.status(404).json({ error: 'Avatar not found' });
    } catch (error) {
        console.error('Error fetching avatar:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
