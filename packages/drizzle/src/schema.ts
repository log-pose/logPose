import {sql} from "drizzle-orm";
import {json} from "drizzle-orm/pg-core";
import {
	pgTable,
	timestamp,
	uuid,
	varchar,
	integer,
	unique,
	boolean,
	pgEnum
} from "drizzle-orm/pg-core";

export const orgPlans = pgEnum("user_plan", ["free"])
export const org = pgTable("organization", {
	id: uuid("id")
		.default(sql`gen_random_uuid()`)
		.primaryKey(),
	name: varchar("org_name").unique(),
	created_by: uuid("created_by").references(() => user.id),
	created_at: timestamp("created_at").default(sql`now()`),
	plan: orgPlans("org_plan")
})


export const orgRoles = pgEnum('org_roles', ['admin', 'read', 'write'])
export const userOrg = pgTable("user_org", {
	userId: uuid("user_id").references(() => user.id),
	orgId: uuid("org_id").references(() => org.id),
	role: orgRoles('role')
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
	invitedRole: orgRoles('role').notNull(),
	inviter: uuid('inviter').references(() => user.id).notNull(),
	orgId: uuid("org_id").references(() => org.id).notNull()
})

export const user = pgTable("user", {
	id: uuid("id")
		.default(sql`gen_random_uuid()`)
		.primaryKey(),
	username: varchar("username").notNull(),
	password: varchar("password").notNull(),
	email: varchar("email").unique().notNull(),
	created_at: timestamp("created_at").default(sql`now()`),
});


