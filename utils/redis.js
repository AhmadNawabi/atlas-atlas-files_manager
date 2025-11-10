import { createClient } from 'redis';

class RedisClient {
    constructor() {
        // Clreate a redis client
        this.client = createClient();

        this.client.on('error', (err) => {
            console.error('Redis Client Error:', err.message);
        });

        this.client.connect()
        .this(() => console.log('Connected to Redis'))
        .catch((err) => console.error('Redis connection failed:', err.message))
    }

    // Return true if Redis is connected, False otherwise
    isAlive() {
        return this.client.isOpen;
    }

    async get(key) {
        try {
            const value = await this.client.get(key);
            return value;
        }   catch (err) {
            console.error('Redis GET Error:', err.message);
            return null;
        }
    }

    // Store a key-value pair in Redis with an expiration time
    async set(key, value, duration) {
        try {
            await this.client.set(key, value, { EX: duration });
        }   catch (err) {
            console.error('Redis SET Error:', err.message);
        }
    }

    // Delete key from Redis
    async del(key) {
        try {
            await this.client.del(key);
        }   catch (err) {
            console.error('Redis DEL Error:', err.message);
        }
    }
}

// Create and expert a single RedisClient instance
const redisClient = new RedisClient();
export default redisClient;
