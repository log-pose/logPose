ALTER TABLE "org_invite" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "org_invite" ALTER COLUMN "inviter" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "org_invite" ALTER COLUMN "org_id" SET NOT NULL;