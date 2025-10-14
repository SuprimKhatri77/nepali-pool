CREATE TYPE "public"."last_sent_by" AS ENUM('student', 'mentor');--> statement-breakpoint
ALTER TABLE "preferred_time" ADD COLUMN "last_sent_by" "last_sent_by" DEFAULT 'student';