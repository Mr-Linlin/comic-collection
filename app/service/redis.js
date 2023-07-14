'use strict';
const Service = require('egg').Service;
const time = 60 * 60 * 24 * 3; // 默认缓存失效时间 7天
class RedisService extends Service {
  // 设置
  async set(key, value, seconds) {
    // seconds 有效时长
    const { redis } = this.app;
    value = JSON.stringify(value);
    if (!seconds) {
      // await redis.set(key, value);
      await redis.set(key, value, 'EX', time);
    } else {
      // 设置有效时间
      await redis.set(key, value, 'EX', seconds);
    }
  }
  // 获取
  async get(key) {
    const { redis } = this.app;
    let data = await redis.get(key);
    if (!data) return;
    data = JSON.parse(data);
    return data;
  }
  // 清空redis
  async flushall() {
    const { redis } = this.app;
    redis.flushall();
    return;
  }
}
module.exports = RedisService;
