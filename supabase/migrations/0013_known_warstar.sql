ALTER TABLE "meeting_session" DROP CONSTRAINT "meeting_session_student_id_student_profile_user_id_fk";
--> statement-breakpoint
ALTER TABLE "meeting_session" ADD CONSTRAINT "meeting_session_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;