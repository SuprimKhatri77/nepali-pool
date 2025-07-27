CREATE TYPE "public"."sex" AS ENUM('male', 'female', 'other');--> statement-breakpoint
ALTER TABLE "mentor_profile" ALTER COLUMN "sex" SET DATA TYPE "public"."sex" USING "sex"::"public"."sex";--> statement-breakpoint
ALTER TABLE "student_profile" ADD COLUMN "district" varchar(30);--> statement-breakpoint
ALTER TABLE "student_profile" ADD COLUMN "phone" varchar(30);--> statement-breakpoint
ALTER TABLE "student_profile" ADD COLUMN "sex" "sex";