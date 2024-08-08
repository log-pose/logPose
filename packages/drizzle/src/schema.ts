import {sql} from "drizzle-orm";
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
	invitedRole: orgRoles('role'),
	inviter: uuid('inviter').references(() => user.id),
	orgId: uuid("org_id").references(() => org.id)
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

export const server_kind = pgTable("server_kind", {
	id: uuid("id")
		.default(sql`gen_random_uuid()`)
		.primaryKey(),
	kind_name: varchar("kind_name").unique().notNull(),
	required_fields: varchar("required_fields").notNull(),
	created_at: timestamp("created_at").default(sql`now()`),
});

export const server = pgTable(
	"server",
	{
		id: uuid("id")
			.default(sql`gen_random_uuid()`)
			.primaryKey(),
		ip: varchar("ip"),
		port: integer("port"),
		server_name: varchar("server_name"),
		connection_string: varchar("connection_string"),
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
	},
	(t) => ({
		unique_name_user_kind: unique().on(
			t.server_name,
			t.user_id,
			t.server_kind_id
		),
	})
);
