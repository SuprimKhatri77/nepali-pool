CREATE TYPE "public"."suggestedBy" AS ENUM('student', 'mentor');--> statement-breakpoint
CREATE TABLE "preferred_time_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"video_id" uuid,
	"suggested_by" "suggestedBy" NOT NULL,
	"suggested_time" timestamp with time zone NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "preferred_time_log" ADD CONSTRAINT "preferred_time_log_video_id_video_call_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."video_call"("id") ON DELETE no action ON UPDATE no action;