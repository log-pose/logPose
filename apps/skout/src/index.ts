import logger from "@logpose/logger";
import cron from "node-cron";
import { Server } from "./serverTypes";

logger.info("Starting Monitoring");
cron.schedule("*/10 * * * * *", async () => {
  new Server();
});
