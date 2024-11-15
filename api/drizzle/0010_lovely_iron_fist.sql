DO $$ BEGIN
 CREATE TYPE "public"."notification_type_enum" AS ENUM('telegram');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "monitor_notification" (
	"monitor_id" uuid,
	"notification_entity_id" uuid,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "monitor_notification_monitor_id_notification_entity_id_unique" UNIQUE("monitor_id","notification_entity_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notification_entity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"type" "notification_type_enum",
	"additional_info" json
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "monitor_notification" ADD CONSTRAINT "monitor_notification_monitor_id_monitors_id_fk" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "monitor_notification" ADD CONSTRAINT "monitor_notification_notification_entity_id_notification_entity_id_fk" FOREIGN KEY ("notification_entity_id") REFERENCES "public"."notification_entity"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
