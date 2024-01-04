import psqlClient from "./config";
import { user, user_roles, roles } from "./schema";
export * from "drizzle-orm";

export { psqlClient, user, user_roles, roles };
