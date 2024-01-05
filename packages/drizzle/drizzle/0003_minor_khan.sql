ALTER TABLE "server" ALTER COLUMN "port" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "server" ALTER COLUMN "heartbeat_interval" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "server" ALTER COLUMN "heartbeat_interval" SET DEFAULT 60;--> statement-breakpoint
ALTER TABLE "server" ALTER COLUMN "heartbeat_interval" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "server" ALTER COLUMN "retries" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "server" ALTER COLUMN "retries" SET DEFAULT 3;--> statement-breakpoint
ALTER TABLE "server" ALTER COLUMN "retries" DROP NOT NULL;