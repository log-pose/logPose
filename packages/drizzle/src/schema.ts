import { sql } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar, serial } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  username: varchar("username"),
  password: varchar("password"),
  email: varchar("email").unique(),
  created_at: timestamp("created_at").default(sql`now()`),
});

export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  role_name: varchar("role_name").unique(),
  created_at: timestamp("created_at").default(sql`now()`),
});

export const user_roles = pgTable("user_roles", {
  user_id: uuid("user_id").references(() => user.id),
  role_id: serial("role_id").references(() => roles.id),
});
