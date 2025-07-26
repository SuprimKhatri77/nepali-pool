ALTER TABLE "mentor_profile" DROP CONSTRAINT "mentor_profile_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "student_profile" DROP CONSTRAINT "student_profile_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "mentor_profile" ADD CONSTRAINT "mentor_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_profile" ADD CONSTRAINT "student_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;