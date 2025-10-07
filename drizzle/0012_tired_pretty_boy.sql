ALTER TABLE "video_call" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "video_call" ALTER COLUMN "status" SET DEFAULT 'pending'::text;--> statement-breakpoint
DROP TYPE "public"."video_call_status";--> statement-breakpoint
CREATE TYPE "public"."video_call_status" AS ENUM('pending', 'scheduled', 'completed', 'cancelled');--> statement-breakpoint
ALTER TABLE "video_call" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."video_call_status";--> statement-breakpoint
ALTER TABLE "video_call" ALTER COLUMN "status" SET DATA TYPE "public"."video_call_status" USING "status"::"public"."video_call_status";