import { createClient } from 'redis';

class RedisClient {
  constructor() {
    // Create a Redis client
    this.client = createClient();

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err.message);
    });

    // Connect to Redis
    this.client
      .connect()
      .then(() => console.log('Connected to Redis'))
      .catch((err) => console.error('Redis connection failed:', err.message));
  }

  isAlive() {
    return this.client.isOpen;
  }

  async get(key) {
    try {
      const value = await this.client.get(key);
      return value;
    } catch (err) {
      console.error('Redis GET Error:', err.message);
      return null;
    }
  }

  async set(key, value, duration) {
    try {
      await this.client.set(key, value, { EX: duration });
    } catch (err) {
      console.error('Redis SET Error:', err.message);
    }
  }


  async del(key) {
    try {
      await this.client.del(key);
    } catch (err) {
      console.error('Redis DEL Error:', err.message);
    }
  }
}

const redisClient = new RedisClient();
export default redisClient;
