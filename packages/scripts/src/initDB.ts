import { psqlClient, roles } from "@logpose/drizzle";
import logger from "@logpose/logger";

async function initPSQL() {
  try {
    await psqlClient
      .insert(roles)
      .values([{ role_name: "admin" }, { role_name: "user" }])
      .onConflictDoNothing();

    logger.info("Successfully initialized database");
  } catch (err: any) {
    throw new Error("Failed to initialize database");
  }
}

export { initPSQL };
