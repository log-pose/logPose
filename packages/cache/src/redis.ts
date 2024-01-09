import { createClient, RedisClientType } from "redis";

const redisCient: RedisClientType = createClient({
  url: process.env.REDIS_URL,
});

redisCient.on("error", (err) => console.log("Redis Client Error", err));

export default redisCient;
