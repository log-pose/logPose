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

const setKeyJson = async (
  key: string,
  path: string | null | undefined,
  value: any
) => {
  if (!path) {
    path = "$";
  }
  await redisClient.json.set(key, path, value);
};

const getKeyJson = async (key: string, path?: any | null) => {
  return await redisClient.json.get(key, path);
};

const incrementJson = async (key: string, path: any, increment: number) => {
  await redisClient.json.numIncrBy(key, path, increment);
};

const arrAppendJson = async (key: string, path: any, value: any) => {
  await redisClient.json.arrAppend(key, path, value);
};

export {
  getKeyValue,
  setKeyValue,
  deleteKey,
  getKeys,
  setKeyWithExpiry,
  setKeyJson,
  getKeyJson,
  incrementJson,
  arrAppendJson,
};
