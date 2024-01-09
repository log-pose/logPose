import logger from "@logpose/logger";
import cron from "node-cron";
import { Server } from "./serverTypes";
import { redisClient } from "@logpose/cache";

redisClient
  .connect()
  .then(() => {
    logger.info("Connected to Redis");
  })
  .catch((err) => {
    logger.error("Error connecting to Redis", err);
    process.exit(1);
  });

logger.info("Starting Monitoring");
cron.schedule("*/10 * * * * *", async () => {
  new Server();
});
