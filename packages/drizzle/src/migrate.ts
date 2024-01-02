import logger from "@logpose/logger";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import psqlClient from "./config";

async function main() {
  logger.info("Starting migration");
  await migrate(psqlClient, { migrationsFolder: "drizzle" });
  logger.info("Migration completed");
}

main().catch((err) => {
  logger.error(err);
});
