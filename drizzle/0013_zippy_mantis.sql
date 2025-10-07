CREATE TYPE "public"."peferred_time_status" AS ENUM('pending', 'accepted', 'rejected');--> statement-breakpoint
CREATE TABLE "preferred_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"video_id" uuid,
	"student_preferred_time" timestamp with time zone NOT NULL,
	"mentor_preferred_time" timestamp with time zone,
	"status" "peferred_time_status" DEFAULT 'pending',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "preferred_table" ADD CONSTRAINT "preferred_table_video_id_video_call_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."video_call"("id") ON DELETE cascade ON UPDATE no action;