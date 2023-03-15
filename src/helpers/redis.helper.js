import * as redis from 'redis';

export default class RedisHelper {
    constructor() {
      this.redisClient = redis.createClient()
      
      this.redisClient.on('error', (error) => {
        console.log(`Redis error: ${error}`);
      });

      this.redisClient.connect();
    }
    
    async setRedis({key, data, expired}) {
      const oneDay = 24 * 60 * 60 * 1000;
      if (!expired) expired = oneDay;

      await this.redisClient.set(key, JSON.stringify(data), {
        EX: expired,
        NX: true
      });
    }

    async getRedis(key) {
      const result = await this.redisClient.get(key);
      return JSON.parse(result);
    }

    async deleteRedis({key, isDeleteAllSimilar}) {
      if (isDeleteAllSimilar) {
        const keys = await this.redisClient.keys(`${key}*`);

        for (const key of keys) {
          await this.redisClient.del(key);
        }
      } else {
        await this.redisClient.del(key);
      }
    }
}