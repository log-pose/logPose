import { createClient } from "redis";

const redisCient = createClient();

redisCient.on("error", (err) => console.log("Redis Client Error", err));

export default redisCient;
