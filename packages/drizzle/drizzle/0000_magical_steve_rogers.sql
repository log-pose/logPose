DO $$ BEGIN
 CREATE TYPE "user_plan" AS ENUM('free');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "org_roles" AS ENUM('admin', 'read', 'write');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organization" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_name" varchar,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now(),
	"org_plan" "user_plan"
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "server" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ip" varchar,
	"port" integer,
	"server_name" varchar,
	"connection_string" varchar,
	"server_kind_id" uuid NOT NULL,
	"heartbeat_interval" integer DEFAULT 60,
	"retries" integer DEFAULT 3,
	"user_id" uuid NOT NULL,
	"last_updated" timestamp DEFAULT now(),
	"uri" varchar,
	"active" boolean DEFAULT true,
	CONSTRAINT "server_server_name_user_id_server_kind_id_unique" UNIQUE("server_name","user_id","server_kind_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "server_kind" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind_name" varchar NOT NULL,
	"required_fields" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "server_kind_kind_name_unique" UNIQUE("kind_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar,
	"password" varchar,
	"email" varchar,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_org" (
	"user_id" uuid,
	"org_id" uuid,
	"role" "org_roles",
	CONSTRAINT "user_org_org_id_user_id_unique" UNIQUE("org_id","user_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization" ADD CONSTRAINT "organization_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "server" ADD CONSTRAINT "server_server_kind_id_server_kind_id_fk" FOREIGN KEY ("server_kind_id") REFERENCES "server_kind"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "server" ADD CONSTRAINT "server_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_org" ADD CONSTRAINT "user_org_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_org" ADD CONSTRAINT "user_org_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
