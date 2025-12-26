CREATE TYPE "public"."country_applied_to" AS ENUM('United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Netherlands', 'Sweden', 'Switzerland', 'Japan', 'South Korea');--> statement-breakpoint
CREATE TYPE "public"."intake_month" AS ENUM('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');--> statement-breakpoint
CREATE TYPE "public"."intake_year" AS ENUM('2025', '2026', '2027', '2028', '2029', '2030');--> statement-breakpoint
CREATE TYPE "public"."study_level" AS ENUM('Bachelor''s Degree', 'Master''s Degree', 'PhD', 'Language School');--> statement-breakpoint
CREATE TABLE "connect_students" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"country_applied_to_enum" "country_applied_to" NOT NULL,
	"city_applied_to" varchar(100) NOT NULL,
	"intake_year_enum" "intake_year" NOT NULL,
	"intake_month" "intake_year" NOT NULL,
	"study_level" "study_level" NOT NULL,
	"university_name" text NOT NULL,
	"current_status" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "connect_students" ADD CONSTRAINT "connect_students_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "favorite_mentor_idx" ON "favorite" USING btree ("mentor_id","student_id");--> statement-breakpoint
CREATE INDEX "school_idx" ON "school" USING btree ("id");