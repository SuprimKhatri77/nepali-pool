CREATE TYPE "public"."budget_readiness" AS ENUM('ready', 'partially_ready', 'planning');--> statement-breakpoint
CREATE TYPE "public"."english_level" AS ENUM('beginner', 'intermediate', 'advanced', 'fluent');--> statement-breakpoint
CREATE TYPE "public"."mentor_enquiry_status" AS ENUM('new', 'accepted', 'declined', 'withdrawn');--> statement-breakpoint
CREATE TABLE "mentor_enquiry" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference_code" varchar(20) NOT NULL,
	"mentor_id" text NOT NULL,
	"student_id" text NOT NULL,
	"full_name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"whatsapp_number" varchar(30) NOT NULL,
	"question" text NOT NULL,
	"qualification" varchar(200) NOT NULL,
	"target_course" varchar(200) NOT NULL,
	"english_level" "english_level" NOT NULL,
	"english_test_score" varchar(50),
	"intake_month" "intake_month" NOT NULL,
	"intake_year" "intake_year" NOT NULL,
	"budget_readiness" "budget_readiness" NOT NULL,
	"goals" text NOT NULL,
	"status" "mentor_enquiry_status" DEFAULT 'new' NOT NULL,
	"mentor_note" text,
	"responded_at" timestamp with time zone,
	"withdrawn_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mentor_enquiry_reference_code_unique" UNIQUE("reference_code")
);
--> statement-breakpoint
ALTER TABLE "mentor_enquiry" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "mentor_enquiry" ADD CONSTRAINT "mentor_enquiry_mentor_id_mentor_profile_user_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."mentor_profile"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentor_enquiry" ADD CONSTRAINT "mentor_enquiry_student_id_student_profile_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student_profile"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_mentor_enquiry_mentor_status" ON "mentor_enquiry" USING btree ("mentor_id","status");--> statement-breakpoint
CREATE INDEX "idx_mentor_enquiry_student" ON "mentor_enquiry" USING btree ("student_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_open_enquiry_per_mentor" ON "mentor_enquiry" USING btree ("student_id","mentor_id") WHERE "mentor_enquiry"."status" = 'new';