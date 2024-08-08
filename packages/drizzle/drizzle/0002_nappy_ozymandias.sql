CREATE TABLE IF NOT EXISTS "org_invite" (
	"token" varchar PRIMARY KEY NOT NULL,
	"timestamp" integer DEFAULT extract(epoch from now()) NOT NULL,
	"invitee" varchar NOT NULL,
	"role" "org_roles",
	"inviter" uuid,
	"org_id" uuid
);
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "username" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "org_invite" ADD CONSTRAINT "org_invite_inviter_user_id_fk" FOREIGN KEY ("inviter") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "org_invite" ADD CONSTRAINT "org_invite_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "organization"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
