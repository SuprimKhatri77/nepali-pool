ALTER TABLE "preferred_table" RENAME TO "preferred_time";--> statement-breakpoint
ALTER TABLE "preferred_time" DROP CONSTRAINT "preferred_table_video_id_video_call_id_fk";
--> statement-breakpoint
ALTER TABLE "preferred_time" ADD CONSTRAINT "preferred_time_video_id_video_call_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."video_call"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_video_id" ON "preferred_time" USING btree ("video_id");