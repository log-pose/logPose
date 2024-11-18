ALTER TABLE "monitor_failed" DROP CONSTRAINT "monitor_failed_monitor_id_monitors_id_fk";
--> statement-breakpoint
ALTER TABLE "monitor_notification" DROP CONSTRAINT "monitor_notification_monitor_id_monitors_id_fk";
--> statement-breakpoint
ALTER TABLE "monitor_notification" DROP CONSTRAINT "monitor_notification_notification_entity_id_notification_entity_id_fk";
--> statement-breakpoint
ALTER TABLE "monitor_status" DROP CONSTRAINT "monitor_status_monitor_id_monitors_id_fk";
--> statement-breakpoint
ALTER TABLE "monitors" DROP CONSTRAINT "monitors_org_id_organization_id_fk";
--> statement-breakpoint
ALTER TABLE "organization" DROP CONSTRAINT "organization_created_by_lp_user_id_fk";
--> statement-breakpoint
ALTER TABLE "org_invite" DROP CONSTRAINT "org_invite_inviter_lp_user_id_fk";
--> statement-breakpoint
ALTER TABLE "org_invite" DROP CONSTRAINT "org_invite_org_id_organization_id_fk";
--> statement-breakpoint
ALTER TABLE "user_org" DROP CONSTRAINT "user_org_user_id_lp_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user_org" DROP CONSTRAINT "user_org_org_id_organization_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "monitor_failed" ADD CONSTRAINT "monitor_failed_monitor_id_monitors_id_fk" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitors"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "monitor_notification" ADD CONSTRAINT "monitor_notification_monitor_id_monitors_id_fk" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitors"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "monitor_notification" ADD CONSTRAINT "monitor_notification_notification_entity_id_notification_entity_id_fk" FOREIGN KEY ("notification_entity_id") REFERENCES "public"."notification_entity"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "monitor_status" ADD CONSTRAINT "monitor_status_monitor_id_monitors_id_fk" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitors"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "monitors" ADD CONSTRAINT "monitors_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organization" ADD CONSTRAINT "organization_created_by_lp_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."lp_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "org_invite" ADD CONSTRAINT "org_invite_inviter_lp_user_id_fk" FOREIGN KEY ("inviter") REFERENCES "public"."lp_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "org_invite" ADD CONSTRAINT "org_invite_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_org" ADD CONSTRAINT "user_org_user_id_lp_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."lp_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_org" ADD CONSTRAINT "user_org_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
