import {boolean, integer, pgEnum, pgTable, serial, timestamp, uuid, varchar, unique} from "drizzle-orm/pg-core";
import {sql} from "drizzle-orm";

// enums
export const roleEnum = pgEnum('role', ['super-admin', 'admin', 'user']);
export const fieldTypeEnum = pgEnum('field_type', ["text", "long", "date", "time", "checkbox", "radio", "select"])
//tables
export const user = pgTable("user", {
	id: serial("id").primaryKey(),
	email: varchar('email').notNull().unique(),
	phone: varchar('phone').notNull(),
	role: roleEnum('role').notNull().default("super-admin"),
	username: varchar("username").notNull(),
	password: varchar("password").notNull(),
	active: boolean("active").default(true),
	created_at: timestamp("created_at").default(sql`now()`),
});

export const events = pgTable('event', {
	evt_id: uuid('evt_id').default(sql`gen_random_uuid()`).primaryKey(),
	created_by: varchar('created_by').references(() => user.email),
	updated_by: varchar('updated_by').references(() => user.email),
	name: varchar('name', {length: 255}).notNull(),
	address: varchar('address', {length: 255}).notNull(),
	max_ppl: integer('max_ppl').notNull(),
	numb_of_sub_events: integer('numb_of_sub_events').notNull(),
	from: timestamp('from', {withTimezone: true}).notNull(),
	to: timestamp('to', {withTimezone: true}).notNull(),
	created_at: timestamp('created_at', {withTimezone: true}).defaultNow().notNull(),
	updated_at: timestamp('updated_at', {withTimezone: true}).defaultNow().notNull()
});

export const subEvents = pgTable('sub_event', {
	sub_evt_id: uuid('sub_evt_id').default(sql`gen_random_uuid()`).primaryKey(),
	evt_id: uuid('evt_id').references(() => events.evt_id),
	created_by: varchar('created_by').references(() => user.email),
	updated_by: varchar('updated_by').references(() => user.email),
	name: varchar('name', {length: 255}).notNull(),
	max_ppl: integer('max_ppl').notNull(),
	category_allowed: varchar('category_allowed', {length: 255}),
	from: timestamp('from', {withTimezone: true}).notNull(),
	to: timestamp('to', {withTimezone: true}).notNull(),
	created_at: timestamp('created_at', {withTimezone: true}).defaultNow().notNull(),
	updated_at: timestamp('updated_at', {withTimezone: true}).defaultNow().notNull()
});

export const forms = pgTable('forms', {
	id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
	name: varchar('name', {length: 255}).notNull(),
	description: varchar('description', {length: 500}),
	evt_id: uuid('evt_id').references(() => events.evt_id).notNull(),
	from: timestamp('from', {withTimezone: true}).notNull(),
	to: timestamp('to', {withTimezone: true}).notNull(),
	category_allowed: varchar('category_allowed', {length: 255}).notNull(),
	created_by: varchar('created_by').references(() => user.email),
	updated_by: varchar('updated_by').references(() => user.email),
	created_at: timestamp('created_at', {withTimezone: true}).defaultNow().notNull(),
	updated_at: timestamp('updated_at', {withTimezone: true}).defaultNow().notNull()
});

export const fields = pgTable('fields', {
	id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
	form_id: uuid('form_id').references(() => forms.id),
	heading: varchar('heading', {length: 255}).notNull(),
	description: varchar('description', {length: 500}),
	field_type: fieldTypeEnum("field_type").notNull(),
	is_required: boolean('is_required').default(false),
	options: varchar('options')
});

export const formSubmissions = pgTable("form_submissions", {
	id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
	user_id: serial('user_id').unique().notNull(),
	form_id: uuid('form_id').references(() => forms.id).notNull(),
	name: varchar("name").notNull(),
	phone: varchar("phone").notNull(),
	email: varchar("email").notNull(),
	created_at: timestamp("created_at").defaultNow()
});

export const submissionFields = pgTable("submission_fields", {
	id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
	submission_id: uuid("submission_id")
		.references(() => formSubmissions.id)
		.notNull(),
	field_id: uuid("field_id").references(() => fields.id).notNull(),
	value: varchar("value"),
	created_at: timestamp("created_at").defaultNow()
});

export const categories = pgTable("categories", {
	id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
	name: varchar("name").notNull().unique(),
	code: varchar("code").notNull().unique(),
	created_at: timestamp("created_at").defaultNow()
});

export const joinSubEvt = pgTable("join_sub_evt", {
	sub_evt_id: uuid('sub_evt_id').references(() => subEvents.sub_evt_id),
	user_id: uuid('user_id').references(() => formSubmissions.id),
	ts: timestamp("ts").defaultNow()
}, (t) => ({
	unq: unique().on(t.sub_evt_id, t.user_id)
}))
