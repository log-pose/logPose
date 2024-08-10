import logger from "@logpose/logger";
import psqlClient from "./config";
import {migrate} from "drizzle-orm/postgres-js/migrator";

async function main() {
	logger.info("Starting migration");
	await migrate(psqlClient, {migrationsFolder: "drizzle"});
	logger.info("Migration completed");
}

main().catch((err) => {
	logger.error(err);
});
