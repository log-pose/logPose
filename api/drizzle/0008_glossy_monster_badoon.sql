CREATE TABLE IF NOT EXISTS "monitor_failed" (
	"monitor_id" uuid,
	"fail_count" integer,
	"alert_sent_ts" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "monitor_status" (
	"start_ts" bigint,
	"end_ts" bigint,
	"monitor_id" uuid,
	"status_code" varchar,
	"success" boolean
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "monitor_failed" ADD CONSTRAINT "monitor_failed_monitor_id_monitors_id_fk" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "monitor_status" ADD CONSTRAINT "monitor_status_monitor_id_monitors_id_fk" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
