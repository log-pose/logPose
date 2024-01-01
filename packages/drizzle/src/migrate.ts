import logger from "@logpose/logger";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import psqlClient from "./config";

async function main() {
  logger.info("Starting migration");
  await migrate(psqlClient, { migrationsFolder: "drizzle" });
  logger.info("Migration completed");
  process.exit(0);
}

main().catch((err) => {
  logger.error(err);
  process.exit(1);
});
