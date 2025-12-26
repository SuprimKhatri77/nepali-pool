ALTER TABLE "connect_students" ALTER COLUMN "intake_month" SET DATA TYPE "public"."intake_month" USING "intake_month"::text::"public"."intake_month";--> statement-breakpoint
ALTER TABLE "connect_students" ADD CONSTRAINT "unqiue_user" PRIMARY KEY("user_id");--> statement-breakpoint
CREATE INDEX "student_index" ON "connect_students" USING btree ("user_id");