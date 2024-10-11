DO $$ BEGIN
 CREATE TYPE "public"."user_plan" AS ENUM('free');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."org_roles" AS ENUM('admin', 'read', 'write');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organization" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_name" varchar,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now(),
	"org_plan" "user_plan",
	CONSTRAINT "organization_org_name_unique" UNIQUE("org_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "org_invite" (
	"token" varchar PRIMARY KEY NOT NULL,
	"timestamp" integer DEFAULT extract(epoch from now()) NOT NULL,
	"invitee" varchar NOT NULL,
	"role" "org_roles" NOT NULL,
	"inviter" uuid NOT NULL,
	"org_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar NOT NULL,
	"password" varchar NOT NULL,
	"email" varchar NOT NULL,
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
 ALTER TABLE "organization" ADD CONSTRAINT "organization_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "org_invite" ADD CONSTRAINT "org_invite_inviter_user_id_fk" FOREIGN KEY ("inviter") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "org_invite" ADD CONSTRAINT "org_invite_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_org" ADD CONSTRAINT "user_org_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_org" ADD CONSTRAINT "user_org_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
