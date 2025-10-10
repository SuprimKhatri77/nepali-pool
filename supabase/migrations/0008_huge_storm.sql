ALTER TABLE "preferred_time_log" DROP CONSTRAINT "preferred_time_log_video_id_video_call_id_fk";
--> statement-breakpoint
ALTER TABLE "preferred_time_log" ADD CONSTRAINT "preferred_time_log_video_id_video_call_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."video_call"("id") ON DELETE cascade ON UPDATE no action;