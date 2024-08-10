DROP TABLE "server_kind";--> statement-breakpoint
ALTER TABLE "server" DROP CONSTRAINT "server_server_name_user_id_server_kind_id_unique";--> statement-breakpoint
ALTER TABLE "server" DROP CONSTRAINT "server_server_kind_id_server_kind_id_fk";
--> statement-breakpoint
ALTER TABLE "server" DROP CONSTRAINT "server_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "server" ADD COLUMN "properties" json;--> statement-breakpoint
ALTER TABLE "server" ADD COLUMN "org_id" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "server" ADD CONSTRAINT "server_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "server" DROP COLUMN IF EXISTS "ip";--> statement-breakpoint
ALTER TABLE "server" DROP COLUMN IF EXISTS "port";--> statement-breakpoint
ALTER TABLE "server" DROP COLUMN IF EXISTS "connection_string";--> statement-breakpoint
ALTER TABLE "server" DROP COLUMN IF EXISTS "server_kind_id";--> statement-breakpoint
ALTER TABLE "server" DROP COLUMN IF EXISTS "heartbeat_interval";--> statement-breakpoint
ALTER TABLE "server" DROP COLUMN IF EXISTS "retries";--> statement-breakpoint
ALTER TABLE "server" DROP COLUMN IF EXISTS "user_id";--> statement-breakpoint
ALTER TABLE "server" DROP COLUMN IF EXISTS "uri";--> statement-breakpoint
ALTER TABLE "server" ADD CONSTRAINT "server_server_name_org_id_unique" UNIQUE("server_name","org_id");