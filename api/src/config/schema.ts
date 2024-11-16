import { boolean, integer, pgEnum, pgTable, timestamp, uuid, varchar, unique, json, bigint } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import * as c from "../lib/constants"

// Enums
export const orgRoleEnum = pgEnum('org_roles', c.orgRoles)
export const orgPlanEnum = pgEnum("user_plan", c.userPlans)
export const monitorTypesEnum = pgEnum("monitor_types", c.monitorTypes)
export const pingIntervalEnum = pgEnum("ping_interval", c.pingInterval)
export const notificationTypeEnum= pgEnum("notification_type_enum", c.notificationEntity)

// Tables
export const user = pgTable("lp_user", {
	id: uuid("id")
		.default(sql`gen_random_uuid()`)
		.primaryKey(),
	username: varchar("username").notNull(),
	password: varchar("password").notNull(),
	email: varchar("email").unique().notNull(),
	created_at: timestamp("created_at").default(sql`now()`),
});
export const org = pgTable("organization", {
	id: uuid("id")
		.default(sql`gen_random_uuid()`)
		.primaryKey(),
	name: varchar("org_name").unique(),
	created_by: uuid("created_by").references(() => user.id),
	created_at: timestamp("created_at").default(sql`now()`),
	plan: orgPlanEnum("org_plan")
})
export const userOrg = pgTable("user_org", {
	userId: uuid("user_id").references(() => user.id),
	orgId: uuid("org_id").references(() => org.id),
	role: orgRoleEnum('role').notNull()
}, (t) => ({
	unique_user_org: unique().on(
		t.orgId,
		t.userId
	)
}))
export const orgInvite = pgTable("org_invite", {
	token: varchar("token").primaryKey(),
	timestamp: integer('timestamp')
		.notNull()
		.default(sql`extract(epoch from now())`),
	invitee: varchar("invitee").notNull(),
	invitedRole: orgRoleEnum('role').notNull(),
	inviter: uuid('inviter').references(() => user.id).notNull(),
	orgId: uuid("org_id").references(() => org.id).notNull()
})
export const monitors = pgTable("monitors", {
	id: uuid("id")
		.default(sql`gen_random_uuid()`)
		.primaryKey(),
	orgId: uuid("org_id").references(() => org.id).notNull(),
	name: varchar("name").notNull(),
	monitorType: monitorTypesEnum("monitor_types").notNull(),
	ping: pingIntervalEnum("ping_interval").default(c.pingEnum.FIFTEEN_MIN).notNull(), // choosing fifteen minute as default as not to overload
	isActive: boolean("is_active").default(true),
	additionalInfo: json("additional_info"),
	retries: integer("retries").default(3)
}, (t) => ({
	unique_org_monitor: unique().on(
		t.orgId,
		t.name
	)
}))

export const monitorStatus = pgTable("monitor_status", {
	startTs: bigint("start_ts", { mode: "bigint" }),
	endTs: bigint("end_ts", { mode: "bigint" }),
	monitorId: uuid("monitor_id").references(() => monitors.id),
	statusCode: varchar("status_code"),
	success: boolean("success"),
	response: varchar("resp")
})

export const monitorFailed = pgTable("monitor_failed", {
	monitorId: uuid("monitor_id").references(() => monitors.id),
	failCount: integer("fail_count"),
	alertSentTs: bigint("alert_sent_ts", { mode: "bigint" })
})

export const notificationEntity = pgTable("notification_entity", {
	id: uuid("id")
		.default(sql`gen_random_uuid()`)
		.primaryKey(),
	name : varchar("name").notNull(),
	type : notificationTypeEnum("type"),
	additionalInfo: json("additional_info"),
})

export const monitorNotifications = pgTable("monitor_notification", {
	monitorId: uuid("monitor_id").references(() => monitors.id),
	notificationEntityId: uuid("notification_entity_id").references(() => notificationEntity.id),
	isActive: boolean("is_active").default(true),
}, (t)=> ({
	unq : unique().on(
		t.monitorId,
		t.notificationEntityId
	)
}))