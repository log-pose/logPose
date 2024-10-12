DO $$ BEGIN
 CREATE TYPE "public"."heartbeat_enum" AS ENUM('1', '15', '30', '45', '60', '120', '180', '720', '1440');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."monitor_kind" AS ENUM('http');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "monitors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar,
	"kind" "monitor_kind",
	"org_id" uuid,
	"heartbeat_interval" "heartbeat_enum",
	"retries" integer,
	"url" varchar,
	"active" boolean,
	CONSTRAINT "monitors_name_kind_org_id_unique" UNIQUE("name","kind","org_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "monitors" ADD CONSTRAINT "monitors_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
