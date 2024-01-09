import redisClient from "./redis";

const getKeyValue = async (key: string) => {
  const reply = await redisClient.get(key);
  return reply;
};

const setKeyValue = async (key: string, value: any) => {
  const reply = await redisClient.set(key, value);
  return reply;
};

const deleteKey = async (key: string) => {
  const reply = await redisClient.del(key);
  return reply;
};

const getKeys = async (key: string) => {
  const reply = await redisClient.keys(key);
  return reply;
};

const setKeyWithExpiry = async (key: string, value: any, expiry: number) => {
  const reply = await redisClient.set(key, value, { EX: expiry });
  return reply;
};

export { getKeyValue, setKeyValue, deleteKey, getKeys, setKeyWithExpiry };
