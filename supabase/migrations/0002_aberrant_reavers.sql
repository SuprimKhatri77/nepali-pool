CREATE INDEX "idx_sub_student" ON "chat_subscription" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "idx_sub_mentor" ON "chat_subscription" USING btree ("mentor_id");--> statement-breakpoint
CREATE INDEX "idx_chats_student" ON "chats" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "idx_chats_mentor" ON "chats" USING btree ("mentor_id");--> statement-breakpoint
CREATE INDEX "idx_chats_lastMessage" ON "chats" USING btree ("lastMessageAt");--> statement-breakpoint
CREATE INDEX "idx_video_student" ON "video_call" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "idx_video_mentor" ON "video_call" USING btree ("mentor_id");--> statement-breakpoint
CREATE INDEX "idx_video_scheduledTime" ON "video_call" USING btree ("scheduled_time");