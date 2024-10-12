// pages/api/proxy.js
export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { profileId } = req.query;

        try {
            const response = await fetch(`https://supavpn.lol/profile/init?profileId=${profileId}`, {
                method: 'GET',
            });
            if (!response.ok) {
                return res.status(response.status).json({ error: 'Error from backend server' });
            }
            const data = await response.json();
            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
