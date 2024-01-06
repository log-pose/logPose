import { sql } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  uuid,
  varchar,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

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
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  role_name: varchar("role_name").unique(),
  created_at: timestamp("created_at").default(sql`now()`),
});

export const user_roles = pgTable("user_roles", {
  user_id: uuid("user_id").references(() => user.id),
  role_id: uuid("role_id").references(() => roles.id),
});

export const server_kind = pgTable("server_kind", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  kind_name: varchar("kind_name").unique().notNull(),
  required_fields: varchar("required_fields").notNull(),
  created_at: timestamp("created_at").default(sql`now()`),
});

export const server = pgTable("server", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  ip: varchar("ip"),
  port: integer("port"),
  server_name: varchar("server_name"),
  connecton_string: varchar("connecton_string"),
  server_kind_id: uuid("server_kind_id")
    .references(() => server_kind.id)
    .notNull(),
  heartbeat_interval: integer("heartbeat_interval").default(60),
  retries: integer("retries").default(3),
  user_id: uuid("user_id")
    .references(() => user.id)
    .notNull(),
  last_updated: timestamp("last_updated").default(sql`now()`),
  uri: varchar("uri"),
  active: boolean("active").default(true),
});
