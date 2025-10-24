ALTER TABLE "meeting_session" ALTER COLUMN "city" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "meeting_session" ADD COLUMN "name" text NOT NULL;