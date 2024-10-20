DO $$ BEGIN
 CREATE TYPE "public"."monitor_types" AS ENUM('http');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."ping_interval" AS ENUM('60', '600', '900', '1800', '3600', '10800', '21600', '43200', '86400');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "monitors" (
	"org_id" uuid,
	"name" varchar NOT NULL,
	"monitor_types" "monitor_types" NOT NULL,
	"ping_interval" "ping_interval" DEFAULT '900' NOT NULL,
	"additional_info" json
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "monitors" ADD CONSTRAINT "monitors_org_id_lp_user_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."lp_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
