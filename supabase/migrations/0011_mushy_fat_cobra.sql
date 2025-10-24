CREATE TABLE "meeting_session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" text NOT NULL,
	"city" text,
	"email" text NOT NULL,
	"question" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "newsletter" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"is_confirmed" boolean DEFAULT false,
	"confirmed_at" timestamp,
	"confirmation_token" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "newsletter_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "meeting_session" ADD CONSTRAINT "meeting_session_student_id_student_profile_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student_profile"("user_id") ON DELETE cascade ON UPDATE no action;