import redisClient from '../utils/redis.js';
import dbClient from '../utils/db.js';

class AppController {
    static getStatus(req, res) {
        const status = {
        redis: redisClient.isAlive(),
        db: dbClient.isAlive(),
        };
        return res.status(200).json(status);
    };

    static async getStats(req, res) {
        try {
            const users = await dbClient.nbUsers();
            const files = await dbClient.nbFiles();
            return res.status(200).json({ users, files });
        }
        catch (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default AppController;
