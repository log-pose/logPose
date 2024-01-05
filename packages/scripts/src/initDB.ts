import { psqlClient, roles } from "@logpose/drizzle";
import { server_kind } from "@logpose/drizzle/dist/schema";
import logger from "@logpose/logger";

async function initPSQL() {
  try {
    await psqlClient
      .insert(roles)
      .values([{ role_name: "admin" }, { role_name: "user" }])
      .onConflictDoNothing();

    await psqlClient
      .insert(server_kind)
      .values([
        { kind_name: "tcp", required_fields: "ip,port" },
        { kind_name: "http", required_fields: "uri" },
      ])
      .onConflictDoNothing();

    logger.info("Successfully initialized database");
  } catch (err: any) {
    throw new Error("Failed to initialize database");
  }
}

export { initPSQL };
