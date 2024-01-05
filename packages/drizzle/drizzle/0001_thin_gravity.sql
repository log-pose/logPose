CREATE TABLE IF NOT EXISTS "server" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ip" varchar,
	"port" numeric,
	"server_name" varchar,
	"connecton_string" varchar,
	"server_kind_id" uuid NOT NULL,
	"heartbeat_interval" numeric NOT NULL,
	"retries" numeric NOT NULL,
	"user_id" uuid NOT NULL,
	"last_updated" timestamp DEFAULT now()
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
